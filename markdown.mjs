/**
 * Converts node to github flavoured markdown, recursively traverses child nodes
 * @param {HTMLElement} node
 * @returns {string} Markdown
 */
export function nodeToMarkdown(node, prefix = "", indent = -1) {
  let res = [];

  // Leaf text node -> text
  if (node.nodeType === Node.TEXT_NODE) {
    res.push(node.textContent);
  } else if (node.tagName === "BR") {
    res.push("<br>");
  }
  // Headers -> #[1-3] + newline
  else if (node.tagName === "H1") res.push(`# ${node.textContent}\n\n`);
  else if (node.tagName === "H2") res.push(`## ${node.textContent}\n\n`);
  else if (node.tagName === "H3") res.push(`### ${node.textContent}\n\n`);
  // Text styling -> wrap
  else if (node.tagName === "B") res.push(`**${node.textContent}**`);
  else if (node.tagName === "I") res.push(`*${node.textContent}*`);
  else if (node.tagName === "U") res.push(`<u>${node.textContent}</u>`);
  else if (node.tagName === "STRIKE") res.push(`~~${node.textContent}~~`);
  else if (node.tagName === "A") res.push(`[${node.textContent}](${node.href})`);
  // Checkboxes -> - [x] {recurse contents} + newline
  else if (node.tagName === "UL" && node.classList.contains("checkbox")) {
    for (const child of node.childNodes) {
      res.push(`- ${nodeToMarkdown(child)}`);
    }
  } else if (node.tagName === "LI" && node.classList.contains("checkbox")) {
    for (const child of node.childNodes) {
      res.push(`[${node.classList.contains("checked") ? "x" : " "}] ${nodeToMarkdown(child)}\n`);
    }
  } else if (node.tagName === "DIV" && node.classList.contains("checkbox")) {
    for (const child of node.childNodes) {
      res.push(nodeToMarkdown(child));
    }
  }

  // Bullet List -> - {recurse contents} + newline
  else if (node.tagName === "UL") {
    for (const child of node.childNodes) {
      res.push(`- ${nodeToMarkdown(child)}\n`);
    }
    res.push("\n");
  }

  // Numbered List -> {i}. {recurse contents} + newline
  else if (node.tagName === "OL") {
    let i = 1;
    for (const child of node.childNodes) {
      res.push(`${i}. ${nodeToMarkdown(child)}\n`);
      i++;
    }
    res.push("\n");
  } else if (node.tagName === "LI") {
    for (const child of node.childNodes) {
      res.push(nodeToMarkdown(child));
    }
  }

  // Codeblock
  else if (node.tagName === "PRE" && node.classList.contains("code")) {
    res.push("```\n");
    for (const child of node.childNodes) {
      res.push(`${nodeToMarkdown(child)}\n`);
    }
    res.push("```\n\n");
  }

  // Containers
  // General containers -> recurse child nodes + newline
  else if (node.tagName === "DIV" && !node.classList.contains("checkbox")) {
    for (const child of node.childNodes) {
      res.push(nodeToMarkdown(child));
    }

    res.push("\n\n");
  }

  return res.join("");
}
