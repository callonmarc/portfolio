const screens = [...document.querySelectorAll(".screen")];
const menuItems = [...document.querySelectorAll(".menu-item")];
const bg = document.querySelector(".background");
const cursor = document.querySelector(".cursor");
const loader = document.getElementById("loader");
const staticOverlay = document.getElementById("staticOverlay");
const audio = {
  ambient: document.getElementById("ambientAudio"),
  move: document.getElementById("moveAudio"),
  select: document.getElementById("selectAudio"),
  glitch: document.getElementById("glitchAudio"),
};
let selected = 0;
let current = "home";
let audioArmed = false;
function play(sound, volume = 0.45) {
  const el = audio[sound];
  if (!el || !audioArmed) return;
  el.volume = volume;
  el.currentTime = 0;
  el.play().catch(() => {});
}
function armAudio() {
  if (audioArmed) return;
  audioArmed = true;
  audio.ambient.volume = 0.16;
  audio.ambient.play().catch(() => {});
}
function setSelected(index) {
  menuItems[selected]?.classList.remove("selected");
  selected = (index + menuItems.length) % menuItems.length;
  menuItems[selected].classList.add("selected");
  menuItems[selected].focus({ preventScroll: true });
  play("move", 0.28);
}
function openScreen(id) {
  if (id === current) return;
  armAudio();
  play("select", 0.5);
  play("glitch", 0.42);
  staticOverlay.classList.remove("active");
  void staticOverlay.offsetWidth;
  staticOverlay.classList.add("active");
  screens.forEach((s) => s.classList.toggle("active", s.dataset.screen === id));
  current = id;
  setTimeout(
    () => document.querySelector(`[data-screen="${id}"]`)?.focus?.(),
    80,
  );
}
function backHome() {
  openScreen("home");
  setTimeout(() => menuItems[selected].focus({ preventScroll: true }), 120);
}
menuItems.forEach((item, index) => {
  item.addEventListener("mouseenter", () => setSelected(index));
  item.addEventListener("focus", () => {
    if (selected !== index) setSelected(index);
  });
  item.addEventListener("click", () => openScreen(item.dataset.target));
});
document
  .querySelectorAll("[data-back]")
  .forEach((btn) => btn.addEventListener("click", backHome));
document.addEventListener("keydown", (e) => {
  if (current === "home") {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected(selected + 1);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected(selected - 1);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      openScreen(menuItems[selected].dataset.target);
    }
  } else if (e.key === "Escape") {
    e.preventDefault();
    backHome();
  }
});
document.addEventListener("pointermove", (e) => {
  const x = e.clientX / window.innerWidth - 0.5;
  const y = e.clientY / window.innerHeight - 0.5;
  bg.style.setProperty("--mx", `${x * -18}px`);
  bg.style.setProperty("--my", `${y * -12}px`);
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});
document.addEventListener("pointerdown", armAudio, { once: true });
document.addEventListener("keydown", armAudio, { once: true });
window.addEventListener("load", () =>
  setTimeout(() => loader.classList.add("hidden"), 900),
);
setTimeout(() => loader.classList.add("hidden"), 2200);
