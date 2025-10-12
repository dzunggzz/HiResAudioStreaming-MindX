const API_BASE = "https://tidal.401658.xyz";

const searchInput = document.getElementById("searchInput");
const resultsGrid = document.getElementById("resultsGrid");
const placeholder = document.getElementById("placeholder");
const audio = document.getElementById("audio");

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
let currentSong = 0;
let isPlaying = false;

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
      "bg-neutral-900 p-4 rounded-2xl hover:bg-neutral-800 transition cursor-pointer";
    card.innerHTML = `
          <img src="https://resources.tidal.com/images/${song.album.cover.split("-").join("/")}/1280x1280.jpg" class="rounded-xl mb-3 w-full aspect-square object-cover">
          <h3 class="text-lg font-semibold truncate">${song.title}</h3>
          <p class="text-gray-400 text-sm truncate">${song.artist.name}</p>
        `;
    card.addEventListener("click", () => playSong(i));
    resultsGrid.appendChild(card);
  });
}

async function playSong(index) {
  const song = currentList[index];
  if (!song) return;

  currentSong = index;
  const streamRes = await fetch(
    `${API_BASE}/track/?id=${song.id}&quality=LOSSLESS`
  );
  const streamData = await streamRes.json();

  audio.src = streamData[2].OriginalTrackUrl;
  albumArt.src = `https://resources.tidal.com/images/${song.album.cover.split("-").join("/")}/320x320.jpg`;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist.name;

  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸️";

  console.log('currentList[index]', currentList[index])
  console.log('streamData', streamData)
  console.log('currentList[index].album.cover', currentList[index].album.cover)
}

playBtn.addEventListener("click", () => {
  if (!audio.src) return;
  isPlaying ? audio.pause() : audio.play();
  isPlaying = !isPlaying;
  playBtn.textContent = isPlaying ? "⏸️" : "▶️";
});

nextBtn.addEventListener("click", () => {
  if (currentList.length) playSong((currentSong + 1) % currentList.length);
});

prevBtn.addEventListener("click", () => {
  if (currentList.length)
    playSong((currentSong - 1 + currentList.length) % currentList.length);
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
