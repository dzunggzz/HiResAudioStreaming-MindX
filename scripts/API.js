import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const API_BASES = [
  "https://triton.squid.wtf",
  "https://tidal-api-2.binimum.org"
];

const IMAGE_API_BASE = "https://resources.tidal.com/images/";
const TRACK_INFO_API_BASE = "https://triton.squid.wtf/info";

const searchInput = document.getElementById("searchInput");
const resultsGrid = document.getElementById("resultsGrid");
const audio = document.getElementById("audio");
const queueBtn = document.getElementById("queueBtn");
async function apiFetch(endpoint, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const fullEndpoint = `${endpoint}${queryString ? "?" + queryString : ""}`;

  for (let i = 0; i < API_BASES.length; i++) {
    const base = API_BASES[i];
    console.log(`Trying API ${base}...`);
    const url = `${base}${fullEndpoint}`;
    console.log(`Fetching URL: ${url}`);

    try {
      const response = await fetch(url);
      if (response.ok) {
        if (i > 0) {
          console.log(`API ${base} succeeded after ${i} failures`);
        }
        return response;
      }
    } catch (error) {
      console.log(`API ${base} failed:`, error.message);
    }
  }

  throw new Error("All API bases failed");
}

const albumArt = document.getElementById("albumArt");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const progressBar = document.getElementById("progressBar");
const bufferBar = document.getElementById("bufferBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volumeSlider");
const muteBtn = document.getElementById("muteBtn");
const progressContainer = document.getElementById("progressContainer");

const searchBtn = document.getElementById("searchBtn");
const trackSearchTab = document.getElementById("trackSearchTab");
const artistSearchTab = document.getElementById("artistSearchTab");

const albumSearchTab = document.getElementById("albumSearchTab");
const favoritesTab = document.getElementById("favoritesTab");
const myPlaylistTab = document.getElementById("myPlaylistTab");
const shuffleBtn = document.getElementById("shuffleBtn");
const clearBtn = document.getElementById("clearBtn");
const queueCount = document.getElementById("queueCount");
const queueLength = document.getElementById("queueLength");
const queueListContainer = document.getElementById("queueListContainer");

const equalizerBtn = document.getElementById("equalizerBtn");

const lyricsBtn = document.getElementById("lyricsBtn");

const amLyricsContainer = document.getElementById("amLyricsContainer");
const closeAmLyrics = document.getElementById("closeAmLyrics");
const amLyricsWrapper = document.getElementById("amLyricsWrapper");
let amLyricsElement = null;

const queueModal = document.getElementById("queueModal");
const closeQueueModal = document.getElementById("closeQueueModal");
const equalizerModal = document.getElementById("equalizerModal");
const closeEqualizerModal = document.getElementById("closeEqualizerModal");
const repeatBtn = document.getElementById("repeatBtn");

let currentList = [];
let queue = [];
let currentSong = 0;
let isPlaying = false;
let currentSearchMode = "tracks";

let favorites = [];
let userPlaylists = [];
let currentUser = null;

onAuthStateChanged(window.auth, async (user) => {
  currentUser = user;
  if (user) {
    await loadFavoritesFromFirestore();
    await loadPlaylistsFromFirestore();
  } else {
    favorites = [];
    userPlaylists = [];
  }
});

async function loadFavoritesFromFirestore() {
  if (!currentUser) return;

  try {
    const docRef = doc(window.db, "favorites", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      favorites = docSnap.data().tracks || [];
    } else {
      favorites = [];
    }
  } catch (error) {
    console.error("Error loading favorites:", error);
    favorites = [];
  }
}
let repeatMode = "off";


let currentVolume = parseFloat(localStorage.getItem("tidal_volume") || "0.7");
let isMuted = localStorage.getItem("tidal_muted") === "true";
let previousVolume = parseFloat(localStorage.getItem("tidal_prev_volume") || "0.7");

if (volumeSlider) {
    volumeSlider.value = currentVolume;
    if (isMuted) volumeSlider.value = 0;
}

setTimeout(() => updateVolumeIcon(), 100);


let audioCtx;
let audioSource;
let gainNode;
let weq8;

let liricle;
let currentLyricsLines = [];
let isDragging = false;
let dragProgress = 0;
let wasPlaying = false;
let lyricsRafId = null;
let currentReplayGain = null;

function toggleRepeatMode() {
  if (repeatMode === "off") {
    repeatMode = "one";
  } else if (repeatMode === "one") {
    repeatMode = "all";
  } else {
    repeatMode = "off";
  }
  updateRepeatButton();
}

function updateRepeatButton() {
  const icon = repeatBtn.querySelector("svg") || repeatBtn.querySelector("i");
  if (repeatMode === "one") {
    icon.setAttribute("data-lucide", "repeat-1");
    repeatBtn.classList.add("text-blue-400");
    repeatBtn.classList.remove("text-gray-400");
    repeatBtn.setAttribute("title", "repeat one");
  } else if (repeatMode === "all") {
    icon.setAttribute("data-lucide", "repeat");
    repeatBtn.classList.add("text-blue-400");
    repeatBtn.classList.remove("text-gray-400");
    repeatBtn.setAttribute("title", "repeat all");
  } else {
    icon.setAttribute("data-lucide", "repeat");
    repeatBtn.classList.remove("text-blue-400");
    repeatBtn.classList.add("text-gray-400");
    repeatBtn.setAttribute("title", "repeat off");
  }
  lucide.createIcons();
}

window.updateRepeatButton = updateRepeatButton;

trackSearchTab.addEventListener("click", () => switchSearchMode("tracks"));
artistSearchTab.addEventListener("click", () => switchSearchMode("artists"));
albumSearchTab.addEventListener("click", () => switchSearchMode("albums"));

favoritesTab.addEventListener("click", () => switchSearchMode("favorites"));
myPlaylistTab.addEventListener("click", () => switchSearchMode("myPlaylists"));
repeatBtn.addEventListener("click", () => toggleRepeatMode());

function switchSearchMode(mode) {
  currentSearchMode = mode;

  updateTabStyling();

  resultsGrid.innerHTML = "";
  resultsGrid.className = "grid grid-cols-1 gap-2 pb-32";
  currentList = [];


  if (mode === "favorites") {
    searchInput.style.display = "none";
    displayFavorites();
  } else if (mode === "myPlaylists") {
    searchInput.style.display = "none";
    displayMyPlaylists();
  } else if (mode === "albums") {
    searchInput.style.display = "block";
    searchInput.placeholder = "Search for albums...";
  } else if (mode === "artists") {
    searchInput.style.display = "block";
    searchInput.placeholder = "Search for artists...";
  } else {
    searchInput.style.display = "block";
    searchInput.placeholder = "Search for tracks...";
  }
}

function updateTabStyling() {
  const tabs = [
    { tab: trackSearchTab, mode: "tracks" },
    { tab: artistSearchTab, mode: "artists" },
    { tab: albumSearchTab, mode: "albums" },
    { tab: myPlaylistTab, mode: "myPlaylists" },

    { tab: favoritesTab, mode: "favorites" },
  ];

  tabs.forEach(({ tab, mode }) => {
    if (mode === currentSearchMode) {
      tab.classList.add("border-blue-500", "text-blue-500");
      tab.classList.remove("border-transparent", "text-gray-300");
    } else {
      tab.classList.remove("border-blue-500", "text-blue-500");
      tab.classList.add("border-transparent", "text-gray-300");
    }
  });
}

searchBtn.addEventListener("click", () => {
  if (searchInput.value.trim()) {
    searchSongs(searchInput.value.trim());
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && searchInput.value.trim()) {
    searchSongs(searchInput.value.trim());
  }
});

async function searchSongs(query) {
  resultsGrid.innerHTML = createSkeletonLoaders(6);

  try {
    if (currentSearchMode === "artists") {

    }

    performSearch(searchInput.value.trim());
  } catch (error) {
    console.error("Search error:", error);
    resultsGrid.innerHTML = `<p id="placeholder" style="color: #f87171;">Error fetching data</p>`;
  }
}

async function performSearch(query) {
    if (!query) return;
    
    resultsGrid.innerHTML = createSkeletonLoaders(8);
    
    try {
        if (currentSearchMode === "artists") {
            const data = await apiFetch("/search/", { a: query });
            const result = await data.json();
            const artists = extractArtistData(result);
            displayArtistResults(artists);
        } else if (currentSearchMode === "albums") {
            await loadAlbums(query);
        } else {
            const data = await apiFetch("/search/", { s: query });
            const result = await data.json();
            const tracks = result.data?.items || result.items || [];
            displayResults(tracks);
        }
    } catch(err) {
        console.error(err);
        resultsGrid.innerHTML = `<p id="placeholder" style="color: #f87171;">Error fetching data</p>`;
    }
}

async function loadAlbums(query) {
    try {
        const response = await apiFetch("/search/", { al: query });
        const data = await response.json();
        
        const albums = data.data?.albums?.items || [];
        displayAlbumResults(albums);
    } catch (error) {
        console.error("Error loading albums:", error);
        resultsGrid.innerHTML = '<p class="text-red-500">Error loading albums</p>';
    }
}

function displayAlbumResults(albums) {
    currentList = albums;
    resultsGrid.className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-32";
    resultsGrid.innerHTML = "";

    if (!albums.length) {
        resultsGrid.innerHTML = '<p class="col-span-full text-center text-gray-400">No albums found.</p>';
        return;
    }

    albums.forEach((album, index) => {
        const card = createAlbumCard(album);
        resultsGrid.appendChild(card);
    });
}

function createAlbumCard(album) {
    const card = document.createElement("div");
    card.className = "group relative flex flex-col text-left cursor-pointer";

    let imageUrl = "https://placehold.co/320x320?text=No+Cover";
    if (album.cover) {
         imageUrl = `${IMAGE_API_BASE}${album.cover.split("-").join("/")}/320x320.jpg`;
    }

    const artistName = album.artists && album.artists.length > 0 ? album.artists[0].name : "Unknown Artist";
    const releaseYear = album.releaseDate ? album.releaseDate.split("-")[0] : "";

    card.innerHTML = `
        <div class="relative mb-3 aspect-square w-full overflow-hidden rounded-md bg-gray-800 shadow-lg">
            <img src="${imageUrl}" alt="${album.title}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
             <div class="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20"></div>
             <button class="play-album-btn absolute bottom-2 right-2 flex h-10 w-10 translate-y-4 items-center justify-center rounded-full bg-blue-500 text-white opacity-0 shadow-lg shadow-black/40 transition-all duration-300 hover:scale-105 hover:bg-blue-400 group-hover:translate-y-0 group-hover:opacity-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="fill-current"><polygon points="5,3 19,12 5,21"></polygon></svg>
            </button>
        </div>
        
        <h3 class="truncate text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
            ${album.title}
        </h3>
        <p class="truncate text-sm text-gray-400">${artistName}</p>
        <p class="text-xs text-gray-500 mt-0.5">${releaseYear}</p>
    `;

    card.addEventListener("click", () => {
        showAlbumPage(album);
    });
    
    card.querySelector(".play-album-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        playAlbumContext(album.id);
    });

    return card;
}



function extractArtistData(apiResponse) {
  const artists = [];

  if (!apiResponse) {
    return artists;
  }

  const responseData = apiResponse.data || apiResponse;
  

  if (responseData.artists && Array.isArray(responseData.artists.items)) {
    responseData.artists.items.forEach((artist) => {
      artists.push({
        id: artist.id,
        name: artist.name,
        url: artist.url || `https://tidal.com/artist/${artist.id}`,
        picture: artist.picture,
        artistTypes: artist.artistTypes || ["ARTIST"],
        bio: artist.bio || { text: null, source: null },
      });
    });
  }


  if (responseData.topHits && Array.isArray(responseData.topHits)) {
    responseData.topHits.forEach((hit) => {

      if (hit.value && (hit.type === "ARTISTS" || hit.type === "artist")) {
        const item = hit.value;

        if (!artists.some(a => a.id === item.id)) {
            artists.push({
                id: item.id,
                name: item.name,
                url: item.url || `https://tidal.com/artist/${item.id}`,
                picture: item.picture,
                artistTypes: item.artistTypes || ["ARTIST"],
                bio: item.bio || { text: null, source: null },
            });
        }
      }
    });
  }


  if (artists.length === 0 && responseData.tracks && Array.isArray(responseData.tracks.items)) {
    console.log("No direct artists found, extracting from tracks...");
    const artistMap = new Map();

    responseData.tracks.items.forEach((track) => {
      if (track.artists && Array.isArray(track.artists)) {
        track.artists.forEach((artist) => {
          if (!artistMap.has(artist.id)) {
            artistMap.set(artist.id, {
              id: artist.id,
              name: artist.name,
              url: artist.url || `https://tidal.com/artist/${artist.id}`,
              picture: artist.picture,
              artistTypes: ["ARTIST"],
              bio: { text: null, source: null },
            });
          }
        });
      }
    });

    const extractedArtists = Array.from(artistMap.values());
    artists.push(...extractedArtists);
  }

  return artists;
}

function displayArtistResults(artists) {
  currentList = artists;
  resultsGrid.className = "grid grid-cols-1 sm:grid-cols-2 gap-4";
  resultsGrid.innerHTML = "";

  if (!artists.length) {
    resultsGrid.innerHTML = `<p id="placeholder">No artists found. Try searching for a different artist name.</p>`;
    return;
  }

  artists.forEach((artist, index) => {
    const card = createArtistCard(artist, index);
    resultsGrid.appendChild(card);
  });
}

function createArtistCard(artist, index) {
  const card = document.createElement("div");
  card.className =
    "group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors border border-transparent hover:border-blue-700 hover:bg-gray-800/70";

  const artistImageUrl = artist.picture
    ? `${IMAGE_API_BASE}${artist.picture.split("-").join("/")}/320x320.jpg`
    : "https://placehold.co/64x64";

  card.innerHTML = `
        <img src="${artistImageUrl}" alt="${
    artist.name
  }" class="h-[64px] w-[64px] rounded object-cover">
        <div class="min-w-0 flex-1">
            <h3 class="break-words font-semibold text-white group-hover:text-blue-400 transition-colors">${artist.name}</h3>
            <p class="text-sm text-gray-400">${
              artist.artistTypes?.join(", ") || "Artist"
            }</p>
            <p class="text-xs text-gray-500">Artist Profile</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-400">
            <button class="view-artist-btn rounded-full p-2 text-gray-400 transition-colors hover:text-white" title="view artist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                </svg>
            </button>
        </div>
    `;

  card.querySelector(".view-artist-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    viewArtistProfile(artist);
  });

  card.addEventListener("click", () => viewArtistProfile(artist));

  return card;
}

function viewArtistProfile(artist) {
  showArtistPage(artist.id);
}

function displayResults(songs) {
  currentList = songs;
  currentList = songs;
  resultsGrid.className = "flex flex-col gap-1";
  resultsGrid.innerHTML = "";

  if (!songs.length) {
    resultsGrid.innerHTML = `<p id="placeholder">No tracks found</p>`;
    return;
  }

  songs.forEach((song, index) => {
    const card = createTrackCard(song, index);
    resultsGrid.appendChild(card);
  });
}

function createTrackCard(song, index, list = currentList) {
  const card = document.createElement("div");
  card.className =
    "group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors border border-transparent hover:border-blue-700 hover:bg-gray-800/70";

  const imageUrl = `${IMAGE_API_BASE}${song.album.cover
    .split("-")
    .join("/")}/320x320.jpg`;
  const isFav = isFavorite(song);

  card.innerHTML = `
        <img src="${imageUrl}" alt="${
    song.title
  }" class="h-[64px] w-[64px] rounded object-cover">
        <div class="min-w-0 flex-1">
            <h3 class="break-words font-semibold text-white group-hover:text-blue-400 transition-colors">${song.title}</h3>
            <a class="artist-link break-words text-sm text-gray-400 hover:text-blue-400 hover:underline inline-block">${
              song.artist.name
            }</a>
            <p class="text-xs text-gray-500">
                <a class="album-link hover:text-blue-400 hover:underline cursor-pointer transition-colors">${song.album.title}</a>
                 • CD • 16-bit/44.1 kHz FLAC
            </p>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-400">
            <button class="favorite-btn rounded-full p-2 transition-colors ${
              isFav ? "text-red-400" : "text-gray-400"
            } hover:text-red-400" title="${
    isFav ? "remove from favorites" : "add to favorites"
  }" aria-label="${isFav ? "Remove from favorites" : "Add to favorites"}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${
                  isFav ? "currentColor" : "none"
                }" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </button>
            <button class="add-to-queue-btn rounded-full p-2 text-gray-400 transition-colors hover:text-white" title="add to queue" aria-label="Add to queue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <div class="relative">
                <button class="add-to-playlist-btn rounded-full p-2 text-gray-400 transition-colors hover:text-white" title="add to playlist" aria-label="Add to playlist">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                </button>
                <div class="playlist-dropdown hidden absolute bottom-full right-0 mb-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                    <div class="p-2">
                        <div class="text-xs text-gray-400 px-2 py-1">Add to playlist</div>
                        <div class="max-h-32 overflow-y-auto">
                            ${userPlaylists
                              .map(
                                (playlist, index) => `
                                <button class="w-full text-left px-2 py-1 text-sm text-gray-300 hover:bg-gray-700 rounded" data-playlist-index="${index}">
                                    ${playlist.title}
                                </button>
                            `
                              )
                              .join("")}
                            <button class="w-full text-left px-2 py-1 text-sm text-blue-400 hover:bg-gray-700 rounded" id="createNewPlaylistFromDropdown">
                                + Create new playlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <span>${formatTime(song.duration || 0)}</span>
        </div>
    `;

  card.querySelector(".artist-link").addEventListener("click", (e) => {
    e.stopPropagation();
    if (song.artist && song.artist.id) {
        showArtistPage(song.artist.id);
    }
  });

  card.querySelector(".album-link").addEventListener("click", (e) => {
    e.stopPropagation();
    if (song.album && song.album.id) {
        showAlbumPage({
            id: song.album.id,
            title: song.album.title,
            cover: song.album.cover,
            artists: [song.artist]
        });
    }
  });

  card.querySelector(".favorite-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(song);
    const btn = e.target.closest(".favorite-btn");
    const isNowFav = isFavorite(song);
    btn.classList.toggle("text-red-400", isNowFav);
    btn.classList.toggle("text-gray-400", !isNowFav);
    btn
      .querySelector("svg")
      .setAttribute("fill", isNowFav ? "currentColor" : "none");
    btn.setAttribute(
      "title",
      isNowFav ? "remove from favorites" : "add to favorites"
    );
    btn.setAttribute(
      "aria-label",
      isNowFav ? "Remove from favorites" : "Add to favorites"
    );
  });

  card.querySelector(".add-to-queue-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    addToQueue(song);
  });

  const addToPlaylistBtn = card.querySelector(".add-to-playlist-btn");
  const dropdown = card.querySelector(".playlist-dropdown");

  addToPlaylistBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  });

  dropdown.addEventListener("click", async (e) => {
    if (e.target.matches("[data-playlist-index]")) {
      e.stopPropagation();
      const playlistIndex = parseInt(e.target.dataset.playlistIndex);
      await addTrackToPlaylist(playlistIndex, song);
      dropdown.classList.add("hidden");
    } else if (e.target.id === "createNewPlaylistFromDropdown") {
      e.stopPropagation();
      dropdown.classList.add("hidden");
      showCreatePlaylistModal();
    }
  });

  document.addEventListener("click", () => {
    dropdown.classList.add("hidden");
  });

  card.addEventListener("click", () => playSong(index, list));

  const artistLink = card.querySelector(".artist-link");
  if (artistLink) {
      artistLink.addEventListener("click", (e) => {
          e.stopPropagation();
          showArtistPage(song.artist.id);
      });
  }

  return card;
}

queueBtn.addEventListener("click", () => {
  queueModal.classList.remove("hidden");
  equalizerModal.classList.add("hidden");
});

closeQueueModal.addEventListener("click", () => {
  queueModal.classList.add("hidden");
});

queueModal.addEventListener("click", (e) => {
  if (e.target === queueModal) {
    queueModal.classList.add("hidden");
  }
});

equalizerBtn.addEventListener("click", () => {
  equalizerModal.classList.remove("hidden");
  queueModal.classList.add("hidden");
});

closeEqualizerModal.addEventListener("click", () => {
  equalizerModal.classList.add("hidden");
});

equalizerModal.addEventListener("click", (e) => {
  if (e.target === equalizerModal) {
    equalizerModal.classList.add("hidden");
  }
});

function addToQueue(song) {
  queue.push(song);
  renderQueue();
}

function removeFromQueue(index) {
  queue.splice(index, 1);
  renderQueue();
}

function renderQueue() {
  queueCount.textContent = queue.length;
  queueLength.textContent = queue.length;

  shuffleBtn.disabled = queue.length <= 1;
  shuffleBtn.style.opacity = queue.length <= 1 ? "0.5" : "1";
  clearBtn.disabled = queue.length === 0;
  clearBtn.style.opacity = queue.length === 0 ? "0.5" : "1";

  if (queue.length === 0) {
    queueListContainer.innerHTML =
      '<p class="rounded-lg border border-dashed border-gray-700 bg-gray-900/70 px-3 py-8 text-center text-gray-400">Queue is empty</p>';
    return;
  }

  queueListContainer.innerHTML = "";
  const ul = document.createElement("ul");
  ul.className = "max-h-60 space-y-2 overflow-y-auto pr-1";

  queue.forEach((song, index) => {
    const li = createQueueItem(song, index);
    ul.appendChild(li);
  });

  queueListContainer.appendChild(ul);

  new Sortable(ul, {
    animation: 150,
    ghostClass: "sortable-ghost",
    onEnd: function (evt) {
      const oldIndex = evt.oldIndex;
      const newIndex = evt.newIndex;
      const movedItem = queue.splice(oldIndex, 1)[0];
      queue.splice(newIndex, 0, movedItem);

      if (currentSong === oldIndex) {
        currentSong = newIndex;
      } else if (oldIndex < currentSong && newIndex >= currentSong) {
        currentSong--;
      } else if (oldIndex > currentSong && newIndex <= currentSong) {
        currentSong++;
      }
      renderQueue();
    },
  });
}

function createQueueItem(song, index) {
  const li = document.createElement("li");
  const isCurrentSong = index === currentSong;

  li.innerHTML = `
        <div class="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
          isCurrentSong
            ? "bg-blue-500/10 text-white"
            : "text-gray-200 hover:bg-gray-800/70"
        }">
            <span class="w-6 text-xs font-semibold text-gray-500 group-hover:text-gray-300">${
              index + 1
            }</span>
            <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium">${song.title}</p>
                <a class="truncate text-xs text-gray-400 hover:text-blue-400 hover:underline inline-block">${
                  song.artist.name
                }</a>
            </div>
            <button class="rounded-full p-1 text-gray-500 transition-colors hover:text-red-400" title="remove">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;

  li.querySelector("div").addEventListener("click", () =>
    playSongFromQueue(index)
  );
  li.querySelector("button").addEventListener("click", (e) => {
    e.stopPropagation();
    removeFromQueue(index);
  });

  return li;
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

  try {
    if (isPlaying) {
      await fadeVolume(0, 300);
    }

    currentReplayGain = song.replayGain || null;
    updateEffectiveVolume();


    const quality = "LOSSLESS";
    const streamResponse = await apiFetch("/track/", {
      id: song.id,
      quality: quality,
    });
    const streamData = await streamResponse.json();
    console.log(streamData.data.manifest);
    let audioManifest = streamData.data.manifest;
    let binaryString = atob(audioManifest);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const utf8String = new TextDecoder().decode(bytes);
    const audioObject = JSON.parse(utf8String);

    audio.src = audioObject.urls[0];
    albumArt.src = `${IMAGE_API_BASE}${song.album.cover
      .split("-")
      .join("/")}/320x320.jpg`;
    songTitle.textContent = song.title;
    
    songArtist.textContent = song.artist.name;
    songArtist.onclick = (e) => {
         e.stopPropagation();
         if (song.artist && song.artist.id) {
             showArtistPage(song.artist.id);
         }
    };
    
    const albumTitleEl = document.getElementById("albumTitle");
    albumTitleEl.textContent = song.album.title;
    albumTitleEl.onclick = (e) => {
        e.stopPropagation();
        if (song.album && song.album.id) {
            showAlbumPage({
                id: song.album.id,
                title: song.album.title,
                cover: song.album.cover,
                artists: [song.artist]
            });
        }
    };
    document.getElementById("qualityLabel").textContent = quality;

    if (amLyricsWrapper) {
        amLyricsWrapper.innerHTML = '';
        amLyricsElement = document.createElement('am-lyrics');
        amLyricsElement.className = "w-full h-full text-xs md:text-base";

        amLyricsElement.setAttribute('song-title', song.title);
        amLyricsElement.setAttribute('song-artist', song.artist.name);
        amLyricsElement.setAttribute('song-album', song.album.title);
        amLyricsElement.setAttribute('song-duration', (song.duration || 0) * 1000);
        amLyricsElement.setAttribute('query', `${song.title} ${song.artist.name}`);
        
        if (song.isrc) {
             amLyricsElement.setAttribute('isrc', song.isrc);
        }

        amLyricsElement.setAttribute('autoscroll', '');
        amLyricsElement.setAttribute('interpolate', '');

        amLyricsElement.setAttribute('highlight-color', '#93c5fd');
        amLyricsElement.setAttribute('hover-background-color', 'rgba(59, 130, 246, 0.14)');
        amLyricsElement.setAttribute('font-family', "'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif");

        amLyricsElement.addEventListener('line-click', (e) => {
             const timestampMs = e.detail.timestamp;
             if (timestampMs !== undefined && !isNaN(timestampMs)) {
                  audio.currentTime = timestampMs / 1000;
                  if (audio.paused) {
                      audio.play();
                      isPlaying = true;
                      updatePlayButton(true);
                  }
             }
        });

        amLyricsWrapper.appendChild(amLyricsElement);
    }

    if (!audioCtx) {
      await initWebAudio();
    }

    audio.play();
    isPlaying = true;
    updatePlayButton(isPlaying);
    await fadeVolume(volumeSlider.value, 300);
  } catch (error) {
    console.error("Playback error:", error);
  }
}

async function initWebAudio() {
  try {
    audioCtx = new AudioContext();
    await audioCtx.resume();
    audioSource = audioCtx.createMediaElementSource(audio);
    gainNode = audioCtx.createGain();
    weq8 = new window.WEQ8Runtime(audioCtx);

    audioSource.connect(weq8.input);
    weq8.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.value = volumeSlider.value;
    audio.volume = 1;

    const weq8UI = document.querySelector("weq8-ui");
    if (weq8UI) {
      weq8UI.runtime = weq8;
    }
  } catch (error) {
    console.error("Web Audio initialization error:", error);
  }
}

playBtn.addEventListener("click", async () => {
  if (!audio.src) return;

  if (isPlaying) {
    await fadeVolume(0, 300);
    audio.pause();
    isPlaying = false;
    updatePlayButton(isPlaying);
  } else {
    audio.play();
    isPlaying = true;
    updatePlayButton(isPlaying);
    await fadeVolume(volumeSlider.value, 300);
  }
});

function updatePlayButton(playing) {
  const playIcon = playBtn.querySelector(".play-icon");
  const pauseIcon = playBtn.querySelector(".pause-icon");

  if (playing) {
    playIcon.style.display = "none";
    pauseIcon.style.display = "flex";
  } else {
    playIcon.style.display = "flex";
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

shuffleBtn.addEventListener("click", () => {
  if (queue.length <= 1) return;

  const currentSongItem = queue[currentSong];
  const remainingSongs = queue.filter((_, index) => index !== currentSong);

  for (let i = remainingSongs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remainingSongs[i], remainingSongs[j]] = [
      remainingSongs[j],
      remainingSongs[i],
    ];
  }

  queue = [currentSongItem, ...remainingSongs];
  currentSong = 0;
  renderQueue();
});

clearBtn.addEventListener("click", () => {
  queue = [];
  currentSong = 0;
  isPlaying = false;

  audio.pause();
  audio.src = "";
  albumArt.src = "https://placehold.co/56x56";
  songTitle.textContent = "—";
  songArtist.textContent = "—";
  document.getElementById("albumTitle").textContent = "—";
  document.getElementById("qualityLabel").textContent = "—";

  updatePlayButton(false);
  renderQueue();
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    if (!isDragging) {
      progressBar.style.width = `${
        (audio.currentTime / audio.duration) * 100
      }%`;
    }
    currentTimeEl.textContent = formatTime(audio.currentTime);
    if (amLyricsElement && !lyricsRafId) {
        amLyricsElement.currentTime = audio.currentTime * 1000;
    }
    durationEl.textContent = formatTime(audio.duration);

    liricle.sync(audio.currentTime);
  }
});

audio.addEventListener("progress", () => {
  if (audio.duration && audio.buffered.length > 0) {
    const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
    const duration = audio.duration;
    if (duration > 0) {
        bufferBar.style.width = `${(bufferedEnd / duration) * 100}%`;
    }
  }
});

audio.addEventListener("ended", () => {
  if (repeatMode === "one") {
    audio.currentTime = 0;
    audio.play();
  } else if (repeatMode === "all") {
    nextBtn.click();
  } else {
    if (currentSong < queue.length - 1) {
      nextBtn.click();
    } else {
      isPlaying = false;
      updatePlayButton(false);
    }
  }
});

function updateEffectiveVolume() {
    const baseVolume = parseFloat(volumeSlider.value);
    

    if (baseVolume > 0 && isMuted) {
        isMuted = false;
        localStorage.setItem("tidal_muted", "false");
    }
    
    localStorage.setItem("tidal_volume", baseVolume);
    updateVolumeIcon();

    let finalVol = baseVolume;

    if (currentReplayGain !== null && typeof currentReplayGain === 'number') {
        const gainFactor = Math.pow(10, currentReplayGain / 20);
        finalVol = baseVolume * gainFactor;
    }

    finalVol = Math.max(0, Math.min(1, finalVol));

    if (gainNode) {
        gainNode.gain.value = finalVol;
    } else {
        audio.volume = finalVol;
    }
}

function updateVolumeIcon() {
    if (!muteBtn) return;
    const icon = muteBtn.querySelector("i") || muteBtn.querySelector("svg");
    if (!icon) return;

    const vol = parseFloat(volumeSlider.value);
    
    let iconName = "volume-2";
    if (isMuted || vol === 0) {
        iconName = "volume-x";
    } else if (vol < 0.5) {
        iconName = "volume-1";
    }
    

    if (icon.getAttribute("data-lucide") !== iconName) {
        icon.setAttribute("data-lucide", iconName);
        lucide.createIcons();
    }
}

async function toggleMute() {
    if (isMuted) {

        isMuted = false;
        localStorage.setItem("tidal_muted", "false");
        
        let restoreVol = previousVolume;
        if (restoreVol === 0) restoreVol = 0.7;
        volumeSlider.value = restoreVol;
        updateVolumeIcon();


        let targetVol = restoreVol;
        if (currentReplayGain !== null && typeof currentReplayGain === 'number') {
            const gainFactor = Math.pow(10, currentReplayGain / 20);
            targetVol = restoreVol * gainFactor;
        }
        targetVol = Math.max(0, Math.min(1, targetVol));

        if (gainNode) {
            await fadeVolume(targetVol, 200);
        } else {
            audio.volume = targetVol;
        }

    } else {

        isMuted = true;
        localStorage.setItem("tidal_muted", "true");
        
        const current = parseFloat(volumeSlider.value);
        if (current > 0) {
            previousVolume = current;
            localStorage.setItem("tidal_prev_volume", previousVolume);
        }
        volumeSlider.value = 0;
        updateVolumeIcon();

        if (gainNode) {
            await fadeVolume(0, 200);
        } else {
            audio.volume = 0;
        }
    }

    localStorage.setItem("tidal_volume", volumeSlider.value);
}

volumeSlider.addEventListener("input", (e) => {
    updateEffectiveVolume();
});

muteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMute();
});


function updateProgress(e) {
  if (!audio.duration) return;

  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const duration = audio.duration;
  const newTime = (clickX / width) * duration;

  if (isDragging) {
    dragProgress = newTime;
    progressBar.style.width = `${(newTime / duration) * 100}%`;
  } else {
    audio.currentTime = newTime;
  }
}

progressContainer.addEventListener("mousedown", async (e) => {
  wasPlaying = isPlaying;
  if (isPlaying) {
    await fadeVolume(0, 100);
  }
  isDragging = true;
  updateProgress(e);
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    updateProgress(e);
  }
});

document.addEventListener("mouseup", async () => {
  if (isDragging) {
    audio.currentTime = dragProgress;
    if (wasPlaying) {
      await fadeVolume(volumeSlider.value, 100);
    }
    isDragging = false;
  }
});

function displayFavorites() {
  currentList = favorites;
  resultsGrid.className = "flex flex-col gap-1";
  resultsGrid.innerHTML = "";

  const header = document.createElement("div");
  header.className =
    "mb-6 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg border border-red-500/20";

  header.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <h3 class="text-lg font-semibold text-white mb-1">Favorites</h3>
                <p class="text-sm text-gray-400">${favorites.length} favorite track(s)</p>
            </div>
            <div class="text-right">
                <span class="text-xs text-gray-500">Your liked songs</span>
            </div>
        </div>
    `;

  resultsGrid.appendChild(header);

  if (!favorites.length) {
    resultsGrid.innerHTML += `<p id="placeholder">No favorites yet. Heart some tracks to see them here!</p>`;
    return;
  }

  favorites.forEach((track, index) => {
    const card = createTrackCard(track, index);
    resultsGrid.appendChild(card);
  });
}

async function loadPlaylistsFromFirestore() {
  if (!currentUser) return;

  try {
    const docRef = doc(window.db, "playlists", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      userPlaylists = docSnap.data().playlists || [];
    } else {
      userPlaylists = [];
    }
  } catch (error) {
    console.error("Error loading playlists:", error);
    userPlaylists = [];
  }
}

function displayMyPlaylists() {
  currentList = userPlaylists;
  resultsGrid.className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-32";
  resultsGrid.innerHTML = "";
  const header = document.createElement("div");
  header.className = "col-span-full mb-4 flex items-center justify-between";
  header.innerHTML = `
      <div>
          <h2 class="text-2xl font-bold text-white">My Playlists</h2>
          <p class="text-sm text-gray-400">${userPlaylists.length} playlists</p>
      </div>
  `;
  resultsGrid.appendChild(header);
  if (!userPlaylists.length) {
     resultsGrid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center p-12 text-center bg-gray-900/40 rounded-2xl border border-gray-800">
            <div class="mb-6 rounded-full bg-gray-800/50 p-6">
                <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">No playlists yet</h3>
            <p class="text-gray-400 mb-6 max-w-md">Create your first playlist to start organizing your favorite tracks into your own personal collection.</p>
            <button onclick="showCreatePlaylistModal()" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-900/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create Playlist
            </button>
        </div>
    `;
    return;
  }

  resultsGrid.appendChild(createNewPlaylistCard());

  userPlaylists.forEach((playlist, index) => {
    const card = createPlaylistCard(playlist, index);
    resultsGrid.appendChild(card);
  });
}

function createPlaylistCard(playlist, index) {
  const card = document.createElement("div");
  card.className =
    "group relative flex flex-col text-left cursor-pointer";
  let imageUrl = "https://placehold.co/320x320/1f2937/ffffff?text=Playlist";
  if (playlist.image) {
      imageUrl = `${IMAGE_API_BASE}${playlist.image.split("-").join("/")}/320x320.jpg`;
  } else if (playlist.tracks && playlist.tracks.length > 0 && playlist.tracks[0].album && playlist.tracks[0].album.cover) {
       imageUrl = `${IMAGE_API_BASE}${playlist.tracks[0].album.cover.split("-").join("/")}/320x320.jpg`;
  } else if (playlist.squareImage) {
      imageUrl = `${IMAGE_API_BASE}${playlist.squareImage.split("-").join("/")}/320x320.jpg`;
  }

  card.innerHTML = `
        <div class="relative mb-3 aspect-square w-full overflow-hidden rounded-md bg-gray-800 shadow-lg">
            <img src="${imageUrl}" alt="${playlist.title}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
            

            <button class="play-playlist-btn absolute bottom-2 right-2 flex h-10 w-10 translate-y-4 items-center justify-center rounded-full bg-blue-500 text-white opacity-0 shadow-lg shadow-black/40 transition-all duration-300 hover:scale-105 hover:bg-blue-400 group-hover:translate-y-0 group-hover:opacity-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="fill-current"><polygon points="5,3 19,12 5,21"></polygon></svg>
            </button>
        </div>
        
        <h3 class="truncate text-base font-semibold text-white group-hover:text-blue-400 transition-colors">${playlist.title}</h3>
        <p class="truncate text-sm text-gray-400">${playlist.tracks.length} tracks</p>
    `;

  card.addEventListener("click", () => {
    showPlaylistPage(playlist, index);
  });

  card.querySelector(".play-playlist-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    playPlaylist(index);
  });

  return card;
}

function createNewPlaylistCard() {
    const card = document.createElement("div");
    card.className = "group flex flex-col text-left cursor-pointer";
    
    card.innerHTML = `
        <div class="relative mb-3 aspect-square w-full flex items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-700 bg-gray-800/30 transition-colors group-hover:border-blue-500/50 group-hover:bg-gray-800/50">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
        </div>
        <h3 class="truncate text-base font-semibold text-gray-300 group-hover:text-white transition-colors">Create New</h3>
        <p class="truncate text-sm text-gray-500">Add a playback list</p>
    `;

    card.addEventListener("click", () => {
        showCreatePlaylistModal();
    });

    return card;
}

const closeAlbumPageBtn = document.getElementById("closeAlbumPageBtn");

if (closeAlbumPageBtn) {
    closeAlbumPageBtn.addEventListener("click", closeAlbumPage);
}

function closeAlbumPage() {
    const page = document.getElementById("albumPage");
    page.classList.add("hidden");
    document.querySelector("main").classList.remove("hidden");
}

async function showAlbumPage(album) {
    const page = document.getElementById("albumPage");
    const mainContent = document.querySelector("main");

    document.getElementById("albumPageTitle").textContent = album.title;
    document.getElementById("albumPageArtist").textContent = album.artists ? album.artists[0]?.name : "Unknown Artist";
    document.getElementById("albumPageYear").textContent = album.releaseDate ? album.releaseDate.split("-")[0] : "";
    document.getElementById("albumPageCount").textContent = "Loading...";
    document.getElementById("albumPageDuration").textContent = "...";
    document.getElementById("albumTracksGrid").innerHTML = '<p class="text-gray-500 text-center py-8">Loading tracks...</p>';

    let imageUrl = "https://placehold.co/320x320?text=No+Cover";
    if (album.cover) {
         imageUrl = `${IMAGE_API_BASE}${album.cover.split("-").join("/")}/320x320.jpg`;
    }
    document.getElementById("albumPageImage").src = imageUrl;
    
    page.classList.remove("hidden");
    mainContent.classList.add("hidden");

    await loadAlbumDetails(album.id);
}

async function loadAlbumDetails(albumId) {
    try {
        const response = await apiFetch("/album/", { id: albumId });
        const data = await response.json();
        
        const items = data.data?.items || data.items || [];
        const tracks = items.map(i => i.item).filter(t => t);
        
        displayAlbumTracks(tracks);
    } catch (error) {
        console.error("Error loading album details:", error);
        document.getElementById("albumTracksGrid").innerHTML = '<p class="text-red-500 text-center py-8">Failed to load tracks.</p>';
    }
}

function displayAlbumTracks(tracks) {
    const grid = document.getElementById("albumTracksGrid");
    grid.innerHTML = "";
    
    if (!tracks.length) {
        grid.innerHTML = '<p class="text-gray-500 text-center py-8">No tracks found.</p>';
        return;
    }

    document.getElementById("albumPageCount").textContent = `${tracks.length} tracks`;
    const totalDuration = tracks.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    document.getElementById("albumPageDuration").textContent = formatTime(totalDuration); 

    tracks.forEach((track, index) => {
        const card = createTrackCard(track); 
        card.onclick = (e) => {
             e.stopPropagation();
             playSong(index, tracks);
        };
        grid.appendChild(card);
    });

    const playBtn = document.getElementById("playAlbumPageBtn");
    const shuffleBtn = document.getElementById("shuffleAlbumPageBtn");

    const newPlayBtn = playBtn.cloneNode(true);
    playBtn.parentNode.replaceChild(newPlayBtn, playBtn);
    
    const newShuffleBtn = shuffleBtn.cloneNode(true);
    shuffleBtn.parentNode.replaceChild(newShuffleBtn, shuffleBtn);

    newPlayBtn.addEventListener("click", () => {
        if (tracks.length > 0) {
            playSong(0, tracks);
        }
    });

    newShuffleBtn.addEventListener("click", () => {
         if (tracks.length > 0) {
            const randIndex = Math.floor(Math.random() * tracks.length);
            playSong(randIndex, tracks);
        }
    });
}

async function playAlbumContext(albumId) {
     try {
         const response = await apiFetch("/album/", { id: albumId });
         const data = await response.json();
         const items = data.data?.items || data.items || [];
         const tracks = items.map(i => i.item).filter(t => t);
         if (tracks.length > 0) {
             playSong(0, tracks);
         }
     } catch (e) {
         console.error("Error playing album context", e);
     }
}



let currentPlaylistIndex = null;

function showPlaylistPage(playlist, index) {
    currentPlaylistIndex = index;
    const page = document.getElementById("playlistPage");
    const mainContent = document.querySelector("main"); 

    document.getElementById("playlistPageTitle").textContent = playlist.title;
    document.getElementById("playlistPageCount").textContent = `${playlist.tracks.length} tracks`;

    let imageUrl = "https://placehold.co/320x320/1f2937/ffffff?text=Playlist";
    if (playlist.image) {
        imageUrl = `${IMAGE_API_BASE}${playlist.image.split("-").join("/")}/320x320.jpg`;
    } else if (playlist.tracks && playlist.tracks.length > 0 && playlist.tracks[0].album && playlist.tracks[0].album.cover) {
         imageUrl = `${IMAGE_API_BASE}${playlist.tracks[0].album.cover.split("-").join("/")}/320x320.jpg`;
    }
    document.getElementById("playlistPageImage").src = imageUrl;

    const grid = document.getElementById("playlistTracksGrid");
    grid.innerHTML = "";
    
    if (playlist.tracks && playlist.tracks.length > 0) {
        playlist.tracks.forEach((track, trackIndex) => {

            const card = createTrackCard(track); 
             card.addEventListener("click", (e) => {
                e.stopPropagation(); 
                playSong(trackIndex, playlist.tracks);
            });
            const actionsDiv = card.querySelector('.flex.items-center.gap-2.text-sm.text-gray-400');
            if (actionsDiv) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = "rounded-full p-2 text-gray-400 transition-colors hover:text-red-400";
                deleteBtn.title = "remove from playlist";
                deleteBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                `;
                deleteBtn.onclick = async (e) => {
                    e.stopPropagation();
                    if (confirm(`Remove "${track.title}" from this playlist?`)) {
                        await deleteTrackFromPlaylist(index, trackIndex);
                    }
                };
                actionsDiv.insertBefore(deleteBtn, actionsDiv.lastElementChild);
            }
            
            grid.appendChild(card);
        });
    } else {
        grid.innerHTML = `<p class="text-gray-400 text-center py-8">No tracks in this playlist yet.</p>`;
    }

    const deleteBtn = document.getElementById("deletePlaylistPageBtn");

    const newDeleteBtn = deleteBtn.cloneNode(true);
    deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);
    
    newDeleteBtn.addEventListener("click", () => {
        if(confirm(`Are you sure you want to delete "${playlist.title}"?`)) {
            deletePlaylist(index);
            closePlaylistPage();
        }
    });

    const playBtn = document.getElementById("playPlaylistPageBtn");
    const newPlayBtn = playBtn.cloneNode(true);
    playBtn.parentNode.replaceChild(newPlayBtn, playBtn);

    newPlayBtn.addEventListener("click", () => {
        if (playlist.tracks.length > 0) {
            playPlaylist(index);
        }
    });

    if(document.getElementById("artistPage")) document.getElementById("artistPage").classList.add("hidden");
    page.classList.remove("hidden");
}

function closePlaylistPage() {
    document.getElementById("playlistPage").classList.add("hidden");

}

document.getElementById("closePlaylistPageBtn").addEventListener("click", closePlaylistPage);


const artistPage = document.getElementById("artistPage");
const closeArtistPageBtn = document.getElementById("closeArtistPageBtn");
const artistPageImage = document.getElementById("artistPageImage");
const artistPageName = document.getElementById("artistPageName");
const artistPageRoles = document.getElementById("artistPageRoles");
const artistTopTracksGrid = document.getElementById("artistTopTracksGrid");

let currentArtistId = null;

async function showArtistPage(artistId) {
    currentArtistId = artistId;
    artistPage.classList.remove("hidden");
    document.body.style.overflow = "hidden"; 
    document.documentElement.style.overflow = "hidden"; 

    artistPageName.textContent = "Loading...";
    artistPageImage.src = "https://placehold.co/320x320?text=Loading";
    artistPageRoles.innerHTML = "";
    artistTopTracksGrid.innerHTML = '<div class="col-span-full text-center text-gray-400 py-12">Loading tracks...</div>';

    try {
        const artistData = await loadArtist(artistId);
        renderArtistPage(artistData);
    } catch (error) {
        console.error("Failed to load artist:", error);
        artistPageName.textContent = "Error loading artist";
        artistTopTracksGrid.innerHTML = `<div class="col-span-full text-center text-red-400 py-12">${error.message}</div>`;
    }
}

function closeArtistPage() {
    artistPage.classList.add("hidden");
    document.body.style.overflow = ""; 
    document.documentElement.style.overflow = ""; 
    currentArtistId = null;
}

closeArtistPageBtn.addEventListener("click", closeArtistPage);

async function loadArtist(id) {

    const response = await apiFetch("/artist/", { f: id });
    if (!response.ok) throw new Error("Failed to fetch artist data");
    
    const data = await response.json();

    let artist = null;
    let albums = [];
    let tracks = [];

    const visited = new Set();
    const scan = (obj) => {
        if (!obj || typeof obj !== 'object' || visited.has(obj)) return;
        visited.add(obj);

        if (obj.id == id && obj.name && (obj.type === 'ARTIST' || obj.type === 'MAIN')) {
            if (!artist || (obj.popularity > (artist.popularity || 0))) {
                artist = obj;
            }
        }

        if (obj.type === 'TRACK' || (obj.audioQuality && obj.title)) {
             if (!tracks.some(t => t.id === obj.id)) {
                 tracks.push(obj);
             }
        }

        Object.values(obj).forEach(scan);
    };

    scan(data);

    if (!artist && Array.isArray(data) && data[0]) artist = data[0]; 
    if(!artist) throw new Error("Artist not found in response");

    tracks.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    return {
        ...artist,
        topTracks: tracks.slice(0, 30)
    };
}

function renderArtistPage(artist) {
    console.log(artist)
    artistPageName.textContent = artist.name;
    if (artist.picture) {
        artistPageImage.src = `${IMAGE_API_BASE}${artist.picture.split("-")
    .join("/")}/750x750.jpg`;
    } else {
         artistPageImage.src = "https://placehold.co/320x320?text=No+Image";
    }

    artistPageRoles.innerHTML = "";
    if (artist.artistTypes) {
        artist.artistTypes.forEach(type => {
             const badge = document.createElement("span");
             badge.className = "px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wide border border-blue-500/30";
             badge.textContent = type;
             artistPageRoles.appendChild(badge);
        });
    }

    artistTopTracksGrid.innerHTML = "";
    if (artist.topTracks.length === 0) {
        artistTopTracksGrid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No top tracks available.</div>';
    } else {
        artist.topTracks.forEach((track, index) => {
             if (!track.artist) track.artist = { id: artist.id, name: artist.name };
             const card = createTrackCard(track, index, artist.topTracks);
             artistTopTracksGrid.appendChild(card);
        });
    }
}

window.showArtistPage = showArtistPage;

function playPlaylist(index) {
  const playlist = userPlaylists[index];
  if (!playlist || !playlist.tracks.length) return;

  queue = [...playlist.tracks];
  currentSong = 0;
  playSongFromQueue(currentSong, true);
  renderQueue();
}

async function deletePlaylist(index) {
  if (!currentUser) return;

  const playlist = userPlaylists[index];
  try {
    const docRef = doc(window.db, "playlists", currentUser.uid);
    await updateDoc(docRef, {
      playlists: arrayRemove(playlist),
    });

    userPlaylists.splice(index, 1);
    displayMyPlaylists();
  } catch (error) {
    console.error("Error deleting playlist:", error);
  }
}

function showPlaylistDetails(playlist) {
  const trackList = playlist.tracks
    .map(
      (track, index) => `${index + 1}. ${track.title} - ${track.artist.name}`
    )
    .join("\n");

  alert(`Playlist: ${playlist.title}\n\nTracks:\n${trackList}`);
}

window.showCreatePlaylistModal = showCreatePlaylistModal;

function showCreatePlaylistModal() {
  const modalHTML = `
    <div id="createPlaylistModal" class="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div class="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4">
        <div class="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 class="text-lg font-semibold text-white">Create New Playlist</h3>
          <button id="closeCreateModal" class="text-gray-400 hover:text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="p-4">
          <form id="createPlaylistForm">
            <div class="mb-4">
              <label for="playlistTitle" class="block text-sm font-medium text-gray-300 mb-2">Playlist Name</label>
              <input type="text" id="playlistTitle" name="title" required 
                     class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Enter playlist name">
            </div>
            <div class="mb-6">
              <label for="playlistDescription" class="block text-sm font-medium text-gray-300 mb-2">Description (optional)</label>
              <textarea id="playlistDescription" name="description" rows="3"
                        class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter playlist description"></textarea>
            </div>
            <div class="flex justify-end gap-3">
              <button type="button" id="cancelCreateBtn" class="px-4 py-2 text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">Create Playlist</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("createPlaylistModal");
  const form = document.getElementById("createPlaylistForm");
  const closeBtn = document.getElementById("closeCreateModal");
  const cancelBtn = document.getElementById("cancelCreateBtn");

  closeBtn.addEventListener("click", () => modal.remove());
  cancelBtn.addEventListener("click", () => modal.remove());

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("playlistTitle").value.trim();
    const description = document
      .getElementById("playlistDescription")
      .value.trim();

    if (title) {
      await createPlaylist(title, description);
      modal.remove();
    }
  });

  document.getElementById("playlistTitle").focus();
}

async function createPlaylist(title, description = "") {
  if (!currentUser) return;

  const newPlaylist = {
    uuid: `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: title,
    description: description,
    numberOfTracks: 0,
    duration: 0,
    creator: {
      id: currentUser.uid,
      name: currentUser.displayName || currentUser.email,
    },
    created: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    type: "USER",
    publicPlaylist: false,
    tracks: [],
    image: null,
    squareImage: null,
  };

  try {
    const docRef = doc(window.db, "playlists", currentUser.uid);
    await setDoc(
      docRef,
      {
        playlists: arrayUnion(newPlaylist),
      },
      { merge: true }
    );

    userPlaylists.push(newPlaylist);
    displayMyPlaylists();
  } catch (error) {
    console.error("Error creating playlist:", error);
  }
}

async function addTrackToPlaylist(playlistIndex, track) {
  if (
    !currentUser ||
    playlistIndex < 0 ||
    playlistIndex >= userPlaylists.length
  )
    return;

  const playlist = userPlaylists[playlistIndex];

  if (playlist.tracks.some((t) => t.id === track.id)) {
    alert("This track is already in the playlist!");
    return;
  }

  const updatedPlaylist = {
    ...playlist,
    tracks: [...playlist.tracks, track],
    numberOfTracks: playlist.tracks.length + 1,
    duration:
      playlist.tracks.reduce((sum, t) => sum + (t.duration || 0), 0) +
      (track.duration || 0),
    lastUpdated: new Date().toISOString(),
  };

  try {
    const docRef = doc(window.db, "playlists", currentUser.uid);
    await updateDoc(docRef, {
      playlists: arrayRemove(playlist),
    });
    await updateDoc(docRef, {
      playlists: arrayUnion(updatedPlaylist),
    });

    userPlaylists[playlistIndex] = updatedPlaylist;

    console.log(`Added "${track.title}" to "${playlist.title}"`);
  } catch (error) {
    console.error("Error adding track to playlist:", error);
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

function isFavorite(track) {
  return favorites.some((fav) => fav.id === track.id);
}

async function toggleFavorite(track) {
  if (!currentUser) return;

  const index = favorites.findIndex((fav) => fav.id === track.id);
  const docRef = doc(window.db, "favorites", currentUser.uid);

  try {
    if (index > -1) {
      favorites.splice(index, 1);
      await updateDoc(docRef, {
        tracks: arrayRemove(track),
      });
    } else {
      favorites.push(track);
      await setDoc(
        docRef,
        {
          tracks: arrayUnion(track),
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.error("Error updating favorites:", error);
  }
}

async function fetchLyrics(trackId) {
  try {
    const trackInfoResponse = await fetch(
      `${TRACK_INFO_API_BASE}/?id=${trackId}`
    );
    const trackInfo = await trackInfoResponse.json();

    const title = trackInfo.data.title;
    const artist = trackInfo.data.artist.name;
    const album = trackInfo.data.album.title;
    const duration = trackInfo.data.duration;

    const lyricsUrl = `https://lyricsplus.prjktla.workers.dev/v2/lyrics/get?title=${encodeURIComponent(
      title
    )}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(
      album
    )}&duration=${duration}&source=apple,lyricsplus,musixmatch,spotify,musixmatch-word`;
    const lyricsResponse = await fetch(lyricsUrl);
    const lyricsData = await lyricsResponse.json();

    if (lyricsData.error) {
      console.error("Lyrics not found:", lyricsData.error.message);
      return null;
    }

    if (lyricsData.lyrics && Array.isArray(lyricsData.lyrics)) {
      const lrcLines = lyricsData.lyrics.map((line) => {
        const minutes = Math.floor(line.time / 60000);
        const seconds = Math.floor((line.time % 60000) / 1000);
        const centiseconds = Math.floor((line.time % 1000) / 10);
        const timestamp = `[${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}]`;
        return `${timestamp}${line.text}`;
      });
      return lrcLines.join("\n");
    }
    return null;
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return null;
  }
}

function fadeVolume(targetVolume, duration = 300) {
  return new Promise((resolve) => {
    if (!gainNode) {
      resolve();
      return;
    }
    const startVolume = gainNode.gain.value;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      gainNode.gain.value =
        startVolume + (targetVolume - startVolume) * progress;
      if (progress < 1) requestAnimationFrame(animate);
      else resolve();
    };
    animate();
  });
}

function createSkeletonLoaders(count) {
  let html = "";
  for (let i = 0; i < count; i++) {
    html += `
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton-text">
                    <div class="skeleton skeleton-line long"></div>
                    <div class="skeleton skeleton-line short"></div>
                </div>
            </div>
        `;
  }
  return html;
}


function startLyricsSync() {
    if (lyricsRafId) cancelAnimationFrame(lyricsRafId);
    
    function sync() {
        if (amLyricsElement && !audio.paused) {
            amLyricsElement.currentTime = audio.currentTime * 1000;
            lyricsRafId = requestAnimationFrame(sync);
        } else {
            lyricsRafId = null;
        }
    }
    
    lyricsRafId = requestAnimationFrame(sync);
}

function stopLyricsSync() {
    if (lyricsRafId) {
        cancelAnimationFrame(lyricsRafId);
        lyricsRafId = null;
    }
}

lyricsBtn.addEventListener("click", () => {
  amLyricsContainer.classList.remove("hidden");
    if (!audio.paused) {
        startLyricsSync();
    }
});

closeAmLyrics.addEventListener("click", () => {
  amLyricsContainer.classList.add("hidden");
  stopLyricsSync();
});

amLyricsContainer.addEventListener("click", (e) => {
  if (e.target === amLyricsContainer) {
    amLyricsContainer.classList.add("hidden");
    stopLyricsSync();
  }
});

audio.addEventListener('play', () => {
    if (!amLyricsContainer.classList.contains('hidden')) {
        startLyricsSync();
    }
});

audio.addEventListener('pause', () => {
    stopLyricsSync();
});

async function deleteTrackFromPlaylist(playlistIndex, trackIndex) {
    if (
        !currentUser ||
        playlistIndex < 0 ||
        playlistIndex >= userPlaylists.length
    )
        return;

    const playlist = userPlaylists[playlistIndex];
    if (!playlist || !playlist.tracks) return;
    
    const trackToRemove = playlist.tracks[trackIndex];

    const updatedTracks = [...playlist.tracks];
    updatedTracks.splice(trackIndex, 1);

    const updatedPlaylist = {
        ...playlist,
        tracks: updatedTracks,
        numberOfTracks: updatedTracks.length,
        duration: Math.max(0, (playlist.duration || 0) - (trackToRemove.duration || 0)),
        lastUpdated: new Date().toISOString(),
    };

    try {
        const docRef = doc(window.db, "playlists", currentUser.uid);
        
        await updateDoc(docRef, {
            playlists: arrayRemove(playlist),
        });

        await updateDoc(docRef, {
            playlists: arrayUnion(updatedPlaylist),
        });

        userPlaylists[playlistIndex] = updatedPlaylist;

        if (typeof currentPlaylistIndex !== 'undefined' && currentPlaylistIndex === playlistIndex) {
            showPlaylistPage(updatedPlaylist, playlistIndex);
        }

        if (typeof currentSearchMode !== 'undefined' && currentSearchMode === "myPlaylists") {
            displayMyPlaylists();
        }

        console.log(`Removed "${trackToRemove.title}" from "${playlist.title}"`);
    } catch (error) {
        console.error("Error removing track from playlist:", error);
        alert("Failed to remove track due to an error.");
    }
}
