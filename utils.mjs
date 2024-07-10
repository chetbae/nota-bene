/**
 * Set cursor to an offset within the specific element
 * @param {Element} element
 * @param {number} offset
 */
export function setCursorToOffset(element, offset) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(element, offset);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

export function createLink() {
  const a = document.createElement("a");
  const url = prompt("Enter URL:");
  if (!url) return;

  a.href = url;
  a.title = url;
  addLinkListener(a);

  window.getSelection().getRangeAt(0).surroundContents(a);

  // Check if selection is empty -> paste url
  if (!window.getSelection().toString()) {
    a.innerHTML = url;
  }
}

function addLinkListener(a) {
  a.addEventListener("click", (event) => {
    event.preventDefault();
    window.open(a.href, "_blank");
  });
}

export function addAllLinkListeners() {
  const links = document.querySelectorAll("a");
  links.forEach((a) => {
    addLinkListener(a);
  });
}
