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
