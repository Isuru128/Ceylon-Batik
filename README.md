# Ceylon Batik

Ceylon Batik is a Spring Boot and Thymeleaf storefront for Sri Lankan traditional batik wear. The website presents handcrafted sarees, dresses, sarongs, couple sets, gift products, and custom batik looks with product cards, shop filtering, wishlist actions, cart actions, detailed product pages, installment-payment messaging, and an AI-powered virtual try-on concept.

## Website Overview

The site is designed as an ecommerce front end for a batik fashion brand. It includes a branded homepage, product collections, product detail pages, cart and wishlist views, and authentication screens.

Main customer flows:

- Browse featured products on the homepage.
- Open product cards from featured, collection, and shop sections.
- View product details with image thumbnails, zoom, sale labels, pricing, SKU, tags, and product specifications.
- Add products to cart.
- Add products to wishlist.
- Review cart items and totals.
- Sign in or create an account.
- Open the Fit on me AI preview from the product detail page.

Product detail features:

- Dynamic product content loaded from the selected product slug.
- Permanent portrait image layout.
- Thumbnail image switching.
- Large image zoom/lightbox.
- Sale badge display when an old price exists.
- Quantity plus/minus buttons.
- Add to cart button.
- Wishlist button.
- Product information tabs.

## Payment Gateways

The current UI displays installment-payment options for three payment providers:

- KokoPay
- MintPay

Payment text appears in quick view and product detail pages. The displayed installment values are calculated from the product price:

- 3 installments through KokoPay.
- 3 installments through MintPay.

The product detail page also shows:

- Cash on delivery availability.
- Free shipping progress messaging.

Important: these are currently front-end payment messages only. Real payment processing still requires backend payment gateway integration, provider API credentials, checkout session creation, payment status handling, and order persistence.

## AI Feature: Fit on me

The `Fit on me` feature is available only on `product-details`.

Customer flow:

1. Customer opens a product detail page.
2. Customer clicks the pink `Fit on me` button.
3. A modal opens.
4. Customer uploads their own photo.
5. The modal shows the uploaded customer image and the current product image.
6. Customer clicks `Generate preview`.
7. The frontend sends the customer image, product title, and product image to:

```text
POST /api/fit-on-me
```

Expected backend response:

```json
{
  "imageUrl": "https://example.com/generated-preview.png"
}
```

If the backend endpoint is not available, the frontend uses a local canvas fallback preview. This fallback is only a visual placeholder so the UI can be tested before the real AI service is connected.

To make the AI feature production-ready, connect `/api/fit-on-me` to an image generation or virtual try-on service that can:

- Accept a customer image.
- Accept the selected product image or product metadata.
- Generate a realistic try-on result.
- Return a generated image URL or base64 image.
- Validate uploads and protect customer privacy.
- Store or discard uploaded images according to the privacy policy.

## Project Structure

```text
src/main/resources/templates/
  cart.html
  index.html
  login.html
  product-detail.html
  register.html
  shop.html
  wishlist.html

src/main/resources/static/css/
  style.css

src/main/resources/static/js/
  script.js

src/main/resources/static/images/
  logo1.png
  logo2.png
  logo3.png
  01.jpeg
  02.jpg
  03.jpeg
```

## Technology Stack

- Java 21
- Spring Boot
- Thymeleaf templates
- Spring Web MVC
- Spring Security dependency included
- MongoDB dependency included
- Bootstrap 5
- Font Awesome
- Custom CSS and JavaScript

## Running the Project

Use the Maven wrapper from the project root.

Compile:

```bash
./mvnw -DskipTests compile
```

Run:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
.\mvnw.cmd -DskipTests compile
.\mvnw.cmd spring-boot:run
```

Default local URL:

```text
http://localhost:8080/
```

## Current Implementation Notes

- Product data is currently hardcoded in `script.js`.
- Cart and wishlist counters are front-end interactions only.
- Payment gateways are displayed in the UI but not connected to real payment APIs yet.
- The Fit on me modal is UI-ready and calls `/api/fit-on-me`, but the real AI backend endpoint still needs to be implemented.
- The local canvas fallback allows the Fit on me flow to be demonstrated without a backend AI service.
