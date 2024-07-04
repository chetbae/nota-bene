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
  return checkboxList;
}

export default commandMap;
