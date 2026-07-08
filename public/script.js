// =============================
// PAGE LOADER
// =============================

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");

  setTimeout(() => {
    loader.style.opacity = "0";

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

menu.addEventListener("click", () => {
  if (nav.style.display === "flex") {
    nav.style.display = "none";
  } else {
    nav.style.display = "flex";

    nav.style.flexDirection = "column";
  }
});

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

// =============================
// MOUSE GLOW EFFECT
// =============================

// const glow = document.createElement("div");

// glow.style.position = "fixed";

// glow.style.width = "250px";

// glow.style.height = "250px";

// glow.style.background = "radial-gradient(circle,#00ffff40,transparent)";

// glow.style.pointerEvents = "none";

// glow.style.borderRadius = "50%";

// glow.style.zIndex = "-1";

// document.body.appendChild(glow);

// document.addEventListener("mousemove", (e) => {
//   glow.style.left = e.clientX - 125 + "px";

//   glow.style.top = e.clientY - 125 + "px";
// });

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

    card.style.transform = `
rotateX(${-y}deg)
rotateY(${x}deg)
`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});
