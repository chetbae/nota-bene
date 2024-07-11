/**
 * Toggle s for current user selection. Activates if partial or no <s> tags are present, deactives if all selected nodes are s.
 */
export function toggleStrikethrough() {
  const selection = window.getSelection();

  if (selection.type === "Caret") toggleStrikethroughCaret(selection);
  else if (selection.type === "Range") toggleStrikethroughRange(selection);
}

function toggleStrikethroughCaret(selection) {
  const focusNode = selection.focusNode;
  const focusOffset = selection.focusOffset;
  const s = focusNode.parentElement;
  const hasStrikethrough = searchStrikethroughParent(focusNode);
  console.log(focusNode, focusOffset);

  // Unstrike:
  if (hasStrikethrough) {
    if (s.tagName !== "S") console.log("Error: Parent node is not <s>", s);

    const textContent = s.textContent;

    const beforeText = textContent.slice(0, focusOffset);
    const afterText = textContent.slice(focusOffset);

    const sParent = s.parentElement;
    const before = document.createElement("s");
    before.innerHTML = beforeText;
    const invisibleTextNode = document.createTextNode("‎");

    // "<s>afterText</s>" -> "&lrm;"<s>afterText</s> -> <s>beforeText</s>"&lrm;"<s>afterText</s>
    s.textContent = afterText;
    sParent.insertBefore(invisibleTextNode, s);
    sParent.insertBefore(before, invisibleTextNode);

    // Set cursor to on invisible text node
    selection.selectAllChildren(s);
    selection.collapseToStart();
  }
  // Strike: Insert empty <s> tag at focusOffset position in parent
  else {
    // "beforeTextAfterText" -> "beforeText"<s></s>"AfterText"
    const textContent = focusNode.textContent,
      beforeText = textContent.slice(0, focusOffset),
      afterText = textContent.slice(focusOffset);

    const parent = focusNode.parentElement;
    const s = document.createElement("s");
    s.appendChild(document.createTextNode("‎"));
    const before = document.createTextNode(beforeText);

    // "afterText" -> <s></s>"beforeText" -> "beforeText"<s></s>"afterText"
    focusNode.textContent = afterText;
    parent.insertBefore(s, focusNode);
    parent.insertBefore(before, s);

    // Set cursor to on <s> tag
    selection.selectAllChildren(s);
  }

  focusNode.normalize();
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

  const isAllStrikethrough = allStrikethrough(selectedNodes);
  console.log("isAllStrikethrough", isAllStrikethrough);

  // Remove all strikethrough from nodes
  if (isAllStrikethrough) {
    console.log("Remove strikethrough");
  }
  // Add strikethrough to all nodes
  else {
    console.log("Add strikethrough");
    // wrapStrikethrough(selection);
  }
}

/**
 * Wraps selected text in <s> tag.
 * @param {Selection} selection
 */
function wrapStrikethrough(selection) {
  const range = selection.getRangeAt(0);
  const selectedText = range.extractContents();
  const s = document.createElement("s");

  s.appendChild(selectedText);
  range.insertNode(s);
}

/**
 * Checks if a node or its sub-trees have <s> tags.
 * @param {Node} root
 * @returns {boolean} True if a <s> tag is found in the node or its sub-trees.
 */
function searchStrikethroughChildren(root) {
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();

    if (node.tagName === "S") return true;
    if (node.hasChildNodes()) {
      const children = Array.from(node.childNodes);
      stack.push(...children);
    }
  }
  return false;
}

/**
 * Checks if a node or its parent nodes have <s> tags.
 * @param {Node} node
 * @returns {boolean} True if a <s> tag is found in the node or its parent nodes.
 */
function searchStrikethroughParent(node) {
  let currentNode = node;

  while (currentNode) {
    if (currentNode.tagName === "S") return true;
    if (!currentNode.parentElement || currentNode.parentElement.id === "note-page") return false;

    currentNode = currentNode.parentElement;
  }
  return false;
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

// // TODO: Buggy
// function mergeAdjacentStrikethroughNodes(node) {
//   if (!node.hasChildNodes()) return;

//   for (let i = 1, n = node.childNodes.length; i < n; i++) {
//     const prevNode = node.childNodes[i - 1];
//     const currentNode = node.childNodes[i];

//     // Check if adjacent nodes have the same tag
//     if (prevNode.tagName === "S" && currentNode.tagName === "S") {
//       // Merge prev into node
//       currentNode.textContent = prevNode.textContent + currentNode.textContent;
//       prevNode.remove();
//     }

//     // Traverse children
//     mergeAdjacentStrikethroughNodes(currentNode);
//   }
// }
