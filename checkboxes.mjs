/**
 * Returns a checkbox list element
 * @param {string} text
 * @returns Checkbox list element
 */
export function createCheckboxList(text) {
  const checkboxUl = document.createElement("ul");
  checkboxUl.classList.add("checkbox");

  const checkboxLi = document.createElement("li");
  checkboxLi.classList.add("checkbox");

  const div = document.createElement("div");
  div.classList.add("checkbox");
  div.innerHTML = text ? text : "<br>";

  checkboxLi.appendChild(div);
  checkboxUl.appendChild(checkboxLi);

  // Apply checkbox toggle listener
  addCheckboxListener(checkboxUl);

  return checkboxUl;
}

/**
 * Applies a checkbox toggle listener to checkbox div row
 * @param {HTMLElement} checkboxRow
 */
function addCheckboxListener(checkboxUl) {
  // Apply checkbox toggle listener
  checkboxUl.addEventListener("click", (event) => {
    const target = event.target;

    // Only targets <li> ::marker, not <div> text, or after thanks to css for li.checkbox width = fit-content
    if (target.tagName === "LI") {
      target.classList.toggle("checked");
    }
  });
}

/**
 * Applies checkbox toggle listeners to all checkbox <ul> elements
 */
export function addAllCheckboxListeners() {
  const checkboxes = document.querySelectorAll("ul.checkbox");
  checkboxes.forEach((ul) => {
    addCheckboxListener(ul);
  });
}
