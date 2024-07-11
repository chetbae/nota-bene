/**
 * Toggle s for current user selection. Activates if partial or no <s> tags are present, deactives if all selected nodes are s.
 */
export function toggleStrikethrough() {
  const selection = window.getSelection();

  // Toggle s for caret selection
  if (selection.type === "Caret") toggleStrikethroughCaret(selection);
  // Toggle s for range selection
  else if (selection.type === "Range") toggleStrikethroughRange(selection);
}

function toggleStrikethroughCaret(selection) {
  console.log("toggleStrikethroughCaret");
}

function toggleStrikethroughRange(selection) {
  const range = selection.getRangeAt(0);
  const commonAncestorContainer = range.commonAncestorContainer;

  const startContainer = range.startContainer;
  const endContainer = range.endContainer;
  const startOffset = range.startOffset;
  const endOffset = range.endOffset;

  // Filter leaf nodes for selected nodes
  const allNodes = getLeafNodes(commonAncestorContainer);
  const start = allNodes.indexOf(startContainer);
  const end = allNodes.indexOf(endContainer);
  const selectedNodes = allNodes.slice(start, end + 1);

  // If all nodes are <s>, remove <s>
  const isAllStrikethrough = allStrikethrough(selectedNodes);
  // if (isAllStrikethrough) removeStrikethrough(selectedNodes);
  // else {
  const [newStartContainer, newEndContainer] = addStrikethroughToRange(
    selectedNodes,
    startOffset,
    endOffset
  );
  // }
  commonAncestorContainer.normalize();

  // Reset range to same start and end
  range.setStart(newStartContainer, 0);
  range.setEnd(newEndContainer, newEndContainer.textContent.length);
}

/**
 * Returns all leaf nodes for a given node.
 * @param {Node} node
 * @returns {Node[]}
 */
function getLeafNodes(node) {
  const res = [];

  if (!node.hasChildNodes()) {
    // Only add non-empty text nodes
    if (node.textContent) return [node];
  } else node.childNodes.forEach((child) => res.push(...getLeafNodes(child)));

  return res;
}

/**
 * Checks if all nodes are s.
 * @param {Node[]} nodes
 * @returns {boolean}
 */
function allStrikethrough(nodes) {
  if (nodes.length === 0) return false;
  return nodes.every((node) => node.parentElement.tagName === "S");
}

/**
 * Removes <s> s tags from nodes.
 * @param {Node[]} nodes
 */
function removeStrikethrough(nodes) {
  nodes.forEach((node) => {
    if (node.parentElement.tagName === "S") node.parentElement.replaceWith(node);
  });
}

/** Adds <s> s tags to selected nodes.
 * @param {Node[]} nodes
 * @param {number} startOffset
 * @param {number} endOffset
 */
function addStrikethroughToRange(nodes, startOffset, endOffset) {
  if (nodes.length === 0) return;

  // Get start node and text
  let startNode = nodes[0];

  // If start not strikethrough, split by startOffset and wrap selected text in <s>
  if (startNode.parentElement.tagName !== "S") {
    const startTextBefore = startNode.textContent.slice(0, startOffset);
    const startTextSelected = startNode.textContent.slice(startOffset);

    // Replace and insert <s> text into start node
    startNode.textContent = startTextBefore;
    const startS = document.createElement("s");
    startS.textContent = startTextSelected;
    startNode.parentElement.insertBefore(startS, startNode.nextSibling);

    // Set new start node as textNode of new <s>
    startNode = startS.childNodes[0];
  }

  // Return startNode if only one node selected
  if (nodes.length === 1) return [startNode, startNode];

  // Wrap middle nodes in <s>
  for (let i = 1, n = nodes.length; i < n - 1; i++) {
    const node = nodes[i];

    // If node is already strikethrough, skip
    if (node.parentElement.tagName === "S") continue;

    const s = document.createElement("s");
    s.textContent = node.textContent;
    node.textContent = "";
    node.appendChild(s);
  }

  // Get end node and text
  let endNode = nodes[nodes.length - 1];

  // If end not strikethrough, split by endOffset and wrap selected text in <s>
  if (endNode.parentElement.tagName !== "S") {
    const endTextSelected = endNode.textContent.slice(0, endOffset);
    const endTextAfter = endNode.textContent.slice(endOffset);

    // Replace and insert <s> text into end node
    endNode.textContent = endTextAfter;
    const endS = document.createElement("s");
    endS.textContent = endTextSelected;
    endNode.parentElement.insertBefore(endS, endNode);

    // Set new end node as textNode of new <s>
    endNode = endS.childNodes[0];
  }

  return [startNode, endNode];
}
