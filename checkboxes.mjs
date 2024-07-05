/**
 * Returns a checkbox list element
 * @param {string} text
 * @returns Checkbox list element
 */
export function createCheckboxList(text) {
  const list = document.createElement("ul");
  list.classList.add("checkbox-list");

  const checkboxRow = createCheckboxRow(text);
  list.appendChild(checkboxRow);

  return list;
}

export function createCheckboxRow(text) {
  const checkboxRow = document.createElement("div");
  checkboxRow.classList.add("checkbox-row");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("checkbox");

  checkboxRow.appendChild(checkbox);
  checkboxRow.innerHTML += text;

  applyCheckboxListener(checkboxRow);
  return checkboxRow;
}

/**
 * Applies a checkbox toggle listener to checkbox div row
 * @param {HTMLElement} checkboxRow
 */
function applyCheckboxListener(checkboxRow) {
  // Apply checkbox toggle listener
  checkboxRow.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName === "INPUT")
      !target.checked
        ? target.removeAttribute("checked")
        : target.setAttribute("checked", "checked");
  });
}

/**
 * Applies checkbox toggle listeners to all checkbox rows
 */
export function applyAllCheckboxListeners() {
  const checkboxes = document.querySelectorAll(".checkbox-row input");
  checkboxes.forEach((checkbox) => {
    applyCheckboxListener(checkbox);
  });
}

const checkboxes = {
  createCheckboxList,
  applyCheckboxListener,
  applyAllCheckboxListeners,
};

export default checkboxes;
