/**
 * Toggle s for current user selection. Activates if partial or no <s> tags are present, deactives if all selected nodes are s.
 */
export function toggleStrikethrough() {
  document.execCommand("strikeThrough");
}

/* WORKING */

// /**
//  * Toggles strikethrough for a caret selection.
//  * @param {Selection} selection
//  */
// function toggleStrikethroughCaret(selection) {
//   const focusNode = selection.focusNode;
//   const focusOffset = selection.focusOffset;
//   const hasStrikethrough = searchStrikethroughParent(focusNode);

//   // Unstrike:
//   if (hasStrikethrough) {
//     const s = focusNode.parentElement;
//     const beforeText = s.textContent.slice(0, focusOffset);
//     const afterText = s.textContent.slice(focusOffset);

//     const before = document.createElement("s");
//     before.innerHTML = beforeText;
//     const invisibleTextNode = document.createTextNode("‎");
//     const sParent = s.parentElement;

//     // "<s>afterText</s>" -> "&lrm;"<s>afterText</s> -> <s>beforeText</s>"&lrm;"<s>afterText</s>
//     s.textContent = afterText;
//     sParent.insertBefore(invisibleTextNode, s);
//     sParent.insertBefore(before, invisibleTextNode);

//     // Set cursor to on invisible text node
//     selection.selectAllChildren(s);
//     selection.collapseToStart();
//   }

//   // Strike: Insert empty <s> tag at focusOffset position in parent
//   else {
//     // "beforeTextAfterText" -> "beforeText"<s></s>"AfterText"
//     const textContent = focusNode.textContent,
//       beforeText = textContent.slice(0, focusOffset),
//       afterText = textContent.slice(focusOffset);

//     const parent = focusNode.parentElement;
//     const s = document.createElement("s");
//     s.appendChild(document.createTextNode("‎"));
//     const before = document.createTextNode(beforeText);

//     // "afterText" -> <s></s>"beforeText" -> "beforeText"<s></s>"afterText"
//     focusNode.textContent = afterText;
//     parent.insertBefore(s, focusNode);
//     parent.insertBefore(before, s);

//     // Set cursor to on <s> tag
//     selection.selectAllChildren(s);
//   }

//   focusNode.normalize();
// }

/* NOT WORKING (WELL) */

// function toggleStrikethroughRange(selection) {
//   const range = selection.getRangeAt(0);
//   const commonAncestorContainer = range.commonAncestorContainer;

//   const startContainer = range.startContainer;
//   const endContainer = range.endContainer;
//   const startOffset = range.startOffset;
//   const endOffset = range.endOffset;

//   // Get all top-level nodes of selection that contain <s> tags
//   getStrikethroughNodes(selection);
// }

// function getStrikethroughNodes(selection) {
//   const range = selection.getRangeAt(0);
//   const commonAncestorContainer = range.commonAncestorContainer;
//   const startContainer = range.startContainer;
//   const endContainer = range.endContainer;
//   const startOffset = range.startOffset;
//   const endOffset = range.endOffset;

//   if (startOffset !== 0) console.log("startOffset", startOffset);
//   if (endOffset !== endContainer.length) console.log("endOffset", endOffset);

// }

// /**
//  * Wraps selected text in <s> tag.
//  * @param {Selection} selection
//  */
// function surroundStrikethrough(selection) {
//   const range = selection.getRangeAt(0);
//   const selectedText = range.extractContents();
//   const s = document.createElement("s");

//   s.appendChild(selectedText);
//   range.insertNode(s);
// }

// /**
//  * Checks if a node or its sub-trees have <s> tags.
//  * @param {Node} root
//  * @returns {boolean} True if a <s> tag is found in the node or its sub-trees.
//  */
// function searchStrikethroughChildren(root) {
//   const stack = [root];

//   while (stack.length > 0) {
//     const node = stack.pop();

//     if (node.tagName === "S") return true;
//     if (node.hasChildNodes()) {
//       const children = Array.from(node.childNodes);
//       stack.push(...children);
//     }
//   }
//   return false;
// }

// /**
//  * Checks if a node or its parent nodes have <s> tags.
//  * @param {Node} node
//  * @returns {boolean} True if a <s> tag is found in the node or its parent nodes.
//  */
// function searchStrikethroughParent(node) {
//   let currentNode = node;

//   while (currentNode) {
//     if (currentNode.tagName === "S") return true;
//     if (!currentNode.parentElement || currentNode.parentElement.id === "note-page") return false;

//     currentNode = currentNode.parentElement;
//   }
//   return false;
// }

// /**
//  * Returns all leaf nodes for a given node.
//  * @param {Node} node
//  * @returns {Node[]}
//  */
// function getLeafNodes(node) {
//   const res = [];

//   if (!node.hasChildNodes()) {
//     // Only add non-empty text nodes
//     if (node.textContent) return [node];
//   } else node.childNodes.forEach((child) => res.push(...getLeafNodes(child)));

//   return res;
// }

// /**
//  * Checks if all nodes are s.
//  * @param {Node[]} nodes
//  * @returns {boolean}
//  */
// function allStrikethrough(nodes) {
//   if (nodes.length === 0) return false;
//   return nodes.every((node) => node.parentElement.tagName === "S");
// }
