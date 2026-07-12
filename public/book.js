// =============================================
// DIGITAL POETRY BOOK — 3D PAGE-FLIP VIEWER
// Reuses getAllPoems() / escapeHtml() from poetry.js
// =============================================

(function () {
  let pages = []; // flat array of page-content objects (after cover)
  let spreads = []; // pages chunked into [left, right] (or [right] on mobile)
  let currentSpread = 0; // 0 = cover still showing, 1..spreads.length = open pages
  let isAnimating = false;
  let singlePageMode = false;

  // ---------- DOM ----------
  let modal, backdrop, closeBtn, closeBookBtn;
  let coverEl, openBookBtn, bookEl;
  let pageLeftEl, pageRightEl, leafEl, leafFrontEl, leafBackEl;
  let prevBtn, nextBtn, indicatorEl;

  function cacheDom() {
    modal = document.getElementById("bookModal");
    backdrop = document.getElementById("bookModalBackdrop");
    closeBtn = document.getElementById("bookCloseBtn");
    closeBookBtn = document.getElementById("closeBookBtn");
    coverEl = document.getElementById("bookCover");
    openBookBtn = document.getElementById("openBookBtn");
    bookEl = document.getElementById("bookEl");
    pageLeftEl = document.getElementById("bookPageLeft");
    pageRightEl = document.getElementById("bookPageRight");
    leafEl = document.getElementById("bookLeaf");
    leafFrontEl = document.getElementById("leafFront");
    leafBackEl = document.getElementById("leafBack");
    prevBtn = document.getElementById("bookPrevBtn");
    nextBtn = document.getElementById("bookNextBtn");
    indicatorEl = document.getElementById("bookPageIndicator");
  }

  function esc(text) {
    return typeof escapeHtml === "function" ? escapeHtml(text) : String(text);
  }

  // ---------- Build book content from poems ----------
  async function buildBook() {
    let poems = [];
    try {
      poems = typeof getAllPoems === "function" ? await getAllPoems() : [];
    } catch (e) {
      poems = [];
    }

    const intro = { type: "intro" };
    const poemPages = poems.map((p) => ({ type: "poem", poem: p }));
    const back = { type: "back" };
    pages = [intro, ...poemPages, back];

    singlePageMode = window.matchMedia("(max-width: 560px)").matches;
    const size = singlePageMode ? 1 : 2;

    if (!singlePageMode && pages.length % 2 !== 0) {
      pages.push({ type: "blank" });
    }

    spreads = [];
    for (let i = 0; i < pages.length; i += size) {
      spreads.push(pages.slice(i, i + size));
    }
  }

  // ---------- Render helpers ----------
  function renderPageContent(pageData, numberLabel) {
    if (!pageData) return "";
    const numberHtml = numberLabel
      ? `<span class="page-number">${numberLabel}</span>`
      : "";

    switch (pageData.type) {
      case "intro":
        return `<div class="page-inner cover-inner">
          <div class="page-ornament">✒️</div>
          <h2>A Note Before You Read</h2>
          <p class="page-quote">Emotions too deep for conversations, transformed into words.</p>
          <p class="page-signature">— Sanjeev Ghimire</p>
        </div>${numberHtml}`;

      case "poem": {
        const poem = pageData.poem;
        const date = poem.createdAt
          ? new Date(poem.createdAt).toLocaleDateString()
          : "";
        const isAdmin = window.PoetryAdmin && window.PoetryAdmin.isAdmin();
        const ownerControls = isAdmin
          ? `<button type="button" class="page-edit-btn" onclick="window.openEditPoem('${poem._id}')">✎ Edit</button>
             <button type="button" class="page-delete-btn" onclick="window.handleDeletePoem('${poem._id}')">🗑 Delete</button>`
          : "";
        return `<div class="page-inner poem-page">
          <div class="page-tagrow">
            <span class="page-tag">${esc(poem.theme)}</span>
            <span class="page-tag">${esc(poem.mood)}</span>
            ${ownerControls}
          </div>
          <h3 class="page-poem-title">${esc(poem.title)}</h3>
          <div class="page-poem-body">${esc(poem.content)}</div>
          <span class="page-date">${date}</span>
        </div>${numberHtml}`;
      }

      case "back":
        return `<div class="page-inner cover-inner">
          <div class="page-ornament">🖋️</div>
          <h2>The End</h2>
          <p class="page-quote">Thank you for reading.<br>More verses coming soon...</p>
        </div>${numberHtml}`;

      case "blank":
      default:
        return `<div class="page-inner blank-page">${numberHtml}</div>`;
    }
  }

  function leftOf(spreadIdx) {
    const s = spreads[spreadIdx];
    return s ? s[0] : null;
  }
  function rightOf(spreadIdx) {
    const s = spreads[spreadIdx];
    if (!s) return null;
    return singlePageMode ? null : s[1] || null;
  }

  function renderStaticSpread() {
    const idx = currentSpread - 1;

    if (singlePageMode) {
      // Mobile: only the right page slot is visible (CSS hides the left
      // one), so the single page's content has to be rendered there.
      pageRightEl.innerHTML = renderPageContent(leftOf(idx), `Page ${idx + 1}`);
      pageLeftEl.innerHTML = "";
    } else {
      pageLeftEl.innerHTML = renderPageContent(
        leftOf(idx),
        `Page ${idx * 2 + 1}`,
      );
      pageRightEl.innerHTML = renderPageContent(
        rightOf(idx),
        `Page ${idx * 2 + 2}`,
      );
    }

    updateIndicator();
    updateControls();
  }

  function updateIndicator() {
    if (currentSpread === 0) {
      indicatorEl.textContent = "Cover";
    } else {
      indicatorEl.textContent = `Spread ${currentSpread} of ${spreads.length}`;
    }
  }

  function updateControls() {
    prevBtn.disabled = currentSpread === 0;
    nextBtn.disabled = currentSpread >= spreads.length;
  }

  // ---------- Open / close cover ----------
  function openCover() {
    if (isAnimating) return;
    coverEl.classList.add("hidden");
    bookEl.classList.add("visible");
    currentSpread = 1;
    renderStaticSpread();
  }

  function closeToCover() {
    if (isAnimating) return;
    bookEl.classList.remove("visible");
    coverEl.classList.remove("hidden");
    currentSpread = 0;
    updateIndicator();
    updateControls();
  }

  // ---------- Flip animation ----------
  function flipForward() {
    if (isAnimating || currentSpread >= spreads.length) return;
    isAnimating = true;

    const idx = currentSpread - 1;
    const frontContent = singlePageMode ? leftOf(idx) : rightOf(idx);
    const backContent = leftOf(idx + 1);

    leafFrontEl.innerHTML = renderPageContent(frontContent);
    leafBackEl.innerHTML = renderPageContent(backContent);

    // pre-set what will be revealed underneath once the leaf clears
    if (!singlePageMode) {
      pageRightEl.innerHTML = renderPageContent(rightOf(idx + 1));
    }

    leafEl.className = "book-leaf at-right";
    leafEl.style.display = "block";
    leafEl.style.transform = "rotateY(0deg)";

    // force reflow so the transition kicks in
    // eslint-disable-next-line no-unused-expressions
    leafEl.offsetHeight;

    requestAnimationFrame(() => {
      leafEl.style.transform = "rotateY(-180deg)";
    });

    setTimeout(() => {
      currentSpread += 1;
      renderStaticSpread();
      leafEl.style.display = "none";
      leafEl.style.transform = "rotateY(0deg)";
      isAnimating = false;
    }, 760);
  }

  function flipBackward() {
    if (isAnimating) return;
    if (currentSpread <= 1) {
      closeToCover();
      return;
    }
    isAnimating = true;

    const idx = currentSpread - 1;
    const frontContent = leftOf(idx);
    const backContent = singlePageMode ? leftOf(idx - 1) : rightOf(idx - 1);

    leafFrontEl.innerHTML = renderPageContent(frontContent);
    leafBackEl.innerHTML = renderPageContent(backContent);

    // pre-set what will be revealed underneath on the left once leaf clears
    pageLeftEl.innerHTML = renderPageContent(leftOf(idx - 1));

    leafEl.className = "book-leaf at-left";
    leafEl.style.display = "block";
    leafEl.style.transform = "rotateY(0deg)";

    // eslint-disable-next-line no-unused-expressions
    leafEl.offsetHeight;

    requestAnimationFrame(() => {
      leafEl.style.transform = "rotateY(180deg)";
    });

    setTimeout(() => {
      currentSpread -= 1;
      renderStaticSpread();
      leafEl.style.display = "none";
      leafEl.style.transform = "rotateY(0deg)";
      isAnimating = false;
    }, 760);
  }

  // ---------- Modal open/close ----------
  async function openModal() {
    await buildBook();
    currentSpread = 0;
    coverEl.classList.remove("hidden");
    bookEl.classList.remove("visible");
    leafEl.style.display = "none";
    updateIndicator();
    updateControls();
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Rebuild book content in place (e.g. after a poem was edited/deleted
  // elsewhere) without losing the reader's spot, if the book is open.
  async function refreshBookIfOpen() {
    if (!modal || !modal.classList.contains("open")) return;
    if (isAnimating) return;

    const wasPastCover = currentSpread > 0;
    const keepSpread = currentSpread;

    await buildBook();

    if (wasPastCover) {
      currentSpread = Math.min(keepSpread, spreads.length) || 1;
      renderStaticSpread();
    } else {
      updateIndicator();
      updateControls();
    }
  }

  window.refreshBookIfOpen = refreshBookIfOpen;

  // ---------- Wire up ----------
  document.addEventListener("DOMContentLoaded", () => {
    cacheDom();
    if (!modal) return; // book markup not present on this page

    const viewBookBtn = document.getElementById("viewBookBtn");
    if (viewBookBtn) {
      viewBookBtn.addEventListener("click", openModal);
    }

    openBookBtn.addEventListener("click", openCover);
    nextBtn.addEventListener("click", flipForward);
    prevBtn.addEventListener("click", flipBackward);
    closeBtn.addEventListener("click", closeModal);
    closeBookBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") flipForward();
      if (e.key === "ArrowLeft") flipBackward();
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
      if (!modal.classList.contains("open")) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(async () => {
        const wasOpenPastCover = currentSpread > 0;
        await buildBook();
        currentSpread = wasOpenPastCover ? 1 : 0;
        if (currentSpread > 0) renderStaticSpread();
        updateControls();
      }, 300);
    });
  });
})();
