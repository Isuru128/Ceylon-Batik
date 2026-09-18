# IDM-VTON Serverless GPU Hosting (Option B: Scale-to-Zero)

This service hosts the **IDM-VTON (Virtual Try-On Diffusion)** model on a serverless GPU that **scales to 0** when idle. You only pay for the exact seconds compute is active (~$0.00022/sec on Nvidia L4, roughly **$0.008 per image**).

---

## Quick Setup with Modal.com ($30/month Free Tier)

[Modal.com](https://modal.com) provides $30/month in free compute credits every month, enough for ~3,000+ free try-on generations.

### Step 1: Install Modal CLI & Authenticate
```bash
pip install modal
modal setup
```
*(This opens a browser tab to create/authenticate your free Modal account.)*

---

### Step 2: Test the Serverless Worker
Test the app in ephemeral dev mode:
```bash
cd backend/vton-service
modal serve modal_app.py
```
Modal will build the container image, attach an Nvidia GPU, and print a temporary testing URL:
```text
✓ Created web endpoint: https://<username>--ceylon-batik-vton-idmvtonworker-tryon-dev.modal.run
```

---

### Step 3: Deploy to Production
Deploy the permanent endpoint:
```bash
modal deploy modal_app.py
```
You will receive your permanent production URL:
```text
✓ App deployed in 1.4s! View at https://modal.com/apps/<username>/ceylon-batik-vton
✓ Created web endpoint: https://<username>--ceylon-batik-vton-idmvtonworker-tryon.modal.run
```

---

### Step 4: Plug URL into Backend `.env`
Open `backend/.env` and paste your Modal URL:
```env
VTON_ENDPOINT_URL=https://<username>--ceylon-batik-vton-idmvtonworker-tryon.modal.run
```

Now, whenever a customer clicks **"Generate Try-On Preview"** on your storefront:
1. The Express backend relays the customer portrait and garment to your serverless GPU.
2. The GPU spins up, executes IDM-VTON, and returns the result.
3. After 60 seconds of inactivity, the GPU shuts down automatically to $0 cost!
