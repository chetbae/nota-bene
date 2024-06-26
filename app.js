import { persistChrome } from "./persistance.mjs";

const CHROME_CONTENT_KEY = "nota-bene-content";
const contentElement = document.getElementById("app-content");

// Save and load content area to/from chrome storage
persistChrome(contentElement, CHROME_CONTENT_KEY);
