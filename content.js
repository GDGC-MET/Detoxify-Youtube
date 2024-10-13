let keywords = [];

function filterVideos() {
  const videoElements = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer');
  videoElements.forEach(video => {
    const titleElement = video.querySelector('#video-title');
    const channelElement = video.querySelector('#text.ytd-channel-name');
    const descriptionElement = video.querySelector('#description-text');

    if (titleElement || channelElement || descriptionElement) {
      const title = titleElement ? titleElement.textContent.toLowerCase() : '';
      const channel = channelElement ? channelElement.textContent.toLowerCase() : '';
      const description = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';

      const contentToCheck = title + ' ' + channel + ' ' + description;
      
      const shouldUnblur = keywords.some(keyword => 
        contentToCheck.includes(keyword.toLowerCase())
      );

      video.classList.toggle('blur-video', !shouldUnblur);
    }
  });
}

function onMutations(mutations) {
  for (let mutation of mutations) {
    if (mutation.type === 'childList') {
      filterVideos();
    }
  }
}

chrome.storage.sync.get('keywords', function(data) {
  if (data.keywords) {
    keywords = data.keywords;
    filterVideos();
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "updateKeywords") {
    keywords = request.keywords;
    filterVideos();
  }
});

const observer = new MutationObserver(onMutations);
observer.observe(document.body, { childList: true, subtree: true });

// Initial filter
filterVideos();