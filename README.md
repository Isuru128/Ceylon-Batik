# Ceylon Batik

Ceylon Batik is an ecommerce storefront for Sri Lankan traditional handcrafted batik wear, built with a modern React + Vite frontend and a Node.js + Express + MongoDB backend.

## Project Structure

```
Ceylon-Batik/
├── frontend/     # React + Vite storefront application
└── backend/      # Node.js + Express REST API with MongoDB Atlas
```

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
- API Base URL: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Storefront URL: `http://localhost:5173`

## Features
- Dynamic product catalog with filters, search, and category navigation
- Rich product detail views with image gallery, zoom, and specs
- Cart and wishlist management with persistence
- AI-powered "Fit on Me" virtual try-on concept
- Multi-channel installment payment options (Koko, MintPay)
- JWT authentication and customer account profile