import { createCheckboxList } from "./checkboxes.mjs";

const commandMap = {
  "#": (parent, text) => transformElement(parent, "h1", text),
  "##": (parent, text) => transformElement(parent, "h2", text),
  "###": (parent, text) => transformElement(parent, "h3", text),
  "-": (parent, text) => transformList(parent, "ul", text),
  "1.": (parent, text) => transformList(parent, "ol", text),
  "*": (parent, text) => transformList(parent, "ul", text),
  "[]": (parent, text) => transformCheckboxList(parent, text),
  // "```": "code",
};

/**
 * Transforms an element to a new type
 * @param {HTMLElement} element
 * @param {string} newType
 * @param {string} existingText
 * @returns New element
 */
function transformElement(element, newType, existingText) {
  const newElement = document.createElement(newType);
  newElement.innerHTML = existingText ? existingText : "<br>";
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
  li.innerHTML = text;
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

  // Set cursor after checkbox
  const selection = document.getSelection();
  console.log(selection);

  // Set cursor to end of element
  setCursorToOffset(checkboxList, 1);
  return checkboxList;
}

/**
 * Set cursor to an offset within the specific element
 * @param {Element} element
 * @param {number} offset
 */
function setCursorToOffset(element, offset) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(element, offset);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

export default commandMap;
