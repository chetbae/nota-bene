/**
 * Toggle s for current user selection. Activates if partial or no <s> tags are present, deactives if all selected nodes are s.
 */
export function toggleStrikethrough() {
  document.execCommand("strikeThrough");
}
