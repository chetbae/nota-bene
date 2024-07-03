import { persistChrome } from "./persistance.mjs";

const CHROME_CONTENT_KEY = "nota-bene-content";
const contentContainer = document.getElementById("note-page");

// Save and load content area to/from chrome storage
persistChrome(contentContainer, CHROME_CONTENT_KEY);

document.addEventListener("keyup", (event) => {
  // Spacebar executes command if there is one
  if (event.key === " ") {
    console.log("Execute command");

    const focusNode = document.getSelection().focusNode;
    if (!focusNode) {
      window.alert("No Focus Node (app.js)"); // PUTTING THIS HERE FOR TESTING
      return;
    }

    let parent = focusNode.parentElement;
    const text = focusNode.textContent;
    const command = text ? text.slice(0, -1) : "";

    // Puts focusNode into <div> if it is exposed in #note-page (1)
    if (parent.id === "note-page") {
      const div = document.createElement("div");
      div.innerHTML = focusNode.textContent;
      focusNode.replaceWith(div);
      parent = div;
    }

    // Transform container element based on command (e.g. #, ##, ### -> h1, h2, h3)
    if (commandMap[command]) {
      const element = document.createElement(commandMap[command]);
      element.appendChild(document.createElement("br"));
      parent.replaceWith(element);
    }
  }

  if (!(event.shiftKey || event.metaKey || event.ctrlKey || event.altKey)) return;
});

contentContainer.addEventListener("click", (event) => {});

// helper print function
const foo = (...item) => console.log(...item);

const commandMap = {
  "#": "h1",
  "##": "h2",
  "###": "h3",
  // "-": "li",
  // "1.": "li",
  // "*": "li",
  // "[]": "li",
  // "```": "code",
};

/**
 * (1) If contenteditable only has one line, the text content is not wrapped in a div. For our purposes, we need a div wrapper to apply the command.
 */
