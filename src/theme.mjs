import { loadTheme, saveTheme } from "./persistance.mjs";
import { displaySnackbar } from "./utils.mjs";

const themeButton = document.getElementById("app-theme-button");
const appBody = document.getElementById("app-body");

const themes = ["light", "dark", "norsk"];
const symbols = ["🌞", "🌚", "🇳🇴"];

export const loadPreviousTheme = async () =>
  loadTheme().then((theme) => {
    appBody.setAttribute("theme", theme);
    themeButton.innerHTML = symbols[theme];
  });

// Sets next theme in theme list
export function onThemeToggle(event) {
  const att = appBody.getAttribute("theme");
  const currentTheme = att ? Number(att) : 0;
  const newTheme = (currentTheme + 1) % themes.length;

  setTheme(newTheme);
  setThemeButton(newTheme);
  saveTheme(newTheme);
  displaySnackbar(`Theme changed to <b>${themes[newTheme]}</b> mode.`);
}

function setTheme(index) {
  appBody.setAttribute("theme", index);
}

function setThemeButton(index) {
  themeButton.innerHTML = symbols[index];
}
