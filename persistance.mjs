const CHROME_CONTENT_KEY = "nota-bene-content";

export function saveContent(content) {
  chrome.storage.local.set({ [CHROME_CONTENT_KEY]: content }).catch((error) => {
    console.error(error);
  });
}

export async function loadContent() {
  return await chrome.storage.local
    .get([CHROME_CONTENT_KEY])
    .then((result) => result[CHROME_CONTENT_KEY])
    .catch((error) => {
      console.error(error);
    });
}
