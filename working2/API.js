const API_BASE = "https://vogel.qqdl.site";
const IMAGE_API_BASE = "https://resources.tidal.com/images/";

const searchInput = document.getElementById("searchInput");
const resultsGrid = document.getElementById("resultsGrid");
const placeholder = document.getElementById("placeholder");
const audio = document.getElementById("audio");
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

const searchBtn = document.getElementById("searchBtn");
const queuePanel = document.getElementById("queuePanel");
const closeQueueBtn = document.getElementById("closeQueueBtn");
const queueCount = document.getElementById("queueCount");
const queueLength = document.getElementById("queueLength");
const queueListContainer = document.getElementById("queueListContainer");

searchBtn.addEventListener("click", () => {
  if (searchInput.value.trim()) {
    searchSongs(searchInput.value.trim());
  }
});

queueBtn.addEventListener("click", () => {
  queuePanel.style.display =
    queuePanel.style.display === "none" ? "block" : "none";
});

closeQueueBtn.addEventListener("click", () => {
  queuePanel.style.display = "none";
});

async function searchSongs(query) {
  resultsGrid.innerHTML = `<p id="placeholder">Searching "${query}"...</p>`;
  try {
    const res = await fetch(`${API_BASE}/search/?s=${query}`);
    const data = await res.json();
    console.log(data);
    displayResults(data.items || []);
  } catch (err) {
    resultsGrid.innerHTML = `<p id="placeholder" style="color: #f87171;">Error fetching data</p>`;
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
    card.className =
      "track-glass group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:brightness-110";
    card.innerHTML = `
        <img src="${IMAGE_API_BASE}${song.album.cover
      .split("-")
      .join("/")}/320x320.jpg" alt="${
      song.title
    }" class="h-[64px] w-[64px] rounded object-cover">
        <div class="min-w-0 flex-1">
          <h3 class="truncate font-semibold text-white group-hover:text-blue-400">${
            song.title
          }</h3>
          <a class="truncate text-sm text-gray-400 hover:text-blue-400 hover:underline inline-block">${
            song.artist.name
          }</a>
          <p class="text-xs text-gray-500">${
            song.album.title
          } • CD • 16-bit/44.1 kHz FLAC</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-400">
          <button class="add-to-queue-btn rounded-full p-2 text-gray-400 transition-colors hover:text-white" title="add to queue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <span>${formatTime(song.duration || 0)}</span>
        </div>
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
  queueCount.textContent = queue.length;
  queueLength.textContent = queue.length;

  if (queue.length === 0) {
    queueListContainer.innerHTML =
      '<p class="rounded-lg border border-dashed border-gray-700 bg-gray-900/70 px-3 py-8 text-center text-gray-400">Queue is empty</p>';
  } else {
    queueListContainer.innerHTML = "";
    const ul = document.createElement("ul");
    ul.className = "max-h-60 space-y-2 overflow-y-auto pr-1";
    queue.forEach((song, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
          <div class="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
            i === currentSong
              ? "bg-blue-500/10 text-white"
              : "text-gray-200 hover:bg-gray-800/70"
          }">
              <span class="w-6 text-xs font-semibold text-gray-500 group-hover:text-gray-300">${
                i + 1
              }</span>
              <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium">${song.title}</p>
                  <a class="truncate text-xs text-gray-400 hover:text-blue-400 hover:underline inline-block">${
                    song.artist.name
                  }</a>
              </div>
              <button class="rounded-full p-1 text-gray-500 transition-colors hover:text-red-400" title="remove">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
              </button>
          </div>
      `;
      li.querySelector("div").addEventListener("click", () =>
        playSongFromQueue(i)
      );
      li.querySelector("button").addEventListener("click", (e) => {
        e.stopPropagation();
        removeFromQueue(i);
      });
      ul.appendChild(li);
    });
    queueListContainer.appendChild(ul);
  }
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
  document.getElementById("albumTitle").textContent = song.album.title;
  document.getElementById("qualityLabel").textContent = "CD";

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


function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

document.getElementById("progressContainer").addEventListener("click", (e) => {
  if (audio.duration) {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
  }
});
