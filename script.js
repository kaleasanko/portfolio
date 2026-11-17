// ===== ヘッダー：スクロールしたら白背景にする =====
const header = document.getElementById("siteHeader");
const hero = document.querySelector(".hero");

function updateHeader() {
  const heroBottom = hero.offsetHeight - header.offsetHeight;
  header.classList.toggle("is-scrolled", window.scrollY > heroBottom);
}
window.addEventListener("scroll", updateHeader);
updateHeader();

// ===== スマホ用ハンバーガーメニュー =====
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuBtn.classList.toggle("is-open", isOpen);
  menuBtn.setAttribute("aria-expanded", isOpen);
});

// メニューのリンクを押したら閉じる
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuBtn.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", false);
  });
});

// ===== スクロールで要素をふわっと表示 & スキルバーを伸ばす =====
const revealTargets = document.querySelectorAll(
  ".section-title, .profile, .pr-card, .skill-box, .work-card, .thanks-title"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");

      // スキルバー：data-level の % まで伸ばす
      entry.target.querySelectorAll(".bar-fill").forEach((bar) => {
        bar.style.width = bar.dataset.level + "%";
      });

      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.2 }
);
revealTargets.forEach((el) => observer.observe(el));

// ===== WORKS：カテゴリで絞り込み =====
const filterBtns = document.querySelectorAll(".filter-btn");
const workCards = document.querySelectorAll(".work-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    const filter = btn.dataset.filter;
    workCards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !show);
    });
  });
});

// ===== WORKS：カードをクリックしたら概要ポップアップを開く =====
const modal = document.getElementById("workModal");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");

function openWork(card) {
  const detail = card.querySelector(".work-detail");
  if (!detail) return;
  const copy = detail.cloneNode(true);
  copy.hidden = false;
  modalContent.innerHTML = "";
  modalContent.appendChild(copy);
  modalContent.scrollTop = 0;
  modal.showModal();
  document.body.style.overflow = "hidden";
}

function closeWork() {
  modal.close();
}

workCards.forEach((card) => {
  card.addEventListener("click", () => openWork(card));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openWork(card);
    }
  });
});

modalClose.addEventListener("click", closeWork);

// 背景（暗いところ）をクリックしても閉じる
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeWork();
});

// 閉じたら中身を消す（動画が鳴りっぱなしにならないように）
modal.addEventListener("close", () => {
  modalContent.innerHTML = "";
  document.body.style.overflow = "";
});
