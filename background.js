chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ movies: {} });
});

chrome.storage.local.get("isEnabled", (data) => {
  if (data.isEnabled === false) {
    // Disable the functionality of the extension
    console.log("Extension is disabled.");
  } else {
    // Enable the functionality of the extension
    console.log("Extension is enabled.");
  }
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('netflix.com/watch/')) {
    chrome.tabs.sendMessage(tabId, { action: "checkProgress" });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveProgress") {
    chrome.storage.sync.get('movies', (data) => {
      const movies = data.movies || {};
      movies[request.movieId] = {
        title: request.title,
        currentTime: request.currentTime,
        duration: request.duration
      };
      chrome.storage.sync.set({ movies });
    });
  }
});
