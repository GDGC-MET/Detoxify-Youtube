document.addEventListener('DOMContentLoaded', function() {
  const saveButton = document.getElementById('save');
  const keywordsInput = document.getElementById('keywords');
  const statusDiv = document.getElementById('status');

  if (!saveButton || !keywordsInput || !statusDiv) {
    console.error("Required elements not found");
    return;
  }

  saveButton.addEventListener('click', function() {
    const keywords = keywordsInput.value.split(',').map(k => k.trim());
    chrome.storage.sync.set({keywords: keywords}, function() {
      if (chrome.runtime.lastError) {
        console.error("Error saving keywords:", chrome.runtime.lastError);
        statusDiv.textContent = "Error saving keywords. Please try again.";
      } else {
        console.log('Keywords saved');
        statusDiv.textContent = "Keywords saved successfully!";
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (chrome.runtime.lastError) {
            console.error("Error querying tabs:", chrome.runtime.lastError);
          } else if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "updateKeywords", keywords: keywords}, function(response) {
              if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError);
              }
            });
          }
        });
      }
    });
  });

  chrome.storage.sync.get('keywords', function(data) {
    if (chrome.runtime.lastError) {
      console.error("Error retrieving keywords:", chrome.runtime.lastError);
    } else if (data && data.keywords) {
      keywordsInput.value = data.keywords.join(', ');
    } else {
      keywordsInput.value = '';
    }
  });
});