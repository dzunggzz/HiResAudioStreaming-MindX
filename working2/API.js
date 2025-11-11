const API_BASE = "https://hifi.401658.xyz";
const IMAGE_API_BASE = "https://resources.tidal.com/images/";

const searchInput = document.getElementById("searchInput");
const resultsGrid = document.getElementById("resultsGrid");
const placeholder = document.getElementById("placeholder");
const audio = document.getElementById("audio");
const queueContainer = document.getElementById("queueContainer");
const queueList = document.getElementById("queueList");
const queueBtn = document.getElementById("queueBtn");

const albumArt = document.getElementById("albumArt");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volumeSlider");
const progressContainer = document.getElementById("progressContainer");

let currentList = [];
let queue = [];
let currentSong = 0;
let isPlaying = false;
new Sortable(queueList, {
  animation: 150,
  ghostClass: "sortable-ghost",
  onEnd: (evt) => {
    const [movedItem] = queue.splice(evt.oldIndex, 1);
    queue.splice(evt.newIndex, 0, movedItem);

    const currentSongId = queue[currentSong]?.id;
    if (currentSongId) {
      const newCurrentIndex = queue.findIndex(
        (song) => song.id === currentSongId
      );
      if (newCurrentIndex !== -1) {
        currentSong = newCurrentIndex;
      }
    }

    renderQueue();
  },
});

const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value.trim()) {
    searchSongs(searchInput.value.trim());
  }
});

async function searchSongs(query) {
  resultsGrid.innerHTML = `<p id="placeholder">searching "${query}"...</p>`;
  try {
    const res = await fetch(`${API_BASE}/search/?s=${query}`);
    const data = await res.json();
    console.log(data);
    displayResults(data.items || []);
  } catch (err) {
    resultsGrid.innerHTML = `<p id="placeholder" style="color: #f87171;">error fetching data</p>`;
  }
}

function displayResults(songs) {
  currentList = songs;
  resultsGrid.innerHTML = "";

  if (!songs.length) {
    resultsGrid.innerHTML = `<p id="placeholder">no results</p>`;
    return;
  }

  songs.forEach((song, i) => {
    const card = document.createElement("div");
    card.className = "song-card";
    card.innerHTML = `
        <img src="${IMAGE_API_BASE}${song.album.cover
          .split("-")
          .join("/")}/320x320.jpg" alt="${song.title}">
        <div class="title">${song.title}</div>
        <div class="artist">${song.artist.name}</div>
        <button class="add-to-queue-btn" title="add to queue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </button>
    `;
    card.querySelector(".add-to-queue-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      addToQueue(song);
    });
    card.addEventListener("click", () => playSong(i, currentList));
    resultsGrid.appendChild(card);
  });
}

function renderQueue() {
  queueList.innerHTML = "";
  if (queue.length === 0) {
    queueList.innerHTML =
      '<p style="color: var(--text-secondary); text-align: center;">your queue is empty</p>';
    return;
  }
  queue.forEach((song, i) => {
    const item = document.createElement("div");
    item.className = "queue-item";
    item.innerHTML = `
        <img src="${IMAGE_API_BASE}${song.album.cover
          .split("-")
          .join("/")}/80x80.jpg" alt="${song.title}">
        <div class="details">
            <div class="title">${song.title}</div>
            <div class="artist">${song.artist.name}</div>
        </div>
        <button class="remove-from-queue-btn" title="remove from queue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    item.addEventListener("click", () => {
      playSongFromQueue(i);
    });
    item
      .querySelector(".remove-from-queue-btn")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        removeFromQueue(i);
      });
    queueList.appendChild(item);
  });
}

function addToQueue(song) {
  queue.push(song);
  renderQueue();
}

function removeFromQueue(index) {
  queue.splice(index, 1);
  renderQueue();
}

async function playSong(index, list = currentList) {
  const song = list[index];
  if (!song) return;

  queue = [...list];
  currentSong = index;
  await playSongFromQueue(currentSong, true);
  renderQueue();
}

async function playSongFromQueue(index, forcePlay = false) {
  if (!forcePlay && index === currentSong) return;

  const song = queue[index];
  if (!song) return;

  currentSong = index;
  const streamRes = await fetch(
    `${API_BASE}/track/?id=${song.id}&quality=LOSSLESS`
  );
  const streamData = await streamRes.json();

  audio.src = streamData[2].OriginalTrackUrl;
  albumArt.src = `${IMAGE_API_BASE}${song.album.cover
    .split("-")
    .join("/")}/320x320.jpg`;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist.name;

  audio.play();
  isPlaying = true;
  updatePlayButton(isPlaying);

  console.log("currentList[index]", currentList[index]);
  console.log("streamData", streamData);
  console.log("currentList[index].album.cover", currentList[index].album.cover);
}

playBtn.addEventListener("click", () => {
  if (!audio.src) return;
  isPlaying ? audio.pause() : audio.play();
  isPlaying = !isPlaying;
  updatePlayButton(isPlaying);
});
function updatePlayButton(playing) {
  const playIcon = playBtn.querySelector(".play-icon");
  const pauseIcon = playBtn.querySelector(".pause-icon");
  if (playing) {
    playIcon.style.display = "none";
    pauseIcon.style.display = "inline-block";
  } else {
    playIcon.style.display = "inline-block";
    pauseIcon.style.display = "none";
  }
}

nextBtn.addEventListener("click", () => {
  if (queue.length > 0) {
    playSongFromQueue((currentSong + 1) % queue.length);
  }
});

prevBtn.addEventListener("click", () => {
  if (queue.length > 0) {
    playSongFromQueue((currentSong - 1 + queue.length) % queue.length);
  }
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

audio.addEventListener("ended", () => nextBtn.click());

volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

queueBtn.addEventListener("click", () => {
  queueContainer.classList.toggle("visible");
});

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

progressContainer.addEventListener("click", (e) => {
  if (audio.duration) {
    const clickX = e.offsetX;
    const width = progressContainer.clientWidth;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
  }
});
