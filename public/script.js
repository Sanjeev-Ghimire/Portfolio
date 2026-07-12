// =============================
// PAGE LOADER
// =============================

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");

  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }, 1000);
});

// =============================
// MOBILE MENU
// =============================

const menu = document.querySelector(".menu");
const nav = document.querySelector("nav ul");

if (menu && nav) {
  menu.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menu.textContent = isOpen ? "✕" : "☰";
    menu.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close the mobile menu once a link is tapped
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menu.textContent = "☰";
      menu.setAttribute("aria-expanded", "false");
    });
  });
}

// =============================
// SMOOTH SCROLL
// =============================

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const section = document.querySelector(this.getAttribute("href"));
    section.scrollIntoView({
      behavior: "smooth",
    });
  });
});

// =============================
// SCROLL REVEAL
// =============================

const elements = document.querySelectorAll(".section,.stats,.project,.glass");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
});

elements.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(50px)";
  el.style.transition = "1s ease";
  observer.observe(el);
});

// =============================
// TYPING EFFECT
// =============================

const roles = ["Full Stack Developer", "UI/UX Designer", "Poet"];
let roleIndex = 0;
let charIndex = 0;
const title = document.querySelector(".hero h2");

if (title) {
  function type() {
    if (charIndex < roles[roleIndex].length) {
      title.innerHTML += roles[roleIndex][charIndex];
      charIndex++;
      setTimeout(type, 80);
    } else {
      setTimeout(erase, 1500);
    }
  }

  function erase() {
    if (charIndex > 0) {
      title.innerHTML = roles[roleIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, 50);
    } else {
      roleIndex++;
      if (roleIndex >= roles.length) {
        roleIndex = 0;
      }
      setTimeout(type, 300);
    }
  }

  title.innerHTML = "";
  type();
}

// =============================
// COUNTER ANIMATION
// =============================

const counters = document.querySelectorAll(".stats h2");

counters.forEach((counter) => {
  let target = counter.innerText;
  counter.innerText = "0";
  let count = 0;

  function update() {
    if (count < parseInt(target)) {
      count++;
      counter.innerText = count + "+";
      setTimeout(update, 50);
    } else {
      counter.innerText = target;
    }
  }

  update();
});

// =============================
// CARD TILT EFFECT
// =============================

const cards = document.querySelectorAll(".glass,.project");

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    let x = (e.offsetX - card.offsetWidth / 2) / 20;
    let y = (e.offsetY - card.offsetHeight / 2) / 20;
    card.style.transform = `rotateX(${-y}deg) rotateY(${x}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// =============================
// PARALLAX SCROLL EFFECT
// (desktop only — this was the #1 cause of the janky/lagging
// photo on mobile: a synchronous, unthrottled scroll listener
// forcing a style + paint on every single scroll event.)
// =============================

const parallaxElements = document.querySelectorAll(".profile-card");
const parallaxQuery = window.matchMedia("(min-width: 901px)");
let parallaxEnabled = parallaxQuery.matches;
let parallaxTicking = false;

function updateParallax() {
  const scrollPosition = window.scrollY;
  parallaxElements.forEach((el) => {
    el.style.transform = `translate3d(0, ${scrollPosition * 0.5}px, 0)`;
  });
  parallaxTicking = false;
}

function onParallaxScroll() {
  if (!parallaxEnabled || parallaxTicking) return;
  parallaxTicking = true;
  requestAnimationFrame(updateParallax);
}

function setParallaxEnabled(matches) {
  parallaxEnabled = matches;
  if (!parallaxEnabled) {
    // Mobile: drop the effect entirely and clear any leftover transform
    // so the image sits still while the page scrolls.
    parallaxElements.forEach((el) => {
      el.style.transform = "";
    });
  }
}

parallaxQuery.addEventListener("change", (e) => setParallaxEnabled(e.matches));
setParallaxEnabled(parallaxQuery.matches);

window.addEventListener("scroll", onParallaxScroll, { passive: true });

// =============================
// SECTION FADE-IN ON SCROLL
// =============================

const sections = document.querySelectorAll(".section");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
    }
  });
});

sections.forEach((section) => {
  section.style.opacity = "0.8";
  section.style.transition = "opacity 0.6s ease";
  sectionObserver.observe(section);
});
