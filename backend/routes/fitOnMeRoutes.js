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
    path.resolve(__dirname, '../../frontend/public', cleanPath),
    path.resolve(__dirname, '../../frontend/dist', cleanPath)
  ];

  for (const candidate of localCandidates) {
    if (fs.existsSync(candidate)) {
      const ext = path.extname(candidate).toLowerCase().replace('.', '') || 'jpeg';
      const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      const fileData = fs.readFileSync(candidate);
      return `data:${mime};base64,${fileData.toString('base64')}`;
    }
  }
  return productImgPath;
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

    // 3. Option B: Query Serverless IDM-VTON GPU Endpoint (Modal.com / RunPod) if configured
    dotenv.config();
    const vtonEndpoint = process.env.VTON_ENDPOINT_URL;
    let generatedImageUrl = null;
    let vtonMessage = null;

    if (vtonEndpoint) {
      try {
        console.log(`[VTON] Forwarding try-on request to Serverless GPU: ${vtonEndpoint}`);

        // Resolve product image to Base64 so remote Modal server can access it directly
        const resolvedProductImg = getProductImageBase64(productImage);

        const vtonResponse = await fetch(vtonEndpoint, {
          method: 'POST',
          signal: AbortSignal.timeout(120000), // 2-minute safety timeout
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
        } else {
          console.warn(`[VTON] Serverless worker returned status ${vtonResponse.status}`);
        }
      } catch (endpointError) {
        console.warn(`[VTON] Serverless GPU request fallback: ${endpointError.message}`);
      }
    }

    // 4. Update session usage count
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
      message: generatedImageUrl
        ? (vtonMessage || 'Virtual try-on generated via IDM-VTON serverless GPU')
        : 'AI Try-on validated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'AI try-on processing failed', error: error.message });
  }
});

export default router;
