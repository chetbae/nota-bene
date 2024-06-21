console.log("app.js is working.");

const CONTENT_KEY = "nota-bene-content";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired. Replacing app-content with 'hello world'");

  const contentElement = document.getElementById("app-content");
  contentElement.innerHTML = "hello world";
});
