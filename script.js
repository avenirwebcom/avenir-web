// ISHIHARA — shared script

// Header scroll
const hdr = document.querySelector(".hdr");
if (hdr) {
  const onScroll = () => hdr.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Mobile menu
const burger = document.querySelector(".burger");
if (burger) {
  const mnav = document.querySelector(".mnav");
  const mov = document.querySelector(".mov");
  const close = () => {
    mnav.classList.remove("open");
    mov.classList.remove("open");
    document.body.style.overflow = "";
  };
  const open = () => {
    mnav.classList.add("open");
    mov.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  burger.addEventListener("click", () =>
    mnav.classList.contains("open") ? close() : open(),
  );
  if (mov) mov.addEventListener("click", close);
  if (mnav)
    mnav
      .querySelectorAll("a")
      .forEach((a) => a.addEventListener("click", close));
}

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const sibs = el.parentElement
            ? Array.from(el.parentElement.querySelectorAll(":scope > .reveal"))
            : [el];
          const idx = Math.max(0, sibs.indexOf(el));
          setTimeout(() => el.classList.add("vis"), idx * 90);
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  revealEls.forEach((el) => io.observe(el));
}

// Fade (hero on load)
window.addEventListener("load", () => {
  setTimeout(
    () =>
      document
        .querySelectorAll(".fade")
        .forEach((el) => el.classList.add("vis")),
    120,
  );
});

// Number counters
function countUp(el) {
  const target = parseFloat(el.dataset.target);
  const dur = 1500,
    start = performance.now();
  const isFloat = el.dataset.target.includes(".");
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = eased * target;
    el.textContent = isFloat
      ? val.toFixed(1)
      : Math.floor(val).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
  }
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll("[data-target]");
if (counters.length) {
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          cio.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 },
  );
  counters.forEach((el) => cio.observe(el));
}

// FAQ accordion
document.querySelectorAll(".faq-q").forEach((btn) => {
  btn.addEventListener("click", () => {
    const a = btn.nextElementSibling;
    const open = btn.classList.contains("open");
    document.querySelectorAll(".faq-q.open").forEach((o) => {
      o.classList.remove("open");
      o.nextElementSibling.classList.remove("open");
    });
    if (!open) {
      btn.classList.add("open");
      a.classList.add("open");
    }
  });
});

// Form submit -> Formspree -> modal
function bindForm(id) {
  const form = document.getElementById(id);
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = "送信中...";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // If the form's action still has the placeholder, warn instead of pretending to send.
    const action = form.getAttribute("action") || "";
    if (action.includes("REPLACE_WITH_YOUR_ID")) {
      btn.innerHTML = orig;
      btn.disabled = false;
      btn.style.opacity = "";
      alert(
        "フォームの送信先（Formspreeのエンドポイント）がまだ設定されていません。contact.html の form タグの action を、ご自身のFormspree URLに差し替えてください。",
      );
      return;
    }

    try {
      const res = await fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      btn.innerHTML = orig;
      btn.disabled = false;
      btn.style.opacity = "";
      if (res.ok) {
        form.reset();
        const m = document.getElementById("modal");
        if (m) m.classList.add("active");
      } else {
        let msg =
          "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。";
        try {
          const data = await res.json();
          if (data && data.errors && data.errors.length) {
            msg = data.errors.map((er) => er.message).join("\n");
          }
        } catch (_) {}
        alert(msg);
      }
    } catch (err) {
      btn.innerHTML = orig;
      btn.disabled = false;
      btn.style.opacity = "";
      alert(
        "通信エラーが発生しました。ネットワークをご確認のうえ、再度お試しください。",
      );
    }
  });
}
bindForm("contactForm");
bindForm("diagForm");

// Modal close
const modal = document.getElementById("modal");
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
  const cb = modal.querySelector("[data-close]");
  if (cb) cb.addEventListener("click", () => modal.classList.remove("active"));
}

// Smooth scroll for same-page anchors
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href === "#" || href.length < 2) return;
    const t = document.querySelector(href);
    if (t) {
      e.preventDefault();
      window.scrollTo({
        top: t.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  });
});

// Pricing toggle (one-time vs subscription)
(function () {
  const toggle = document.querySelector(".price-toggle");
  if (!toggle) return;
  const btns = toggle.querySelectorAll("button");
  const slider = toggle.querySelector(".slider");
  const sets = document.querySelectorAll(".price-set");
  btns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
      slider.classList.toggle("right", i === 1);
      sets.forEach((s) => s.classList.remove("active"));
      const target = document.querySelector(
        `.price-set[data-set="${btn.dataset.set}"]`,
      );
      if (target) target.classList.add("active");
    });
  });
})();
