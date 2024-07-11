import { createCheckboxList } from "./checkboxes.mjs";
import { setCursorToOffset } from "./utils.mjs";

export const commandMap = {
  "#": (parent, text) => transformElement(parent, "h1", text),
  "##": (parent, text) => transformElement(parent, "h2", text),
  "###": (parent, text) => transformElement(parent, "h3", text),
  "-": (parent, text) => transformList(parent, "ul", text),
  "1.": (parent, text) => transformList(parent, "ol", text),
  "*": (parent, text) => transformList(parent, "ul", text),
  "[]": (parent, text) => transformCheckboxList(parent, text),
  "```": (parent, text) => transformCodeBlock(parent),
};

/**
 * Transforms an element to a new type
 * @param {HTMLElement} element
 * @param {string} newType
 * @param {string} existingText
 * @returns New element
 */
function transformElement(element, newType, text) {
  const newElement = document.createElement(newType);
  newElement.innerHTML = text ? text : "<br>";
  element.replaceWith(newElement);

  // Set cursor to end of element
  setCursorToOffset(newElement, 0);
  return newElement;
}

/**
 * Transforms an element into a list element
 * @param {HTMLElement} element
 * @param {string} type
 * @param {string} text
 * @returns New list element
 */
function transformList(element, type, text) {
  const list = document.createElement(type);
  const li = document.createElement("li");
  li.innerHTML = text ? text : "<br>";
  list.appendChild(li);
  element.replaceWith(list);

  // Set cursor to end of element
  setCursorToOffset(list, 0);
  return list;
}

/**
 * Transforms an element into a checkbox list element
 * @param {HTMLElement} element
 * @param {string} text
 * @returns New checkbox list element
 */
function transformCheckboxList(element, text) {
  const checkboxList = createCheckboxList(text);
  element.replaceWith(checkboxList);

  // Set cursor to end of element
  setCursorToOffset(checkboxList, 1);
  return checkboxList;
}

/**
 * Transforms an element into a code block element
 * @param {HTMLElement} element
 * @returns New code block element
 */
function transformCodeBlock(element) {
  const container = document.createElement("pre");
  container.spellcheck = false;
  container.classList.add("code");
  const div = document.createElement("div");
  div.innerHTML = "<br>";
  container.appendChild(div);
  element.replaceWith(container);

  // Set cursor to end of element
  setCursorToOffset(div, 0);
  return container;
}
