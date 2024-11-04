let videoElement = null;
let movieId = null;
let movieTitle = null;

function initializeTracking() {
  videoElement = document.querySelector('video');
  if (videoElement) {
    movieId = window.location.pathname.split('/').pop();
    movieTitle = document.querySelector('.video-title').textContent;

    videoElement.addEventListener('pause', saveProgress);
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "checkProgress") {
        checkProgress();
      }
    });
  }
}

function saveProgress() {
  if (videoElement && movieId) {
    chrome.runtime.sendMessage({
      action: "saveProgress",
      movieId: movieId,
      title: movieTitle,
      currentTime: videoElement.currentTime,
      duration: videoElement.duration
    });
  }
}

function checkProgress() {
  chrome.storage.sync.get('movies', (data) => {
    const movies = data.movies || {};
    const savedProgress = movies[movieId];
    if (savedProgress && Math.abs(savedProgress.currentTime - videoElement.currentTime) > 5) {
      showRecap(savedProgress);
    }
  });
}

function showRecap(savedProgress) {
  const recapOverlay = document.createElement('div');
  recapOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;
  recapOverlay.innerHTML = `
    <div>
      <h2>Welcome back to ${savedProgress.title}</h2>
      <p>You left off at ${formatTime(savedProgress.currentTime)}.</p>
      <p>Total duration: ${formatTime(savedProgress.duration)}</p>
      <button id="resumeButton">Resume</button>
    </div>
  `;
  document.body.appendChild(recapOverlay);

  document.getElementById('resumeButton').addEventListener('click', () => {
    videoElement.currentTime = savedProgress.currentTime;
    recapOverlay.remove();
    videoElement.play();
  });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

initializeTracking();
