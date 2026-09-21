import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolves a product image path to a base64 Data URI so remote GPU workers can load it directly
 */
function getProductImageBase64(productImgPath) {
  if (!productImgPath) return null;
  if (productImgPath.startsWith('data:image/')) return productImgPath;

  const cleanPath = productImgPath.startsWith('/') ? productImgPath.slice(1) : productImgPath;
  const localCandidates = [
    path.resolve(__dirname, '../', cleanPath),
    path.resolve(__dirname, '../uploads', cleanPath.replace(/^uploads\/?/, '')),
    path.resolve(__dirname, '../uploads/products', path.basename(cleanPath)),
    path.resolve(process.cwd(), cleanPath),
    path.resolve(__dirname, '../../frontend/public', cleanPath),
    path.resolve(__dirname, '../../frontend/dist', cleanPath)
  ];

  for (const candidate of localCandidates) {
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        const ext = path.extname(candidate).toLowerCase().replace('.', '') || 'jpeg';
        const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'gif' ? 'image/gif' : 'image/jpeg';
        const fileData = fs.readFileSync(candidate);
        return `data:${mime};base64,${fileData.toString('base64')}`;
      }
    } catch {}
  }
  return productImgPath;
}

/**
 * Runs photorealistic Virtual Try-On using Replicate IDM-VTON model
 */
async function runReplicateTryOn({ replicateToken, humanImg, garmImg, productTitle, productCategory }) {
  // Map category to IDM-VTON category enum: 'dresses' | 'upper_body' | 'lower_body'
  let category = 'dresses';
  const cat = (productCategory || '').toLowerCase();
  if (cat.includes('sarong') || cat.includes('trouser') || cat.includes('skirt') || cat.includes('pants')) {
    category = 'lower_body';
  } else if (cat.includes('shirt') || cat.includes('top') || cat.includes('blouse') || cat.includes('jacket')) {
    category = 'upper_body';
  } else {
    // Sarees, dresses, kaftans, couple sets, gifts
    category = 'dresses';
  }

  const garmentDescription = `${productTitle || 'Handcrafted Sri Lankan Batik'}, high fashion batik wear, authentic wax-resist dyeing`;

  // IDM-VTON model version on Replicate (cuuupid/idm-vton)
  const version = '0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985';

  console.log(`[Replicate VTON] Sending prediction to cuuupid/idm-vton (Category: ${category}, Title: ${productTitle})...`);

  const startResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${replicateToken}`,
      'Content-Type': 'application/json',
      'Prefer': 'wait' // Replicate will wait up to 60s for direct response
    },
    body: JSON.stringify({
      version,
      input: {
        human_img: humanImg,
        garm_img: garmImg,
        garment_des: garmentDescription,
        category,
        crop: true, // Automatically crops customer portrait to 3:4 aspect ratio for optimal model alignment
        steps: 30, // 30 diffusion steps for high fidelity batik wax details
        force_dc: category === 'dresses', // DressCode weights for full body drape
        seed: 42
      }
    })
  });

  if (!startResponse.ok) {
    const errorBody = await startResponse.json().catch(() => ({}));
    if (startResponse.status === 402) {
      const err = new Error(errorBody.detail || 'Replicate account has insufficient credit. Please add credit at replicate.com/account/billing.');
      err.statusCode = 402;
      err.code = 'REPLICATE_PAYMENT_REQUIRED';
      throw err;
    }
    throw new Error(errorBody.detail || `Replicate API error: ${startResponse.status} ${startResponse.statusText}`);
  }

  let prediction = await startResponse.json();

  // If already succeeded from 'Prefer: wait'
  if (prediction.status === 'succeeded' && prediction.output) {
    console.log('[Replicate VTON] Prediction finished synchronously!');
    return Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
  }

  // Otherwise poll until complete (up to 90 seconds)
  const startTime = Date.now();
  console.log(`[Replicate VTON] Polling prediction ${prediction.id} (Status: ${prediction.status})...`);

  while (prediction.status === 'starting' || prediction.status === 'processing') {
    if (Date.now() - startTime > 90000) {
      throw new Error('Virtual try-on model generation timed out after 90 seconds.');
    }
    await new Promise((r) => setTimeout(r, 2500));

    const pollRes = await fetch(prediction.urls.get, {
      headers: { 'Authorization': `Bearer ${replicateToken}` }
    });
    if (pollRes.ok) {
      prediction = await pollRes.json();
      console.log(`[Replicate VTON] Status: ${prediction.status}`);
    }
  }

  if (prediction.status === 'failed') {
    throw new Error(prediction.error || 'Virtual try-on generation failed on Replicate.');
  }

  if (prediction.status === 'succeeded' && prediction.output) {
    return Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
  }

  throw new Error('No output image returned from Replicate model.');
}

const router = express.Router();

// ── Session Rate Limiter (Max 3 try-ons per user per session) ──
const MAX_TRYONS_PER_SESSION = 3;
const sessionUsageMap = new Map(); // sessionId -> { count: number, lastUsed: number }

// Periodically clean up sessions older than 4 hours
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of sessionUsageMap.entries()) {
    if (now - val.lastUsed > 4 * 60 * 60 * 1000) {
      sessionUsageMap.delete(key);
    }
  }
}, 30 * 60 * 1000);

// @route   POST /api/fit-on-me
// @desc    Process and validate AI Virtual Try-on preview with session rate limit
router.post('/', async (req, res) => {
  try {
    const {
      customerImage,
      productTitle,
      productImage,
      productCategory
    } = req.body;

    // 1. Session Rate Limit Check (Max 3 per session)
    const sessionId = req.headers['x-session-id'] || req.ip || 'default-session';
    const currentSession = sessionUsageMap.get(sessionId) || { count: 0, lastUsed: Date.now() };

    if (currentSession.count >= MAX_TRYONS_PER_SESSION) {
      return res.status(429).json({
        success: false,
        code: 'RATE_LIMIT_EXCEEDED',
        message: `You have reached your limit of ${MAX_TRYONS_PER_SESSION} try-on generations for this session.`,
        limit: MAX_TRYONS_PER_SESSION,
        used: currentSession.count,
        remaining: 0
      });
    }

    if (!customerImage || !productImage) {
      return res.status(400).json({
        success: false,
        message: 'Customer photo and product image are required'
      });
    }

    // 2. Strict 5MB file size limit check
    if (typeof customerImage === 'string' && customerImage.startsWith('data:image/')) {
      const base64Data = customerImage.split(',')[1] || '';
      const approximateSizeBytes = (base64Data.length * 3) / 4;
      const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
      if (approximateSizeBytes > MAX_BYTES) {
        return res.status(400).json({
          success: false,
          code: 'FILE_TOO_LARGE',
          message: 'Customer photo exceeds the maximum allowed upload size of 5MB.'
        });
      }
    }

    // 3. Resolve product image to Base64 data URI so remote AI models can access it directly
    const resolvedProductImg = getProductImageBase64(productImage);

    let generatedImageUrl = null;
    let vtonMessage = null;

    // 4. Primary: Replicate IDM-VTON API
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    if (replicateToken) {
      try {
        generatedImageUrl = await runReplicateTryOn({
          replicateToken,
          humanImg: customerImage,
          garmImg: resolvedProductImg,
          productTitle,
          productCategory
        });
        vtonMessage = 'Photorealistic Virtual Try-On generated via Replicate IDM-VTON AI';
      } catch (repErr) {
        console.error('[Replicate VTON Error]:', repErr.message);
        if (repErr.statusCode === 402 || repErr.code === 'REPLICATE_PAYMENT_REQUIRED') {
          return res.status(402).json({
            success: false,
            code: 'REPLICATE_PAYMENT_REQUIRED',
            message: 'Your Replicate account has insufficient credits to run the IDM-VTON model. Please add credits at https://replicate.com/account/billing.'
          });
        }
        // If not a billing error, fall through to alternative if configured
      }
    }

    // 5. Fallback: Serverless GPU Endpoint (Modal.com / RunPod) if configured and Replicate was not used/failed
    if (!generatedImageUrl && process.env.VTON_ENDPOINT_URL) {
      try {
        console.log(`[VTON] Forwarding to Serverless GPU: ${process.env.VTON_ENDPOINT_URL}`);
        const vtonResponse = await fetch(process.env.VTON_ENDPOINT_URL, {
          method: 'POST',
          signal: AbortSignal.timeout(60000),
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.VTON_API_KEY ? { 'Authorization': `Bearer ${process.env.VTON_API_KEY}` } : {})
          },
          body: JSON.stringify({
            human_img: customerImage,
            garm_img: resolvedProductImg,
            garment_des: productTitle || 'Ceylon Batik Handcrafted Wear',
            category: productCategory || 'dresses'
          })
        });

        if (vtonResponse.ok) {
          const vtonData = await vtonResponse.json();
          if (vtonData && vtonData.imageUrl) {
            generatedImageUrl = vtonData.imageUrl;
            vtonMessage = vtonData.message;
          }
        }
      } catch (endpointError) {
        console.warn(`[VTON] Serverless GPU request fallback failed: ${endpointError.message}`);
      }
    }

    // If neither returned an image, report error cleanly rather than falling back to broken canvas
    if (!generatedImageUrl) {
      return res.status(502).json({
        success: false,
        message: 'AI Virtual Try-On service is temporarily unavailable. Please check your Replicate account credits or try again in a few moments.'
      });
    }

    // 6. Update session usage count
    currentSession.count += 1;
    currentSession.lastUsed = Date.now();
    sessionUsageMap.set(sessionId, currentSession);
    const remaining = Math.max(0, MAX_TRYONS_PER_SESSION - currentSession.count);

    res.json({
      success: true,
      imageUrl: generatedImageUrl,
      productTitle: productTitle || 'Ceylon Batik Wear',
      limit: MAX_TRYONS_PER_SESSION,
      used: currentSession.count,
      remaining,
      message: vtonMessage || 'Virtual try-on completed successfully'
    });
  } catch (error) {
    console.error('[FitOnMe Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'AI try-on processing failed' });
  }
});

export default router;

