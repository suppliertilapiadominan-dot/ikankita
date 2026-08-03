/*==================================================
              HEADER & NAVBAR SCROLL
==================================================*/

const header = document.querySelector("header");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");
const hamburger = document.getElementById("hamburger-menu");
const navMenu = document.querySelector(".nav-menu");

let scrollTimer;

// Logika Scroll Header & Highlighting Link
window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  const isMenuOpen = navMenu && navMenu.classList.contains("active");

  // Efek Transparansi / Sembunyi Header
  if (header) {
    if (currentScroll <= 0) {
      header.classList.remove("scrolled", "hide");
    } else if (!isMenuOpen) {
      header.classList.add("scrolled", "hide");

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        header.classList.remove("hide");
      }, 180);
    }
  }

  // Highlighting Nav Link berdasarkan Posisi Scroll
  let currentSectionId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    if (currentScroll >= sectionTop) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (
      currentSectionId &&
      link.getAttribute("href") === `#${currentSectionId}`
    ) {
      link.classList.add("active");
    }
  });
});

/*==================================================
                HAMBURGER MENU TOGGLE
==================================================*/

if (hamburger && navMenu) {
  // Buka / Tutup Menu Mobile
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Otomatis tutup menu saat salah satu nav-link diklik
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Tutup menu jika pengguna mengklik area di luar navbar
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
}

/*==================================================
                STATISTIK COUNTER
==================================================*/

const counterSection = document.querySelector(".statistik");
const counters = document.querySelectorAll(".counter");

if (counterSection && counters.length > 0) {
  const speed = 200;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counters.forEach((counter) => {
            const updateCount = () => {
              const target = +counter.getAttribute("data-target");
              const count = +counter.innerText;
              const inc = Math.ceil(target / speed);

              if (count < target) {
                counter.innerText = Math.min(count + inc, target);
                setTimeout(updateCount, 15);
              } else {
                counter.innerText = target;
              }
            };

            updateCount();
          });

          observer.disconnect(); // Hanya jalankan animasi counter sekali
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(counterSection);
}

/*==================================================
            IMAGE SLIDER & LAZY LOADING
==================================================*/

// Path dan nama file gambar tetap dipertahankan persis sesuai aslinya
const slides = [
  {
    image: "image/ikan-kita.webp",
    title: "Selamat Datang di Ikan Kita",
    desc: "Menyediakan ikan segar berkualitas premium langsung dari pembudidaya terpercaya.",
    button: "Hubungi Kami",
    link: "https://wa.me/6283163581373?text=Halo%20Ikan%20Kita,%20Saya%20ingin%20bertanya.",
  },
  {
    image: "image/lapak-kami.webp",
    title: "Lapak Resmi",
    desc: "Datang langsung ke lapak kami untuk memilih ikan segar terbaik setiap hari.",
    button: "Lihat Lokasi",
    link: "#informasi",
  },
  {
    image: "image/panen.jpg",
    title: "Proses Panen",
    desc: "Ikan dipanen pada hari yang sama agar kualitas dan kesegarannya tetap terjaga.",
    button: "Lihat Produk",
    link: "#produk",
  },
  {
    image: "image/ikan-nila-mati.webp",
    title: "Produk Berkualitas",
    desc: "Berbagai pilihan ikan segar siap memenuhi kebutuhan keluarga maupun usaha kuliner.",
    button: "Pesan Sekarang",
    link: "https://wa.me/6283163581373?text=Halo%20Ikan%20Kita,%20Saya%20ingin%20memesan.",
  },
  {
    image: "image/pengiriman.jpg",
    title: "Pengiriman Cepat",
    desc: "Kami melayani pengiriman agar ikan tetap segar hingga sampai ke tangan pelanggan.",
    button: "Hubungi Kami",
    link: "https://wa.me/6283163581373",
  },
];

const sliderImage = document.getElementById("slider-image");
const sliderTitle = document.getElementById("slider-title");
const sliderDesc = document.getElementById("slider-desc");
const sliderBtn = document.querySelector(".slider-btn");
const dots = document.querySelectorAll(".dot");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

if (sliderImage && sliderTitle && sliderDesc && sliderBtn) {
  let currentSlide = 0;
  let autoSlideTimer;

  sliderImage.setAttribute("loading", "lazy");

  function updateSlide() {
    sliderImage.style.opacity = "0";

    setTimeout(() => {
      sliderImage.src = slides[currentSlide].image;
      sliderTitle.textContent = slides[currentSlide].title;
      sliderDesc.textContent = slides[currentSlide].desc;
      sliderBtn.textContent = slides[currentSlide].button;
      sliderBtn.href = slides[currentSlide].link;

      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide);
      });

      sliderImage.style.opacity = "1";
    }, 200);
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide();
  }

  function startAutoSlide() {
    autoSlideTimer = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      updateSlide();
      resetAutoSlide();
    });
  });

  updateSlide();
  startAutoSlide();
}

/*=========================================
      PELACAKAN KONVERSI WHATSAPP
=========================================*/
document.addEventListener("DOMContentLoaded", () => {
  // 1. Tangkap semua tombol WhatsApp
  const waButtons = document.querySelectorAll(
    ".btn-wa, .btn-toko, .floating-wa",
  );

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
          event_category: "Conversion",
          event_label: productName,
          button_type: buttonType,
          value: 1,
        });
      }

      /*--- B. KIRIM KE META / FACEBOOK PIXEL (Jika Pixel terpasang) ---*/
      if (typeof fbq === "function") {
        fbq("track", "Contact", {
          content_name: productName,
          content_category: "Penjualan Ikan Segar",
        });
      }

      // Catatan Uji Coba di Console Browser
      console.log(
        `[CONVERSION TRACKED] Produk: "${productName}" via ${buttonType}`,
      );
    });
  });
});

/* ===========================
   Artikel Slider
=========================== */

document.addEventListener("DOMContentLoaded", () => {
  const artikelContainer = document.querySelector(".artikel-container");
  const nextBtn = document.querySelector(".artikel-arrow.next");
  const prevBtn = document.querySelector(".artikel-arrow.prev");

  if (!artikelContainer || !nextBtn || !prevBtn) return;

  nextBtn.addEventListener("click", () => {
    artikelContainer.scrollBy({
      left: artikelContainer.clientWidth,
      behavior: "smooth",
    });
  });

  prevBtn.addEventListener("click", () => {
    artikelContainer.scrollBy({
      left: -artikelContainer.clientWidth,
      behavior: "smooth",
    });
  });
});
