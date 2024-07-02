import { persistChrome } from "./persistance.mjs";

const CHROME_CONTENT_KEY = "nota-bene-content";
const contentContainer = document.getElementById("app-content-container");

// Save and load content area to/from chrome storage
persistChrome(contentContainer, CHROME_CONTENT_KEY);

// Monitor user cursor and keypress states
let keyId;
let target;

// contentElement.addEventListener("keyup", (e) => {
//   keyId = e.key;
//   const foo = document.activeElement;
//   console.log("foo", foo);
//   console.log("keyup", e.target);
// });

// contentElement.addEventListener("click", (e) => {
//   target = e.target;
//   console.log("click", e.target);
// });
