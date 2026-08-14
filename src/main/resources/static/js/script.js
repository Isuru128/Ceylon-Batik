// ─── User Menu (localStorage-based auth) ─────────────────────────────────────
// Reads the user object saved to localStorage on login and renders either the
// Login button or a name-dropdown into every #userMenuSlot on the page.
(function initUserMenu() {
    const slots = document.querySelectorAll("#userMenuSlot");
    if (!slots.length) return;

    let user = null;
    try { user = JSON.parse(localStorage.getItem("user") || "null"); } catch {}

    slots.forEach(function (slot) {
        if (user && user.fullName) {
            // ── Logged-in state: name button + dropdown ──
            const firstName = user.fullName.split(" ")[0];
            slot.innerHTML =
                '<div class="cb-user-menu dropdown">' +
                  '<button class="login-link cb-user-btn dropdown-toggle" ' +
                          'type="button" id="cbUserDropdown" ' +
                          'data-bs-toggle="dropdown" aria-expanded="false" ' +
                          'aria-label="User menu">' +
                    '<i class="fa-solid fa-circle-user"></i>' +
                    '<span class="cb-user-name">' + _escHtml(firstName) + '</span>' +
                  '</button>' +
                  '<ul class="dropdown-menu dropdown-menu-end cb-user-dropdown" ' +
                      'aria-labelledby="cbUserDropdown">' +
                    '<li class="cb-user-dropdown-header">' +
                      '<i class="fa-solid fa-circle-user"></i>' +
                      '<span>' + _escHtml(user.fullName) + '</span>' +
                    '</li>' +
                    '<li><hr class="dropdown-divider"></li>' +
                    '<li><a class="dropdown-item" href="/profile.html">' +
                      '<i class="fa-regular fa-id-card"></i> My Profile' +
                    '</a></li>' +
                    '<li><a class="dropdown-item" href="/wishlist.html">' +
                      '<i class="fa-regular fa-heart"></i> Wishlist' +
                    '</a></li>' +
                    '<li><a class="dropdown-item" href="/cart.html">' +
                      '<i class="fa-solid fa-cart-shopping"></i> My Cart' +
                    '</a></li>' +
                    '<li><hr class="dropdown-divider"></li>' +
                    '<li><button class="dropdown-item text-danger cb-logout-btn" type="button">' +
                      '<i class="fa-solid fa-right-from-bracket"></i> Logout' +
                    '</button></li>' +
                  '</ul>' +
                '</div>';

            slot.querySelector(".cb-logout-btn").addEventListener("click", function () {
                localStorage.removeItem("user");
                window.location.href = "/index.html";
            });

        } else {
            // ── Guest state: Login link ──
            slot.innerHTML =
                '<a class="login-link" href="/login.html">' +
                  '<i class="fa-regular fa-user"></i>' +
                  '<span>Login</span>' +
                '</a>';
        }
    });

    function _escHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
})();
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.protocol === "file:") {
        document.querySelectorAll("img[src^='/images/']").forEach((image) => {
            image.src = `../static${image.getAttribute("src")}`;
        });
    }

    const header = document.querySelector(".site-header");
    const heroSection = document.querySelector(".hero-section");
    const heroMedia = document.querySelector(".hero-media img");
    const heroCopy = document.querySelector(".hero-copy");
    const heroCard = document.querySelector(".hero-card");
    const backToTop = document.getElementById("backToTop");
    const searchBar = document.getElementById("searchBar");
    const siteSearch = document.getElementById("siteSearch");
    const searchForm = document.querySelector(".search-form");
    const searchToggle = document.querySelector("[data-search-toggle]");
    const searchClose = document.querySelector("[data-search-close]");
    const cartCount = document.getElementById("cartCount");
    const wishlistCount = document.getElementById("wishlistCount");
    const cartButtons = document.querySelectorAll("[data-cart]");
    const wishlistButtons = document.querySelectorAll("[data-wishlist]");
    const filterButtons = document.querySelectorAll("[data-filter]");
    const productItems = document.querySelectorAll(".product-item");
    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    const formMessage = document.getElementById("formMessage");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link[href^='#']");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cartTotal = 0;
    let wishlistTotal = 0;
    let ticking = false;
    let updateFeaturedLoop = () => {};

    const getActiveFilter = () => document.querySelector("[data-filter].active")?.dataset.filter || "all";

    const applyProductVisibility = () => {
        const selectedFilter = getActiveFilter();
        const searchTerm = siteSearch?.value.trim().toLowerCase() || "";

        productItems.forEach((product) => {
            const categories = product.dataset.category || "";
            const text = product.textContent.toLowerCase();
            const matchesFilter = selectedFilter === "all" || categories.includes(selectedFilter);
            const matchesSearch = !searchTerm || text.includes(searchTerm);

            product.classList.toggle("is-hidden", !(matchesFilter && matchesSearch));
        });

        updateFeaturedLoop();
    };

    const updateScrollState = () => {
        const isScrolled = window.scrollY > 40;
        header?.classList.toggle("is-scrolled", isScrolled);
        backToTop?.classList.toggle("is-visible", window.scrollY > 420);

        if (!reduceMotion && heroMedia && heroSection) {
            const heroHeight = heroSection.offsetHeight || 1;
            const progress = Math.min(window.scrollY / heroHeight, 1);
            heroMedia.style.transform = `scale(${1.04 + progress * 0.05}) translateY(${progress * 34}px)`;
        }
    };

    const requestScrollUpdate = () => {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(() => {
            updateScrollState();
            ticking = false;
        });
    };

    const animateCounter = (element, value) => {
        if (!element) {
            return;
        }

        element.textContent = String(value);
        element.classList.remove("is-pulsing");
        void element.offsetWidth;
        element.classList.add("is-pulsing");
    };

    const revealElements = [
        heroCopy,
        heroCard,
        ...document.querySelectorAll(".category-pill, .section-heading, .filter-btn, .product-item, .craft-image, .craft-section .col-lg-6:last-child, .newsletter-content, .site-footer .row > *")
    ].filter(Boolean);

    if (reduceMotion) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    } else {
        revealElements.forEach((element, index) => {
            element.classList.add("reveal-on-scroll");
            element.style.setProperty("--reveal-delay", `${Math.min(index * 45, 360)}ms`);
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.16,
            rootMargin: "0px 0px -8% 0px"
        });

        revealElements.forEach((element) => revealObserver.observe(element));
    }

    const sections = [...document.querySelectorAll("main section[id], footer[id]")];

    if ("IntersectionObserver" in window && navLinks.length) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
                });
            });
        }, {
            threshold: 0.45,
            rootMargin: "-18% 0px -52% 0px"
        });

        sections.forEach((section) => navObserver.observe(section));
    }

    const addRipple = (button, event) => {
        if (reduceMotion) {
            return;
        }

        const rect = button.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height);

        ripple.className = "btn-ripple";
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

        button.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    };

    const quickViewModal = document.createElement("div");
    quickViewModal.className = "quick-view-modal";
    quickViewModal.setAttribute("aria-hidden", "true");
    quickViewModal.innerHTML = `
        <div class="quick-view-backdrop" data-quick-view-close></div>
        <section class="quick-view-dialog" role="dialog" aria-modal="true" aria-labelledby="quickViewTitle">
            <button class="quick-view-close" type="button" data-quick-view-close aria-label="Close quick view">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="quick-view-media" data-quick-view-media></div>
            <div class="quick-view-content">
                <p class="product-category" data-quick-view-category></p>
                <h2 id="quickViewTitle" data-quick-view-title></h2>
                <div class="quick-view-price">
                    <span class="old-price" data-quick-view-old-price></span>
                    <strong data-quick-view-price></strong>
                </div>
                <div class="quick-payments">
                    <p>3 X <strong data-installment-three></strong> or 4.5% cashback with <span>mintpay</span></p>
                    <p>or 3 X <strong data-installment-koko></strong> with <span>koko</span></p>
                    <p>or up to 4 X <strong data-installment-four></strong> with <span>payzy</span></p>
                </div>
                <p class="quick-view-description" data-quick-view-description></p>
                <div class="quick-view-actions">
                    <div class="quantity-stepper" aria-label="Quantity selector">
                        <button type="button" data-quick-qty-minus aria-label="Decrease quantity">-</button>
                        <input type="number" value="1" min="1" data-quick-qty aria-label="Quantity">
                        <button type="button" data-quick-qty-plus aria-label="Increase quantity">+</button>
                    </div>
                    <button class="btn add-cart-btn" type="button" data-quick-add-cart>
                        <i class="fa-solid fa-cart-plus"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        </section>
    `;
    document.body.appendChild(quickViewModal);

    const parsePrice = (priceText) => Number((priceText || "").replace(/[^\d.]/g, "")) || 0;
    const formatPrice = (value) => `Rs. ${Math.max(value, 0).toLocaleString("en-US")}`;
    const slugify = (value) => (value || "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const resolveAssetPath = (src) => window.location.protocol === "file:" && src.startsWith("/images/") ? `../static${src}` : src;
    const getProductDetailUrl = (slug) => `product-detail.html?product=${encodeURIComponent(slug)}`;

    const getProductDescription = (title, category) => {
        const lowerCategory = category.toLowerCase();

        if (lowerCategory.includes("saree")) {
            return "This saree is made with lightweight fabric and expressive batik motifs, giving the wearer a comfortable fit for office, school, festive, parties, outings, and weekend styling.";
        }

        if (lowerCategory.includes("couple") || lowerCategory.includes("sarong") || lowerCategory.includes("men")) {
            return "A coordinated Sri Lankan batik look with breathable fabric, handcrafted pattern work, and easy movement for resort days, family events, cultural celebrations, and gifting.";
        }

        if (lowerCategory.includes("gift")) {
            return "A ready-to-gift batik selection curated with color, craft, and presentation in mind. Ideal for birthdays, festival gifting, and thoughtful Sri Lankan fashion souvenirs.";
        }

        return `${title} brings Sri Lankan batik color into a comfortable everyday silhouette with handcrafted pattern detail, soft fabric, and an easy fit for warm island weather.`;
    };

    const productDetails = {
        "island-bloom-batik-dress-set": {
            title: "Island Bloom Batik Dress Set",
            category: "Cotton Dresses",
            price: "Rs. 6,990",
            oldPrice: "Rs. 8,950",
            sku: "CB-D214",
            tags: "batik dress, cotton dress, handmade, island wear, resort wear",
            images: ["/images/01.jpeg", "/images/02.jpg", "/images/03.jpeg"],
            description: "A breathable cotton batik dress set with soft movement, vivid island color, and hand-finished pattern work for daytime events, holidays, and warm-weather occasions.",
            specs: {
                fabric: "Cotton voile",
                length: "Midi length with coordinated batik finish",
                "wash care": "Hand wash separately in cold water",
                fit: "Relaxed everyday fit"
            }
        },
        "heritage-wax-art-cotton-saree": {
            title: "Heritage Wax Art Cotton Saree",
            category: "Handmade Sarees",
            price: "Rs. 9,450",
            oldPrice: "",
            sku: "CB-S2147",
            tags: "batik saree, cotton saree, handmade saree, office wear, festive wear",
            images: ["/images/02.jpg", "/images/01.jpeg", "/images/03.jpeg"],
            description: "This saree is made of lightweight cotton fabric and finished with expressive wax-resist batik motifs. It is comfortable for office, school, festive, parties, outings, and weekend styling.",
            specs: {
                fabric: "Cotton",
                length: "7 yards, includes coordinated unstiched 1 yard blouse piece",
                "wash care": "Handwash",
                blouse: "Included"
            }
        },
        "sunset-batik-sarong-couple-set": {
            title: "Sunset Batik Sarong Couple Set",
            category: "Couple Sets",
            price: "Rs. 10,900",
            oldPrice: "Rs. 12,500",
            sku: "CB-C110",
            tags: "couple set, batik sarong, Sri Lankan batik, matching outfits",
            images: ["/images/03.jpeg", "/images/01.jpeg", "/images/02.jpg"],
            description: "A coordinated couple batik set with easy movement, breathable fabric, and balanced color placement for family events, resort stays, and cultural celebrations.",
            specs: {
                fabric: "Cotton blend",
                includes: "Coordinated shirt and sarong styling",
                "wash care": "Gentle hand wash",
                occasion: "Couple events and resort wear"
            }
        },
        "made-to-measure-batik-look": {
            title: "Made-to-Measure Batik Look",
            category: "Custom Orders",
            price: "From Rs. 7,500",
            oldPrice: "",
            sku: "CB-MTM",
            tags: "custom batik, made to measure, handmade, bespoke batik",
            images: ["/images/01.jpeg", "/images/02.jpg", "/images/03.jpeg"],
            description: "A custom batik order tailored around your preferred color story, garment type, and measurements. Designed for customers who want a more personal Sri Lankan batik look.",
            specs: {
                fabric: "Selected after consultation",
                timeline: "Made to order",
                "wash care": "Based on selected fabric",
                sizing: "Customer measurements required"
            }
        },
        "lagoon-breeze-batik-kaftan": {
            title: "Lagoon Breeze Batik Kaftan",
            category: "Resort Wear",
            price: "Rs. 5,850",
            oldPrice: "",
            sku: "CB-K058",
            tags: "kaftan, resort wear, batik dress, handmade batik",
            images: ["/images/01.jpeg", "/images/03.jpeg", "/images/02.jpg"],
            description: "A soft resort kaftan with generous movement and handcrafted batik color, made for relaxed weekends, holidays, poolside styling, and warm Sri Lankan weather.",
            specs: {
                fabric: "Soft cotton blend",
                length: "Relaxed kaftan cut",
                "wash care": "Cold hand wash",
                fit: "Free-flow silhouette"
            }
        },
        "blue-lotus-evening-batik-saree": {
            title: "Blue Lotus Evening Batik Saree",
            category: "Silk Sarees",
            price: "Rs. 11,750",
            oldPrice: "Rs. 14,900",
            sku: "CB-S330",
            tags: "blue saree, evening saree, batik saree, lotus pattern",
            images: ["/images/02.jpg", "/images/03.jpeg", "/images/01.jpeg"],
            description: "An evening-ready batik saree with blue lotus-inspired pattern work, refined drape, and a polished finish for dinners, receptions, and formal occasions.",
            specs: {
                fabric: "Silk blend",
                length: "7 yards",
                "wash care": "Dry clean recommended",
                finish: "Evening batik finish"
            }
        },
        "temple-flower-shirt-and-sarong": {
            title: "Temple Flower Shirt & Sarong",
            category: "Men's Batik",
            price: "Rs. 8,400",
            oldPrice: "",
            sku: "CB-M084",
            tags: "mens batik, sarong, batik shirt, temple flower",
            images: ["/images/03.jpeg", "/images/02.jpg", "/images/01.jpeg"],
            description: "A men's batik shirt and sarong look with strong floral pattern language, breathable wear, and a clean finish for gatherings, ceremonies, and resort styling.",
            specs: {
                fabric: "Cotton blend",
                includes: "Shirt and sarong styling",
                "wash care": "Hand wash separately",
                fit: "Classic men's fit"
            }
        },
        "celebration-batik-gift-box": {
            title: "Celebration Batik Gift Box",
            category: "Gift Ready",
            price: "Rs. 4,950",
            oldPrice: "",
            sku: "CB-G049",
            tags: "batik gift, Sri Lankan souvenir, handmade gift, celebration box",
            images: ["/images/01.jpeg", "/images/02.jpg", "/images/03.jpeg"],
            description: "A curated batik gift selection with color, craft, and presentation in mind. Designed for birthdays, festival gifting, travel souvenirs, and thoughtful local presents.",
            specs: {
                contents: "Curated batik gift selection",
                packaging: "Gift-ready presentation",
                "wash care": "Care card included",
                occasion: "Celebrations and souvenirs"
            }
        }
    };

    productDetails["island-bloom-batik-dress"] = productDetails["island-bloom-batik-dress-set"];
    productDetails["heritage-wax-art-saree"] = productDetails["heritage-wax-art-cotton-saree"];
    productDetails["sunset-batik-sarong-set"] = productDetails["sunset-batik-sarong-couple-set"];

    const getProductDetail = (slug) => {
        const normalizedSlug = slugify(decodeURIComponent(slug || ""));
        return productDetails[slug] || productDetails[normalizedSlug] || productDetails["island-bloom-batik-dress-set"];
    };

    const getProductData = (card) => {
        const image = card.querySelector("img");
        const title = card.querySelector("h3")?.textContent.trim() || "Ceylon Batik Product";
        const category = card.querySelector(".product-category, span")?.textContent.trim() || "Batik Wear";
        const price = card.querySelector(".price-row strong, .mini-product p")?.textContent.trim() || "Rs. 0";
        const oldPrice = card.querySelector(".old-price")?.textContent.trim() || "";
        const pattern = card.querySelector(".pattern-preview");
        const patternClass = pattern?.closest(".pattern-blue") ? "pattern-blue" : pattern?.closest(".pattern-pink") ? "pattern-pink" : "";

        return {
            title,
            category,
            price,
            oldPrice,
            numericPrice: parsePrice(price),
            imageSrc: image?.getAttribute("src") || "",
            imageAlt: image?.getAttribute("alt") || title,
            hasPattern: Boolean(pattern),
            patternClass,
            description: getProductDescription(title, category)
        };
    };

    const openDetailImageLightbox = (src, alt) => {
        const existingLightbox = document.querySelector(".detail-image-lightbox");

        if (existingLightbox) {
            existingLightbox.remove();
        }

        const lightbox = document.createElement("div");
        lightbox.className = "detail-image-lightbox";
        lightbox.innerHTML = `
            <button class="detail-lightbox-close" type="button" aria-label="Close image view">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <img src="${src}" alt="${alt}">
        `;

        document.body.appendChild(lightbox);
        document.body.classList.add("modal-open");

        const closeLightbox = () => {
            lightbox.remove();
            document.body.classList.remove("modal-open");
            document.removeEventListener("keydown", handleLightboxKeydown);
        };

        const handleLightboxKeydown = (event) => {
            if (event.key === "Escape") {
                closeLightbox();
            }
        };

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox || event.target.closest(".detail-lightbox-close")) {
                closeLightbox();
            }
        });
        document.addEventListener("keydown", handleLightboxKeydown);
        lightbox.querySelector(".detail-lightbox-close")?.focus();
    };

    const loadImageForCanvas = (src) => new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });

    const drawCoverImage = (context, image, x, y, width, height) => {
        const scale = Math.max(width / image.width, height / image.height);
        const sourceWidth = width / scale;
        const sourceHeight = height / scale;
        const sourceX = (image.width - sourceWidth) / 2;
        const sourceY = (image.height - sourceHeight) / 2;

        context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
    };

    const createLocalFitPreview = async (customerImageSrc, productImageSrc, productTitle) => {
        const [customerImage, productImage] = await Promise.all([
            loadImageForCanvas(customerImageSrc),
            loadImageForCanvas(productImageSrc)
        ]);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = 900;
        canvas.height = 1200;
        context.fillStyle = "#f9f9e0";
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawCoverImage(context, customerImage, 0, 0, canvas.width, canvas.height);

        context.fillStyle = "rgba(31, 35, 95, 0.42)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.beginPath();
        context.roundRect(220, 240, 460, 620, 28);
        context.clip();
        drawCoverImage(context, productImage, 220, 240, 460, 620);
        context.restore();

        context.fillStyle = "rgba(255, 255, 255, 0.9)";
        context.fillRect(0, 1020, canvas.width, 180);
        context.fillStyle = "#1f235f";
        context.font = "700 34px Poppins, sans-serif";
        context.fillText(productTitle, 54, 1090);
        context.font = "500 24px Poppins, sans-serif";
        context.fillText("Fit preview", 54, 1132);

        return canvas.toDataURL("image/png");
    };

    const setupFitOnMeModal = (detailRoot, product) => {
        const fitButton = detailRoot.querySelector("[data-fit-on-me]");

        if (!fitButton || fitButton.dataset.fitReady === "true") {
            return;
        }

        fitButton.dataset.fitReady = "true";

        const fitModal = document.createElement("div");
        fitModal.className = "fit-modal";
        fitModal.setAttribute("aria-hidden", "true");
        fitModal.innerHTML = `
            <div class="fit-modal-backdrop" data-fit-close></div>
            <section class="fit-dialog" role="dialog" aria-modal="true" aria-labelledby="fitModalTitle">
                <button class="fit-close" type="button" data-fit-close aria-label="Close fit preview"><i class="fa-solid fa-xmark"></i></button>
                <div class="fit-panel">
                    <div>
                        <p class="eyebrow">Virtual Fit</p>
                        <h2 id="fitModalTitle">Fit on me</h2>
                    </div>
                    <label class="fit-upload">
                        <input type="file" accept="image/*" data-fit-upload>
                        <span><i class="fa-solid fa-cloud-arrow-up"></i>Upload your photo</span>
                    </label>
                    <div class="fit-preview-grid">
                        <figure>
                            <img data-fit-customer alt="Customer preview">
                            <figcaption>Your photo</figcaption>
                        </figure>
                        <figure>
                            <img data-fit-product alt="Selected batik product">
                            <figcaption>Current product</figcaption>
                        </figure>
                    </div>
                    <button class="btn fit-generate-btn" type="button" data-fit-generate><i class="fa-solid fa-wand-magic-sparkles"></i>Generate preview</button>
                    <p class="fit-status" data-fit-status></p>
                </div>
                <div class="fit-result">
                    <img data-fit-result alt="Generated fit preview">
                </div>
            </section>
        `;
        document.body.appendChild(fitModal);

        const uploadInput = fitModal.querySelector("[data-fit-upload]");
        const customerPreview = fitModal.querySelector("[data-fit-customer]");
        const productPreview = fitModal.querySelector("[data-fit-product]");
        const resultPreview = fitModal.querySelector("[data-fit-result]");
        const status = fitModal.querySelector("[data-fit-status]");
        let customerImageSrc = "";

        const setProductPreview = () => {
            const mainImage = detailRoot.querySelector("[data-detail-main-image]");
            productPreview.src = mainImage?.src || resolveAssetPath(product.images?.[0] || "/images/01.jpeg");
        };

        const closeFitModal = () => {
            fitModal.classList.remove("is-open");
            fitModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
        };

        fitButton.addEventListener("click", () => {
            setProductPreview();
            fitModal.classList.add("is-open");
            fitModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
            uploadInput.focus();
        });

        fitModal.querySelectorAll("[data-fit-close]").forEach((button) => {
            button.addEventListener("click", closeFitModal);
        });

        uploadInput.addEventListener("change", () => {
            const file = uploadInput.files?.[0];

            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                customerImageSrc = String(reader.result || "");
                customerPreview.src = customerImageSrc;
                customerPreview.closest("figure")?.classList.add("has-image");
                status.textContent = "";
            };
            reader.readAsDataURL(file);
        });

        fitModal.querySelector("[data-fit-generate]").addEventListener("click", async () => {
            if (!customerImageSrc) {
                status.textContent = "Upload a photo first.";
                uploadInput.focus();
                return;
            }

            status.textContent = "Generating preview...";
            setProductPreview();

            try {
                const formData = new FormData();
                formData.append("customerImage", uploadInput.files[0]);
                formData.append("productTitle", product.title);
                formData.append("productImage", productPreview.src);

                const response = await fetch("/api/fit-on-me", {
                    method: "POST",
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.imageUrl) {
                        resultPreview.src = data.imageUrl;
                        status.textContent = "Preview ready.";
                        return;
                    }
                }

                throw new Error("AI endpoint unavailable");
            } catch (error) {
                resultPreview.src = await createLocalFitPreview(customerImageSrc, productPreview.src, product.title);
                status.textContent = "Preview ready. Connect /api/fit-on-me for full AI generation.";
            }
        });
    };

    const renderProductDetailPage = () => {
        const detailRoot = document.querySelector("[data-product-detail]");

        if (!detailRoot) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const requestedSlug = params.get("product") || "island-bloom-batik-dress-set";
        const product = getProductDetail(requestedSlug);
        const numericPrice = parsePrice(product.price);
        const images = product.images?.length ? product.images : ["/images/01.jpeg"];
        const gallery = detailRoot.querySelector("[data-detail-gallery]");

        document.title = `${product.title} | Ceylon Batik`;
        detailRoot.querySelector("[data-detail-category]").textContent = product.category;
        detailRoot.querySelector("[data-detail-title]").textContent = product.title;
        detailRoot.querySelector("[data-detail-price]").textContent = product.price;
        detailRoot.querySelector("[data-detail-old-price]").textContent = product.oldPrice || "";
        detailRoot.querySelector("[data-detail-old-price]").classList.toggle("d-none", !product.oldPrice);
        detailRoot.querySelector("[data-detail-sale]").classList.toggle("d-none", !product.oldPrice);
        detailRoot.querySelector("[data-detail-installment-three]").textContent = formatPrice(numericPrice / 3);
        detailRoot.querySelector("[data-detail-installment-koko]").textContent = formatPrice(numericPrice / 3);
        detailRoot.querySelector("[data-detail-installment-four]").textContent = formatPrice(numericPrice / 4);
        detailRoot.querySelector("[data-detail-description]").textContent = product.description;
        detailRoot.querySelector("[data-detail-free-shipping]").textContent = formatPrice(Math.max(0, 12000 - numericPrice));
        detailRoot.querySelector("[data-detail-sku]").textContent = product.sku;
        detailRoot.querySelector("[data-detail-meta-category]").textContent = product.category;
        detailRoot.querySelector("[data-detail-tags]").textContent = product.tags;

        if (gallery) {
            gallery.innerHTML = `
                <div class="detail-thumbs" data-detail-thumbs></div>
                <div class="detail-main-media">
                    <img src="${resolveAssetPath(images[0])}" alt="${product.title}" data-detail-main-image>
                    <span class="detail-sale-badge" data-detail-sale>Sale</span>
                    <button class="detail-zoom-btn" type="button" aria-label="View larger image"><i class="fa-solid fa-expand"></i></button>
                </div>
            `;

            const thumbs = gallery.querySelector("[data-detail-thumbs]");
            const mainImage = gallery.querySelector("[data-detail-main-image]");
            const mediaSaleBadge = gallery.querySelector("[data-detail-sale]");

            mediaSaleBadge?.classList.toggle("d-none", !product.oldPrice);

            images.forEach((src, index) => {
                const thumb = document.createElement("button");
                thumb.type = "button";
                thumb.className = `detail-thumb${index === 0 ? " is-active" : ""}`;
                thumb.dataset.detailImageSrc = resolveAssetPath(src);
                thumb.dataset.detailImageAlt = `${product.title} view ${index + 1}`;
                thumb.setAttribute("aria-label", `Show ${product.title} image ${index + 1}`);
                thumb.innerHTML = `<img src="${resolveAssetPath(src)}" alt="${product.title} view ${index + 1}">`;
                thumbs.appendChild(thumb);
            });

        }

        const specsBody = detailRoot.querySelector("[data-detail-specs]");

        if (specsBody) {
            specsBody.innerHTML = Object.entries(product.specs || {})
                .map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`)
                .join("");
        }

        if (detailRoot.dataset.detailButtonsReady !== "true") {
            detailRoot.dataset.detailButtonsReady = "true";

            detailRoot.addEventListener("click", (event) => {
                const thumb = event.target.closest("[data-detail-image-src]");
                const zoomButton = event.target.closest(".detail-zoom-btn");
                const qtyMinus = event.target.closest("[data-detail-qty-minus]");
                const qtyPlus = event.target.closest("[data-detail-qty-plus]");
                const tab = event.target.closest("[data-detail-tab]");
                const cartButton = event.target.closest("[data-cart]");
                const wishlistButton = event.target.closest("[data-wishlist]");
                const qtyInput = detailRoot.querySelector("[data-detail-qty]");
                const mainImage = detailRoot.querySelector("[data-detail-main-image]");

                if (thumb && mainImage) {
                    mainImage.src = thumb.dataset.detailImageSrc;
                    mainImage.alt = thumb.dataset.detailImageAlt || product.title;
                    detailRoot.querySelectorAll(".detail-thumb").forEach((button) => button.classList.remove("is-active"));
                    thumb.classList.add("is-active");
                    return;
                }

                if (zoomButton && mainImage) {
                    openDetailImageLightbox(mainImage.src, mainImage.alt || product.title);
                    return;
                }

                if ((qtyMinus || qtyPlus) && qtyInput) {
                    const currentValue = Math.max(Number(qtyInput.value || 1), 1);
                    qtyInput.value = String(qtyMinus ? Math.max(currentValue - 1, 1) : currentValue + 1);
                    return;
                }

                if (tab) {
                    const target = tab.dataset.detailTab;
                    detailRoot.querySelectorAll("[data-detail-tab]").forEach((button) => button.classList.toggle("active", button === tab));
                    detailRoot.querySelectorAll("[data-detail-panel]").forEach((panel) => {
                        panel.classList.toggle("d-none", panel.dataset.detailPanel !== target);
                    });
                    return;
                }

                if (cartButton) {
                    const quantity = Math.max(Number(qtyInput?.value || 1), 1);
                    cartTotal += quantity;
                    animateCounter(cartCount, cartTotal);

                    const originalText = cartButton.innerHTML;
                    cartButton.innerHTML = '<i class="fa-solid fa-check"></i> Added';
                    cartButton.disabled = true;

                    setTimeout(() => {
                        cartButton.innerHTML = originalText;
                        cartButton.disabled = false;
                    }, 1200);
                    return;
                }

                if (wishlistButton) {
                    const isActive = wishlistButton.classList.toggle("is-active");
                    const icon = wishlistButton.querySelector("i");

                    wishlistTotal += isActive ? 1 : -1;
                    wishlistTotal = Math.max(wishlistTotal, 0);
                    animateCounter(wishlistCount, wishlistTotal);

                    icon?.classList.toggle("fa-regular", !isActive);
                    icon?.classList.toggle("fa-solid", isActive);
                }
            });
        }

        setupFitOnMeModal(detailRoot, product);
    };

    renderProductDetailPage();

    const setQuickViewMedia = (product) => {
        const media = quickViewModal.querySelector("[data-quick-view-media]");

        if (!media) {
            return;
        }

        if (product.hasPattern) {
            media.innerHTML = `<div class="quick-view-pattern ${product.patternClass}"><div class="pattern-preview" aria-hidden="true"></div></div>`;
            return;
        }

        media.innerHTML = `<img src="${product.imageSrc}" alt="${product.imageAlt}">`;
    };

    const closeQuickView = () => {
        quickViewModal.classList.remove("is-open");
        quickViewModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    };

    const openQuickView = (card) => {
        const product = getProductData(card);
        const qtyInput = quickViewModal.querySelector("[data-quick-qty]");

        setQuickViewMedia(product);
        quickViewModal.querySelector("[data-quick-view-category]").textContent = product.category;
        quickViewModal.querySelector("[data-quick-view-title]").textContent = product.title;
        quickViewModal.querySelector("[data-quick-view-price]").textContent = product.price;
        quickViewModal.querySelector("[data-quick-view-old-price]").textContent = product.oldPrice;
        quickViewModal.querySelector("[data-quick-view-old-price]").classList.toggle("d-none", !product.oldPrice);
        quickViewModal.querySelector("[data-quick-view-description]").textContent = product.description;
        quickViewModal.querySelector("[data-installment-three]").textContent = formatPrice(product.numericPrice / 3);
        quickViewModal.querySelector("[data-installment-koko]").textContent = formatPrice(product.numericPrice / 3);
        quickViewModal.querySelector("[data-installment-four]").textContent = formatPrice(product.numericPrice / 4);

        if (qtyInput) {
            qtyInput.value = "1";
        }

        quickViewModal.classList.add("is-open");
        quickViewModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        quickViewModal.querySelector("[data-quick-view-close]")?.focus();
    };

    document.querySelectorAll(".product-card, .mini-product").forEach((card) => {
        if (card.querySelector("[data-quick-view]")) {
            return;
        }

        const trigger = document.createElement("button");
        trigger.className = "quick-btn quick-view-btn";
        trigger.type = "button";
        trigger.dataset.quickView = "true";
        trigger.setAttribute("aria-label", "Quick view product");
        trigger.innerHTML = '<i class="fa-regular fa-eye"></i>';
        trigger.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            openQuickView(card);
        });

        const media = card.querySelector(".product-image") || card.querySelector(".mini-product-media") || card;
        media.appendChild(trigger);
    });

    document.querySelectorAll(".product-card, .mini-product").forEach((card) => {
        const interactiveSelector = "a, button, input, select, textarea, [role='button'], [data-no-detail]";
        const product = getProductData(card);
        const detailSlug = card.dataset.productSlug || slugify(product.title);
        const detailUrl = getProductDetailUrl(detailSlug);
        const openDetail = () => {
            window.location.href = detailUrl;
        };
        const detailLink = document.createElement("a");

        card.dataset.detailUrl = detailUrl;
        card.setAttribute("role", "link");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `View details for ${product.title}`);

        detailLink.className = "card-detail-link";
        detailLink.href = detailUrl;
        detailLink.setAttribute("aria-label", `View details for ${product.title}`);
        card.prepend(detailLink);

        card.addEventListener("click", (event) => {
            if (event.target.closest(interactiveSelector)) {
                return;
            }

            openDetail();
        });

        card.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            if (event.target.closest(interactiveSelector)) {
                return;
            }

            event.preventDefault();
            openDetail();
        });
    });

    quickViewModal.querySelectorAll("[data-quick-view-close]").forEach((button) => {
        button.addEventListener("click", closeQuickView);
    });

    quickViewModal.querySelector("[data-quick-qty-minus]")?.addEventListener("click", () => {
        const input = quickViewModal.querySelector("[data-quick-qty]");
        if (!input) {
            return;
        }
        input.value = String(Math.max(Number(input.value || 1) - 1, 1));
    });

    quickViewModal.querySelector("[data-quick-qty-plus]")?.addEventListener("click", () => {
        const input = quickViewModal.querySelector("[data-quick-qty]");
        if (!input) {
            return;
        }
        input.value = String(Number(input.value || 1) + 1);
    });

    quickViewModal.querySelector("[data-quick-add-cart]")?.addEventListener("click", (event) => {
        const input = quickViewModal.querySelector("[data-quick-qty]");
        cartTotal += Math.max(Number(input?.value || 1), 1);
        animateCounter(cartCount, cartTotal);
        addRipple(event.currentTarget, event);
        closeQuickView();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && quickViewModal.classList.contains("is-open")) {
            closeQuickView();
        }
    });

    document.querySelectorAll(".btn, .icon-btn, .filter-btn, .category-pill").forEach((button) => {
        button.addEventListener("click", (event) => addRipple(button, event));
    });

    document.querySelectorAll(".product-card").forEach((card) => {
        if (reduceMotion) {
            return;
        }

        card.addEventListener("pointermove", (event) => {
            if (window.innerWidth < 992) {
                return;
            }

            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            card.style.setProperty("--tilt-x", `${y * -7}deg`);
            card.style.setProperty("--tilt-y", `${x * 7}deg`);
            card.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
            card.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
            card.classList.add("is-tilting");
        });

        card.addEventListener("pointerleave", () => {
            card.classList.remove("is-tilting");
            card.style.setProperty("--tilt-x", "0deg");
            card.style.setProperty("--tilt-y", "0deg");
        });
    });

    const loopTrack = document.querySelector("[data-loop-track]");
    const loopItems = loopTrack ? [...loopTrack.querySelectorAll(".product-item")] : [];
    const loopPrev = document.querySelector("[data-loop-prev]");
    const loopNext = document.querySelector("[data-loop-next]");
    const loopDots = document.querySelector("[data-loop-dots]");
    let loopIndex = 0;
    let loopTimer;
    let loopAnimationTimer;
    let loopDirection = 1;
    let hasRenderedLoop = false;

    const getLoopSize = () => {
        if (window.innerWidth < 768) {
            return 1;
        }

        if (window.innerWidth < 1200) {
            return 2;
        }

        return 4;
    };

    const renderLoopDots = (pages) => {
        if (!loopDots) {
            return;
        }

        loopDots.innerHTML = "";

        for (let index = 0; index < pages; index += 1) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "loop-dot";
            dot.setAttribute("aria-label", `Show featured page ${index + 1}`);
            dot.addEventListener("click", () => {
                loopDirection = index >= loopIndex ? 1 : -1;
                loopIndex = index;
                updateFeaturedLoop();
                restartLoopTimer();
            });
            loopDots.appendChild(dot);
        }
    };

    updateFeaturedLoop = () => {
        if (!loopItems.length) {
            return;
        }

        const visibleItems = loopItems.filter((item) => !item.classList.contains("is-hidden"));
        const pageSize = getLoopSize();
        const pageCount = Math.max(Math.ceil(visibleItems.length / pageSize), 1);

        loopIndex = ((loopIndex % pageCount) + pageCount) % pageCount;
        renderLoopDots(pageCount);

        const start = loopIndex * pageSize;
        const activeItems = visibleItems.slice(start, start + pageSize);
        const currentItems = loopItems.filter((item) => !item.classList.contains("is-loop-hidden") && !item.classList.contains("is-hidden"));

        window.clearTimeout(loopAnimationTimer);

        const showActiveItems = () => {
            loopItems.forEach((item) => {
                item.classList.add("is-loop-hidden");
                item.classList.remove("loop-enter", "loop-exit");
            });

            activeItems.forEach((item, index) => {
                item.classList.remove("is-loop-hidden");
                item.classList.remove("loop-enter");
                item.style.setProperty("--loop-direction", String(loopDirection));
                item.style.setProperty("--reveal-delay", `${index * 140}ms`);
                void item.offsetWidth;
                item.classList.add("loop-enter");
            });
        };

        if (!hasRenderedLoop || reduceMotion || !currentItems.length) {
            showActiveItems();
            hasRenderedLoop = true;
        } else {
            currentItems.forEach((item) => {
                item.classList.remove("loop-enter");
                item.style.setProperty("--loop-direction", String(loopDirection));
                item.classList.add("loop-exit");
            });

            loopAnimationTimer = window.setTimeout(() => {
                showActiveItems();
                hasRenderedLoop = true;
            }, 260);
        }

        loopDots?.querySelectorAll(".loop-dot").forEach((dot, index) => {
            dot.classList.toggle("active", index === loopIndex);
        });
    };

    const moveLoop = (direction) => {
        const pageSize = getLoopSize();
        const visibleItems = loopItems.filter((item) => !item.classList.contains("is-hidden"));
        const pageCount = Math.max(Math.ceil(visibleItems.length / pageSize), 1);

        loopDirection = direction >= 0 ? 1 : -1;
        loopIndex = (loopIndex + direction + pageCount) % pageCount;
        updateFeaturedLoop();
    };

    const restartLoopTimer = () => {
        window.clearInterval(loopTimer);

        if (!loopItems.length || reduceMotion) {
            return;
        }

        loopTimer = window.setInterval(() => moveLoop(1), 4200);
    };

    loopPrev?.addEventListener("click", () => {
        moveLoop(-1);
        restartLoopTimer();
    });

    loopNext?.addEventListener("click", () => {
        moveLoop(1);
        restartLoopTimer();
    });

    if (loopTrack) {
        loopTrack.addEventListener("pointerenter", () => window.clearInterval(loopTimer));
        loopTrack.addEventListener("pointerleave", restartLoopTimer);
        window.addEventListener("resize", () => {
            loopIndex = 0;
            updateFeaturedLoop();
        });
        updateFeaturedLoop();
        restartLoopTimer();
    }

    updateScrollState();
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });

    searchToggle?.addEventListener("click", () => {
        searchBar?.classList.add("is-open");
        setTimeout(() => siteSearch?.focus(), 80);
    });

    searchClose?.addEventListener("click", () => {
        searchBar?.classList.remove("is-open");
        if (siteSearch) {
            siteSearch.value = "";
        }
        applyProductVisibility();
    });

    searchForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        applyProductVisibility();
    });

    siteSearch?.addEventListener("input", applyProductVisibility);

    backToTop?.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    cartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.closest("[data-product-detail]")) {
                return;
            }

            cartTotal += 1;
            animateCounter(cartCount, cartTotal);

            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fa-solid fa-check"></i> Added';
            button.disabled = true;

            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 1200);
        });
    });

    wishlistButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.closest("[data-product-detail]")) {
                return;
            }

            const isActive = button.classList.toggle("is-active");
            const icon = button.querySelector("i");

            wishlistTotal += isActive ? 1 : -1;
            wishlistTotal = Math.max(wishlistTotal, 0);

            animateCounter(wishlistCount, wishlistTotal);

            icon?.classList.toggle("fa-regular", !isActive);
            icon?.classList.toggle("fa-solid", isActive);
        });
    });

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            applyProductVisibility();
        });
    });

    newsletterForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = newsletterEmail?.value.trim() || "";
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!formMessage) {
            return;
        }

        if (!isEmail) {
            formMessage.textContent = "Please enter a valid email address.";
            formMessage.style.color = "#FFC0D9";
            newsletterEmail?.focus();
            return;
        }

        formMessage.textContent = "Thank you. You are subscribed to Ceylon Batik updates.";
        formMessage.style.color = "#F9F9E0";
        newsletterForm.reset();
    });

    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");
    const signupForm = document.getElementById("signupForm");
    const signupMessage = document.getElementById("signupMessage");
    const registerForm = document.getElementById("registerForm");
    const registerMessage = document.getElementById("registerMessage");
    const authToggles = document.querySelectorAll("[data-auth-toggle]");

    const showAuthPanel = (mode) => {
        const showSignup = mode === "signup";

        loginForm?.classList.toggle("auth-form-hidden", showSignup);
        signupForm?.classList.toggle("auth-form-hidden", !showSignup);

        if (showSignup) {
            document.getElementById("signupName")?.focus();
        } else {
            document.getElementById("loginEmail")?.focus();
        }
    };

    authToggles.forEach((toggle) => {
        toggle.addEventListener("click", (event) => {
            event.preventDefault();
            showAuthPanel(toggle.dataset.authToggle || "login");
        });
    });

    loginForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("loginEmail")?.value.trim() || "";
        const password = document.getElementById("loginPassword")?.value.trim() || "";

        if (!email || !password) {
            loginMessage.textContent = "Enter your email and password to continue.";
            loginMessage.style.color = "#FF90BC";
            return;
        }

        loginMessage.textContent = "Demo login ready. Connect this form to your backend next.";
        loginMessage.style.color = "#1f235f";
    });

    signupForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("signupName")?.value.trim() || "";
        const email = document.getElementById("signupEmail")?.value.trim() || "";
        const password = document.getElementById("signupPassword")?.value.trim() || "";
        const confirm = document.getElementById("signupConfirm")?.value.trim() || "";
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!signupMessage) {
            return;
        }

        if (!name || !isEmail || !password || !confirm) {
            signupMessage.textContent = "Complete all sign-up fields with a valid email.";
            signupMessage.style.color = "#FF90BC";
            return;
        }

        if (password !== confirm) {
            signupMessage.textContent = "Passwords do not match.";
            signupMessage.style.color = "#FF90BC";
            return;
        }

        signupMessage.textContent = "Account demo created. Opening the shop...";
        signupMessage.style.color = "#1f235f";

        window.setTimeout(() => {
            window.location.href = "shop.html";
        }, 700);
    });

    registerForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("registerName")?.value.trim() || "";
        const contact = document.getElementById("registerContact")?.value.trim() || "";
        const password = document.getElementById("registerPassword")?.value.trim() || "";
        const confirm = document.getElementById("registerConfirm")?.value.trim() || "";
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
        const isPhone = /^\+?[0-9][0-9\s().-]{6,18}$/.test(contact);

        if (!registerMessage) {
            return;
        }

        if (!name || !(isEmail || isPhone) || !password || !confirm) {
            registerMessage.textContent = "Complete all fields with a valid email or phone number.";
            registerMessage.style.color = "#FF90BC";
            return;
        }

        if (password !== confirm) {
            registerMessage.textContent = "Passwords do not match.";
            registerMessage.style.color = "#FF90BC";
            return;
        }

        registerMessage.textContent = "Account demo created. Opening the shop...";
        registerMessage.style.color = "#1f235f";

        window.setTimeout(() => {
            window.location.href = "shop.html";
        }, 700);
    });

    const cartRows = document.querySelectorAll("[data-cart-row]");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartTotalValue = document.getElementById("cartTotalValue");

    const formatCurrency = (value) => `Rs. ${value.toLocaleString("en-US")}`;

    const updateCartSummary = () => {
        if (!cartRows.length) {
            return;
        }

        const subtotal = [...cartRows].reduce((total, row) => {
            const price = Number(row.dataset.price || 0);
            const quantity = Number(row.querySelector(".qty-input")?.value || 1);
            return total + price * Math.max(quantity, 1);
        }, 0);

        if (cartSubtotal) {
            cartSubtotal.textContent = formatCurrency(subtotal);
        }

        if (cartTotalValue) {
            cartTotalValue.textContent = formatCurrency(subtotal + 450);
        }
    };

    cartRows.forEach((row) => {
        row.querySelector(".qty-input")?.addEventListener("input", updateCartSummary);
    });

    updateCartSummary();

    document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
        link.addEventListener("click", () => {
            const menu = document.getElementById("mainNavigation");
            const bootstrapCollapse = window.bootstrap?.Collapse;

            if (menu?.classList.contains("show") && bootstrapCollapse) {
                bootstrapCollapse.getOrCreateInstance(menu).hide();
            }
        });
    });
});
