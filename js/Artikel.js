/* =========================================================
   IKAN KITA — TEMPLATE ARTIKEL
   File: script.js
   Deskripsi: Vanilla JavaScript untuk seluruh interaksi
   template artikel. Tidak bergantung pada framework apa pun.
   Struktur ini permanen — dipakai ulang oleh semua artikel.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  initReadingProgress();
  initReadingTime();
  initTableOfContents();
  initHighlightActiveHeading();
  initBackToTop();
  initShareButtons();
  initCopyLink();
  initLazyLoadImages();
  initScrollReveal();
  initLightbox();
  initUpdateDate();
  initMobileNav();
});

/* 1. READING PROGRESS BAR ------------------------------------------- */
function initReadingProgress() {
  var bar = document.getElementById("reading-progress");
  var article = document.querySelector(".article-content");
  if (!bar || !article) return;

  function update() {
    var rect = article.getBoundingClientRect();
    var articleTop = rect.top + window.scrollY;
    var articleHeight = article.offsetHeight;
    var viewportHeight = window.innerHeight;
    var scrolled = window.scrollY - articleTop + viewportHeight * 0.2;
    var percent = Math.min(
      100,
      Math.max(0, (scrolled / (articleHeight - viewportHeight * 0.4)) * 100)
    );
    bar.style.width = percent + "%";
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/* 2. ESTIMASI WAKTU BACA --------------------------------------------- */
function initReadingTime() {
  var article = document.querySelector(".article-content");
  var target = document.getElementById("reading-time");
  if (!article || !target) return;

  var wordCount = article.innerText.trim().split(/\s+/).length;
  var wordsPerMinute = 200;
  var minutes = Math.max(1, Math.round(wordCount / wordsPerMinute));
  target.textContent = minutes + " menit membaca";
}

/* 3. TABLE OF CONTENTS OTOMATIS -------------------------------------- */
function initTableOfContents() {
  var article = document.querySelector(".article-content");
  var tocList = document.getElementById("toc-list");
  if (!article || !tocList) return;

  var headings = article.querySelectorAll("h2, h3");
  var html = "";
  var openSub = false;

  headings.forEach(function (heading, index) {
    if (!heading.id) {
      heading.id = "section-" + (index + 1);
    }
    var text = heading.textContent;

    if (heading.tagName === "H2") {
      if (openSub) {
        html += "</ol></li>".replace("</li>", "");
        openSub = false;
      }
      html += '<li><a href="#' + heading.id + '">' + text + "</a>";
    } else {
      if (!openSub) {
        html += '<ol class="toc-sub">';
        openSub = true;
      }
      html += '<li><a href="#' + heading.id + '">' + text + "</a></li>";
    }
  });

  if (openSub) html += "</ol>";
  tocList.innerHTML = html;

  // Smooth scroll manual (agar bisa memperhitungkan offset sticky header)
  tocList.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      var offset = 80;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
}

/* 4. HIGHLIGHT HEADING AKTIF SAAT SCROLL ------------------------------ */
function initHighlightActiveHeading() {
  var headings = document.querySelectorAll(".article-content h2, .article-content h3");
  var tocLinks = document.querySelectorAll("#toc-list a");
  if (!headings.length || !tocLinks.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.getAttribute("id");
        var link = document.querySelector('#toc-list a[href="#' + id + '"]');
        if (!link) return;
        if (entry.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove("active"); });
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-90px 0px -70% 0px", threshold: 0 }
  );

  headings.forEach(function (h) { observer.observe(h); });
}

/* 5. BACK TO TOP ------------------------------------------------------ */
function initBackToTop() {
  var btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    function () {
      if (window.scrollY > 600) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    },
    { passive: true }
  );

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* 6. TOMBOL SHARE (Facebook, WhatsApp, Telegram, X) ------------------- */
function initShareButtons() {
  var buttons = document.querySelectorAll("[data-share]");
  if (!buttons.length) return;

  var pageUrl = encodeURIComponent(window.location.href);
  var pageTitle = encodeURIComponent(document.title);

  var shareUrls = {
    facebook: "https://www.facebook.com/sharer/sharer.php?u=" + pageUrl,
    whatsapp: "https://api.whatsapp.com/send?text=" + pageTitle + "%20" + pageUrl,
    telegram: "https://t.me/share/url?url=" + pageUrl + "&text=" + pageTitle,
    x: "https://twitter.com/intent/tweet?url=" + pageUrl + "&text=" + pageTitle
  };

  buttons.forEach(function (btn) {
    var platform = btn.getAttribute("data-share");
    if (shareUrls[platform]) {
      btn.addEventListener("click", function () {
        window.open(shareUrls[platform], "_blank", "noopener,noreferrer,width=600,height=500");
      });
    }
  });
}

/* 7. COPY LINK ---------------------------------------------------------- */
function initCopyLink() {
  var copyBtn = document.querySelector('[data-share="copy"]');
  if (!copyBtn) return;

  copyBtn.addEventListener("click", function () {
    navigator.clipboard.writeText(window.location.href).then(function () {
      var original = copyBtn.getAttribute("aria-label");
      copyBtn.setAttribute("aria-label", "Link tersalin");
      copyBtn.classList.add("is-copied");
      setTimeout(function () {
        copyBtn.setAttribute("aria-label", original);
        copyBtn.classList.remove("is-copied");
      }, 2000);
    });
  });
}

/* 8. LAZY LOAD TAMBAHAN (fallback untuk browser lama) -------------------- */
function initLazyLoadImages() {
  if ("loading" in HTMLImageElement.prototype) return; // native lazy load sudah cukup

  var images = document.querySelectorAll("img[data-src]");
  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var img = entry.target;
        img.src = img.dataset.src;
        obs.unobserve(img);
      }
    });
  });

  images.forEach(function (img) { observer.observe(img); });
}

/* 9. SCROLL REVEAL -------------------------------------------------------- */
function initScrollReveal() {
  var items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach(function (el) { observer.observe(el); });
}

/* 10. IMAGE LIGHTBOX -------------------------------------------------------- */
function initLightbox() {
  var galleryImages = document.querySelectorAll(".image-gallery img, .article-content figure img");
  var lightbox = document.getElementById("lightbox");
  if (!galleryImages.length || !lightbox) return;

  var lightboxImg = lightbox.querySelector("img");
  var closeBtn = lightbox.querySelector(".lightbox__close");

  galleryImages.forEach(function (img) {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", function () {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
  }

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });
}

/* 11. TANGGAL "TERAKHIR DIPERBARUI" OTOMATIS --------------------------------- */
function initUpdateDate() {
  var el = document.getElementById("last-updated");
  if (!el) return;

  var iso = el.getAttribute("datetime");
  if (!iso) return;

  var date = new Date(iso);
  var formatted = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  el.textContent = formatted;
}

/* 12. MOBILE NAV TOGGLE ------------------------------------------------------- */
function initMobileNav() {
  var toggle = document.querySelector(".navbar__toggle");
  var menu = document.querySelector(".navbar__menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    var isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}
