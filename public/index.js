const menuBtnEl = document.getElementById("menuBtn");
const menuContainerEl = document.getElementById("menuContainer");

menuBtnEl.onclick = () => {
  menuContainerEl.classList.toggle("close");
};
