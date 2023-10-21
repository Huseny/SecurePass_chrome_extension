chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ passwords: [] });
});

chrome.webNavigation.onCompleted.addListener(({ tabId, frameId }) => {
  if (frameId !== 0) return;

  chrome.scripting.executeScript({
    target: { tabId },
    files: ["passwordManager.js"],
  });
});
