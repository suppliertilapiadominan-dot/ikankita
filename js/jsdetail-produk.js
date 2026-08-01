/*=========================================
        GALLERY THUMBNAIL
=========================================*/
const mainImage = document.getElementById("mainImage");
const thumbnails = document.querySelectorAll(".thumb");

if (mainImage && thumbnails.length) {
    thumbnails.forEach((thumb) => {
        thumb.addEventListener("click", function () {
            mainImage.src = this.src;
            thumbnails.forEach(img => img.classList.remove("active"));
            this.classList.add("active");
        });
    });
}

/*=========================================
            FAQ ACCORDION
=========================================*/
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    if (button) {
        button.addEventListener("click", () => {
            item.classList.toggle("active");
        });
    }
});

/*=========================================
        SCROLL REVEAL
=========================================*/
const reveals = document.querySelectorAll(".reveal");

function reveal() {
    reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const revealTop = element.getBoundingClientRect().top;
        if (revealTop < windowHeight - 120) {
            element.classList.add("active");
        }
    });
}

window.addEventListener("scroll", reveal);
reveal(); // Panggil saat halaman pertama kali dimuat

/*=========================================
            LIGHTBOX
=========================================*/
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.querySelector(".close-lightbox");

if (mainImage && lightbox && lightboxImage && closeLightbox) {
    mainImage.addEventListener("click", () => {
        lightbox.classList.add("active");
        lightboxImage.src = mainImage.src;
    });

    closeLightbox.addEventListener("click", () => {
        lightbox.classList.remove("active");
    });

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove("active");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("active")) {
            lightbox.classList.remove("active");
        }
    });
}

/*=========================================
            BACK TO TOP
=========================================*/
const backToTop = document.getElementById("backToTop");

if (backToTop) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/*=========================================
            PRELOADER
=========================================*/
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add("hide");
        }, 800);
    }
});

/*=========================================
        RELATED PRODUCT SLIDER
=========================================*/
const track = document.querySelector(".related-track");
const prev = document.querySelector(".related-prev");
const next = document.querySelector(".related-next");

if (track && prev && next) {
    const gap = 30;
    // Simpan elemen asli agar tidak rusak/berlipat ganda saat resize layar
    const originalCards = Array.from(track.children);
    let visible = getVisible();
    let current = visible;

    function getVisible() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 991) return 2;
        return 3;
    }

    function createClone() {
        track.innerHTML = "";

        const firstClone = originalCards.slice(0, visible).map(card => card.cloneNode(true));
        const lastClone = originalCards.slice(-visible).map(card => card.cloneNode(true));

        lastClone.forEach(card => track.appendChild(card));
        originalCards.forEach(card => track.appendChild(card.cloneNode(true)));
        firstClone.forEach(card => track.appendChild(card));
    }

    createClone();

    let allCards = track.querySelectorAll(".related-card");

    function moveSlider(animation = true) {
        if (!allCards.length) return;
        const width = allCards[0].offsetWidth + gap;

        track.style.transition = animation
            ? "transform .55s cubic-bezier(.22,.61,.36,1)"
            : "none";

        track.style.transform = `translateX(-${current * width}px)`;
    }

    moveSlider(false);

    next.addEventListener("click", () => {
        current++;
        moveSlider();
    });

    prev.addEventListener("click", () => {
        current--;
        moveSlider();
    });

    track.addEventListener("transitionend", () => {
        if (current >= originalCards.length + visible) {
            current = visible;
            moveSlider(false);
        }

        if (current < visible) {
            current = originalCards.length + visible - 1;
            moveSlider(false);
        }
    });

    /* AUTO SLIDE */
    let auto = setInterval(() => {
        next.click();
    }, 5000);

    const slider = document.querySelector(".related-slider");
    if (slider) {
        slider.addEventListener("mouseenter", () => clearInterval(auto));
        slider.addEventListener("mouseleave", () => {
            auto = setInterval(() => {
                next.click();
            }, 5000);
        });
    }

    /* RESIZE LISTENER */
    window.addEventListener("resize", () => {
        const newVisible = getVisible();
        if (newVisible !== visible) {
            visible = newVisible;
            createClone();
            allCards = track.querySelectorAll(".related-card");
            current = visible;
            moveSlider(false);
        }
    });
}

/*=========================================
      PELACAKAN KONVERSI WHATSAPP
=========================================*/
document.addEventListener("DOMContentLoaded", () => {
    // 1. Tangkap semua tombol WhatsApp
    const waButtons = document.querySelectorAll(".btn-wa, .btn-toko, .floating-wa");

    waButtons.forEach((button) => {
        button.addEventListener("click", function () {
            // Tangkap nama produk dari tag H1 (jika tidak ada, gunakan nama default)
            const productName = document.querySelector("h1") 
                ? document.querySelector("h1").innerText.trim() 
                : "Kontak Umum Website";

            // Tangkap tipe tombol yang diklik
            const buttonType = this.classList.contains("floating-wa") 
                ? "Floating WA Button" 
                : "Button Detail Produk";

            /*--- A. KIRIM KE GOOGLE ANALYTICS 4 (Jika GA4 terpasang) ---*/
            if (typeof gtag === "function") {
                gtag("event", "click_whatsapp", {
                    "event_category": "Conversion",
                    "event_label": productName,
                    "button_type": buttonType,
                    "value": 1
                });
            }

            /*--- B. KIRIM KE META / FACEBOOK PIXEL (Jika Pixel terpasang) ---*/
            if (typeof fbq === "function") {
                fbq("track", "Contact", {
                    content_name: productName,
                    content_category: "Penjualan Ikan Segar"
                });
            }

            // Catatan Uji Coba di Console Browser
            console.log(`[CONVERSION TRACKED] Produk: "${productName}" via ${buttonType}`);
        });
    });
});