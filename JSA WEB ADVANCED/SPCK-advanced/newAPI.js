const API_BASE = "https://tidal.401658.xyz";

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
  ghostClass: "blue-background-class",
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

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && searchInput.value.trim()) {
    searchSongs(searchInput.value.trim());
  }
});

async function searchSongs(query) {
  resultsGrid.innerHTML = `<p class="col-span-full text-gray-400 text-center">searching "${query}"...</p>`;
  try {
    const res = await fetch(`${API_BASE}/search/?s=${query}`);
    const data = await res.json();
    console.log(data);
    displayResults(data.items || []);
  } catch (err) {
    resultsGrid.innerHTML = `<p class="col-span-full text-red-400 text-center">error fetching data</p>`;
  }
}

function displayResults(songs) {
  currentList = songs;
  resultsGrid.innerHTML = "";

  if (!songs.length) {
    resultsGrid.innerHTML = `<p class="col-span-full text-gray-400 text-center">no results found</p>`;
    return;
  }

  songs.forEach((song, i) => {
    const card = document.createElement("div");
    card.className =
      "bg-neutral-900 p-4 rounded-2xl hover:bg-neutral-800 transition cursor-pointer group relative";
    card.innerHTML = `
      <img src="https://resources.tidal.com/images/${song.album.cover
        .split("-")
        .join(
          "/"
        )}/1280x1280.jpg" class="rounded-xl mb-3 w-full aspect-square object-cover">
      <h3 class="text-lg font-semibold truncate">${song.title}</h3>
      <p class="text-gray-400 text-sm truncate">${song.artist.name}</p>
      <button class="add-to-queue-btn absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
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
      '<p class="text-gray-500 text-center">queue is empty</p>';
    return;
  }
  queue.forEach((song, i) => {
    const item = document.createElement("div");
    item.className =
      "flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 group cursor-pointer";
    item.innerHTML = `
      <img src="https://resources.tidal.com/images/${song.album.cover
        .split("-")
        .join("/")}/80x80.jpg" class="w-10 h-10 rounded-md">
      <div class="flex-1">
        <p class="font-semibold text-sm truncate">${song.title}</p>
        <p class="text-xs text-gray-400 truncate">${song.artist.name}</p>
      </div>
      <button class="remove-from-queue-btn text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
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

  // Add the current search list to the queue and start playing the selected song
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
  albumArt.src = `https://resources.tidal.com/images/${song.album.cover
    .split("-")
    .join("/")}/320x320.jpg`;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist.name;

  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸️";

  console.log("currentList[index]", currentList[index]);
  console.log("streamData", streamData);
  console.log("currentList[index].album.cover", currentList[index].album.cover);
}

playBtn.addEventListener("click", () => {
  if (!audio.src) return;
  isPlaying ? audio.pause() : audio.play();
  isPlaying = !isPlaying;
  playBtn.textContent = isPlaying ? "⏸️" : "▶️";
});

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
  queueContainer.classList.toggle("hidden");
  queueContainer.classList.toggle("flex");
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
