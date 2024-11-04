document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle");
  
    // Load the current state from storage
    chrome.storage.local.get("isEnabled", (data) => {
      toggle.checked = data.isEnabled !== undefined ? data.isEnabled : true; // Default to enabled
    });
  
    // Add event listener for toggle changes
    toggle.addEventListener("change", () => {
      const isEnabled = toggle.checked;
      chrome.storage.local.set({ isEnabled });
      // Optionally, perform an action based on the state
      if (isEnabled) {
        alert("Extension is enabled.");
      } else {
        alert("Extension is disabled.");
      }
    });
  });
  