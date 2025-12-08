import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const API_BASES = [
  // "https://vogel.qqdl.site",
  "https://tidal-api-2.binimum.org",
  "https://triton.squid.wtf",
];
const IMAGE_API_BASE = "https://resources.tidal.com/images/";
const TRACK_INFO_API_BASE = "https://triton.squid.wtf/info";
const TOP_TRACKS_API =
  "https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=0ad369170a5a3d839efe249ca049ecc9&format=json";
const searchInput = document.getElementById("searchInput");
const resultsGrid = document.getElementById("resultsGrid");
const audio = document.getElementById("audio");
const queueBtn = document.getElementById("queueBtn");
const random404Images = [
  "./assets/404-1.png",
  "./assets/404-2.png",
  "./assets/404-3.png",
  "./assets/404-4.png",
  "./assets/404-5.jpg",
  "./assets/404-6.jpg",
  "./assets/404-7.jpg",
  "./assets/404-8.jpg",
];
const random404Image =
  random404Images[Math.floor(Math.random() * random404Images.length)];
async function apiFetch(endpoint, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const fullEndpoint = `${endpoint}${queryString ? "?" + queryString : ""}`;

  for (let i = 0; i < API_BASES.length; i++) {
    const base = API_BASES[i];
    const url = `${base}${fullEndpoint}`;

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
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volumeSlider");
const progressContainer = document.getElementById("progressContainer");

const searchBtn = document.getElementById("searchBtn");
const trackSearchTab = document.getElementById("trackSearchTab");
const artistSearchTab = document.getElementById("artistSearchTab");
const topTracksTab = document.getElementById("topTracksTab");
const favoritesTab = document.getElementById("favoritesTab");
const topTracksBadge = document.getElementById("topTracksBadge");
const shuffleBtn = document.getElementById("shuffleBtn");
const clearBtn = document.getElementById("clearBtn");
const queueCount = document.getElementById("queueCount");
const queueLength = document.getElementById("queueLength");
const queueListContainer = document.getElementById("queueListContainer");

const equalizerBtn = document.getElementById("equalizerBtn");

const lyricsBtn = document.getElementById("lyricsBtn");
const lyricsModal = document.getElementById("lyricsModal");
const closeLyricsModal = document.getElementById("closeLyricsModal");
const lyricsContainer = document.getElementById("lyricsContainer");

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
let topTracksData = null;
let topTracksLastUpdated = null;
let favorites = [];
let currentUser = null;

onAuthStateChanged(window.auth, async (user) => {
  currentUser = user;
  if (user) {
    await loadFavoritesFromFirestore();
  } else {
    favorites = [];
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
let repeatMode = "off"; // 'off', 'one', 'all'

let audioCtx;
let audioSource;
let gainNode;
let weq8;

let liricle;
let currentLyricsLines = [];
let isDragging = false;
let dragProgress = 0;
let wasPlaying = false;

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
topTracksTab.addEventListener("click", () => switchSearchMode("topTracks"));
favoritesTab.addEventListener("click", () => switchSearchMode("favorites"));
repeatBtn.addEventListener("click", () => toggleRepeatMode());

function switchSearchMode(mode) {
  currentSearchMode = mode;

  updateTabStyling();

  resultsGrid.innerHTML = "";
  currentList = [];

  if (mode === "topTracks") {
    searchInput.style.display = "none";
    loadTopTracks();
  } else if (mode === "favorites") {
    searchInput.style.display = "none";
    displayFavorites();
  } else {
    searchInput.style.display = "block";
    searchInput.placeholder =
      mode === "tracks" ? "Search for tracks..." : "Search for artists...";
  }
}

function updateTabStyling() {
  const tabs = [
    { tab: trackSearchTab, mode: "tracks" },
    { tab: artistSearchTab, mode: "artists" },
    { tab: topTracksTab, mode: "topTracks" },
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

async function loadTopTracks() {
  resultsGrid.innerHTML = createSkeletonLoaders(8);

  try {
    if (topTracksData && topTracksLastUpdated && isDataStillValid()) {
      console.log("Using cached top tracks data");
      displayTopTracks(topTracksData);
      return;
    }

    console.log("Fetching fresh top tracks data");
    const topTracksResponse = await fetch(TOP_TRACKS_API);
    const topTracksDatas = await topTracksResponse.json();

    const trackPromises = topTracksDatas.tracks.track.map((track) =>
      apiFetch("/search/", {
        s: `${track.name} ${track.artist.name}`,
        limit: 1,
      }).then((res) => res.json()),
    );
    const trackDatas = await Promise.all(trackPromises);

    const allItems = trackDatas
      .map((data) =>
        data.items && data.items.length > 0 ? data.items[0] : null,
      )
      .filter((item) => item);

    if (allItems.length > 0) {
      const trackMap = new Map();
      allItems
        .filter((track) => track.popularity > 0)
        .forEach((track) => {
          const key = `${track.artist.name}-${track.title}`;
          if (
            !trackMap.has(key) ||
            trackMap.get(key).popularity < track.popularity
          ) {
            trackMap.set(key, track);
          }
        });

      const sortedTracks = Array.from(trackMap.values())
        .sort((a, b) => b - a)
        .slice(0, 20);

      topTracksData = sortedTracks;
      topTracksLastUpdated = new Date();

      topTracksBadge.classList.add("hidden");

      displayTopTracks(sortedTracks);
      console.log("Top tracks loaded:", sortedTracks);
    } else {
      resultsGrid.innerHTML = `<p id="placeholder">No top tracks available at the moment.</p>`;
    }
  } catch (error) {
    console.error("Error loading top tracks:", error);
    resultsGrid.innerHTML = `<p id="placeholder" style="color: #f87171;">Error loading top tracks</p>
        `;
  }
}

function isDataStillValid() {
  if (!topTracksLastUpdated) return false;

  const now = new Date();
  const lastUpdate = new Date(topTracksLastUpdated);
  const hoursDifference = (now - lastUpdate) / (1000 * 60 * 60);

  return hoursDifference < 24;
}

function displayTopTracks(tracks) {
  currentList = tracks;
  resultsGrid.innerHTML = "";

  const header = document.createElement("div");
  header.className =
    "mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20";

  const lastUpdatedText = topTracksLastUpdated
    ? `Last updated: ${formatDate(topTracksLastUpdated)}`
    : "Fresh data";

  header.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <h3 class="text-lg font-semibold text-white mb-1">Top tracks</h3>
                <p class="text-sm text-gray-400">Top tracks based on popularity</p>
            </div>
            <div class="text-right">
                <span class="text-xs text-gray-500">${lastUpdatedText}</span>
                <div class="mt-1">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                        </svg>
                        LIVE
                    </span>
                </div>
            </div>
        </div>
    `;

  resultsGrid.appendChild(header);

  if (!tracks.length) {
    resultsGrid.innerHTML += `<p id="placeholder">No top tracks found.</p>`;
    return;
  }

  tracks.forEach((track, index) => {
    const card = createTopTrackCard(track, index);
    resultsGrid.appendChild(card);
  });
}

function createTopTrackCard(track, index) {
  const card = document.createElement("div");
  card.className =
    "track-glass flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors";

  const imageUrl = `${IMAGE_API_BASE}${track.album.cover.split("-").join("/")}/320x320.jpg`;
  const rankColor =
    index < 3
      ? "text-yellow-400"
      : index < 10
        ? "text-gray-300"
        : "text-gray-500";
  const rankBgColor =
    index < 3
      ? "bg-yellow-500/20"
      : index < 10
        ? "bg-gray-500/20"
        : "bg-gray-600/20";
  const isFav = isFavorite(track);

  card.innerHTML = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full ${rankBgColor} ${rankColor} font-bold text-sm">
            ${index + 1}
        </div>
        <img src="${imageUrl}" alt="${track.title}" class="h-[64px] w-[64px] rounded object-cover">
        <div class="min-w-0 flex-1">
            <h3 class="break-words font-semibold text-white">${track.title}</h3>
            <a class="break-words text-sm text-gray-400 hover:text-blue-400 hover:underline inline-block">${track.artist.name}</a>
            <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-gray-500">${track.album.title}</span>
                <span class="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">${track.popularity}% popular</span>
            </div>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-400">
            <button class="favorite-btn rounded-full p-2 transition-colors ${isFav ? "text-red-400" : "text-gray-400"} hover:text-red-400" title="${isFav ? "remove from favorites" : "add to favorites"}" aria-label="${isFav ? "Remove from favorites" : "Add to favorites"}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </button>
            <button class="add-to-queue-btn rounded-full p-2 text-gray-400 transition-colors hover:text-white" title="add to queue" aria-label="Add to queue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <span>${formatTime(track.duration || 0)}</span>
        </div>
    `;

  card.querySelector(".favorite-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(track);
    const btn = e.target.closest(".favorite-btn");
    const isNowFav = isFavorite(track);
    btn.classList.toggle("text-red-400", isNowFav);
    btn.classList.toggle("text-gray-400", !isNowFav);
    btn
      .querySelector("svg")
      .setAttribute("fill", isNowFav ? "currentColor" : "none");
    btn.setAttribute(
      "title",
      isNowFav ? "remove from favorites" : "add to favorites",
    );
    btn.setAttribute(
      "aria-label",
      isNowFav ? "Remove from favorites" : "Add to favorites",
    );
  });

  card.querySelector(".add-to-queue-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    addToQueue(track);
  });

  card.addEventListener("click", () => playSong(index, currentList));

  return card;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

setInterval(
  () => {
    if (currentSearchMode === "topTracks" && topTracksData) {
      console.log("Auto-refreshing top tracks data");
      topTracksData = null;
      loadTopTracks();
    }
  },
  24 * 60 * 60 * 1000,
);

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
    let params = { s: query };
    if (currentSearchMode === "artists") {
      params = { a: query, limit: 50 };
    }

    const response = await apiFetch("/search/", params);
    const data = await response.json();
    console.log("API Response:", data);

    if (currentSearchMode === "artists") {
      const artists = extractArtistData(data);
      console.log("Extracted artists:", artists);
      displayArtistResults(artists);
    } else {
      displayResults(data.data.items || []);
    }
  } catch (error) {
    console.error("Search error:", error);
    resultsGrid.innerHTML = `<p id="placeholder" style="color: #f87171;">Error fetching data</p>`;
  }
}

function extractArtistData(apiResponse) {
  const artists = [];

  if (!apiResponse || !Array.isArray(apiResponse) || apiResponse.length === 0) {
    return artists;
  }

  const responseData = apiResponse[0];
  console.log("Response data structure:", responseData);

  if (responseData.artists?.items?.length > 0) {
    console.log("Found artists in items array:", responseData.artists.items);

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

  if (responseData.topHits?.length > 0) {
    console.log("Checking topHits:", responseData.topHits);

    responseData.topHits.forEach((hit) => {
      if (hit.item) {
        const item = hit.item;

        if (
          item.type === "artist" ||
          item.artistTypes ||
          (item.name && !item.title && !item.album)
        ) {
          console.log("Found artist in topHits:", item);

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

  if (artists.length === 0 && responseData.tracks?.items?.length > 0) {
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
    console.log("Extracted artists from tracks:", extractedArtists);
  }

  return artists;
}

function displayArtistResults(artists) {
  currentList = artists;
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
    "track-glass flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors";

  const artistImageUrl = artist.picture
    ? `${IMAGE_API_BASE}${artist.picture.split("-").join("/")}/320x320.jpg`
    : "https://placehold.co/64x64";

  card.innerHTML = `
        <img src="${artistImageUrl}" alt="${artist.name}" class="h-[64px] w-[64px] rounded object-cover">
        <div class="min-w-0 flex-1">
            <h3 class="break-words font-semibold text-white">${artist.name}</h3>
            <p class="text-sm text-gray-400">${artist.artistTypes?.join(", ") || "Artist"}</p>
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
  const bioText = artist.bio?.text || "No bio available";
  const types = artist.artistTypes?.join(", ") || "Artist";

  alert(`Artist: ${artist.name}\nTypes: ${types}\nBio: ${bioText}`);
}

function displayResults(songs) {
  currentList = songs;
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

function createTrackCard(song, index) {
  const card = document.createElement("div");
  card.className =
    "track-glass flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors";

  const imageUrl = `${IMAGE_API_BASE}${song.album.cover.split("-").join("/")}/320x320.jpg`;
  const isFav = isFavorite(song);

  card.innerHTML = `
        <img src="${imageUrl}" alt="${song.title}" class="h-[64px] w-[64px] rounded object-cover">
        <div class="min-w-0 flex-1">
            <h3 class="break-words font-semibold text-white">${song.title}</h3>
            <a class="break-words text-sm text-gray-400 hover:text-blue-400 hover:underline inline-block">${song.artist.name}</a>
            <p class="text-xs text-gray-500">${song.album.title} • CD • 16-bit/44.1 kHz FLAC</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-400">
            <button class="favorite-btn rounded-full p-2 transition-colors ${isFav ? "text-red-400" : "text-gray-400"} hover:text-red-400" title="${isFav ? "remove from favorites" : "add to favorites"}" aria-label="${isFav ? "Remove from favorites" : "Add to favorites"}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </button>
            <button class="add-to-queue-btn rounded-full p-2 text-gray-400 transition-colors hover:text-white" title="add to queue" aria-label="Add to queue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <span>${formatTime(song.duration || 0)}</span>
        </div>
    `;

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
      isNowFav ? "remove from favorites" : "add to favorites",
    );
    btn.setAttribute(
      "aria-label",
      isNowFav ? "Remove from favorites" : "Add to favorites",
    );
  });

  card.querySelector(".add-to-queue-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    addToQueue(song);
  });

  card.addEventListener("click", () => playSong(index, currentList));

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
            <span class="w-6 text-xs font-semibold text-gray-500 group-hover:text-gray-300">${index + 1}</span>
            <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium">${song.title}</p>
                <a class="truncate text-xs text-gray-400 hover:text-blue-400 hover:underline inline-block">${song.artist.name}</a>
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
    playSongFromQueue(index),
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
    albumArt.src = `${IMAGE_API_BASE}${song.album.cover.split("-").join("/")}/320x320.jpg`;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist.name;
    document.getElementById("albumTitle").textContent = song.album.title;
    document.getElementById("qualityLabel").textContent = quality;

    fetchLyrics(song.id).then((lyricsText) => {
      if (lyricsText) {
        liricle.load({ text: lyricsText });
      } else {
        currentLyricsLines = [];
        renderLyrics();
      }
    });

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
      progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    }
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);

    liricle.sync(audio.currentTime);
  }
});

audio.addEventListener("ended", () => {
  if (repeatMode === "one") {
    audio.currentTime = 0;
    audio.play();
  } else if (repeatMode === "all") {
    nextBtn.click();
  } else {
    // off: go to next if not last, else stop
    if (currentSong < queue.length - 1) {
      nextBtn.click();
    } else {
      isPlaying = false;
      updatePlayButton(false);
    }
  }
});

volumeSlider.addEventListener("input", (e) => {
  if (gainNode) {
    gainNode.gain.value = e.target.value;
  } else {
    audio.volume = e.target.value;
  }
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
        tracks: arrayRemove(track)
      });
    } else {
      favorites.push(track);
      await setDoc(docRef, {
        tracks: arrayUnion(track)
      }, { merge: true });
    }
  } catch (error) {
    console.error("Error updating favorites:", error);
  }
}

async function fetchLyrics(trackId) {
  try {
    const trackInfoResponse = await fetch(`${TRACK_INFO_API_BASE}/?id=${trackId}`);
    const trackInfo = await trackInfoResponse.json();

    const title = trackInfo.data.title;
    const artist = trackInfo.data.artist.name;
    const album = trackInfo.data.album.title;
    const duration = trackInfo.data.duration;

    const lyricsUrl = `https://lyricsplus.prjktla.workers.dev/v2/lyrics/get?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&duration=${duration}&source=apple,lyricsplus,musixmatch,spotify,musixmatch-word`;
    const lyricsResponse = await fetch(lyricsUrl);
    const lyricsData = await lyricsResponse.json();

    if (lyricsData.error) {
      console.error("Lyrics not found:", lyricsData.error.message);
      return null;
    }

    if (lyricsData.lyrics && Array.isArray(lyricsData.lyrics)) {
      const lrcLines = lyricsData.lyrics.map(line => {
        const minutes = Math.floor(line.time / 60000);
        const seconds = Math.floor((line.time % 60000) / 1000);
        const centiseconds = Math.floor((line.time % 1000) / 10);
        const timestamp = `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}]`;
        return `${timestamp}${line.text}`;
      });
      return lrcLines.join('\n');
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

liricle = new Liricle();

lyricsBtn.addEventListener("click", () => {
  lyricsModal.classList.remove("hidden");
  if (currentLyricsLines.length === 0 && queue.length > 0 && currentSong >= 0) {
    const song = queue[currentSong];
    fetchLyrics(song.id).then((lyricsText) => {
      if (lyricsText) {
        liricle.load({ text: lyricsText });
      } else {
        currentLyricsLines = [];
        renderLyrics();
      }
    });
  }
});

closeLyricsModal.addEventListener("click", () => {
  lyricsModal.classList.add("hidden");
});

lyricsModal.addEventListener("click", (e) => {
  if (e.target === lyricsModal) {
    lyricsModal.classList.add("hidden");
  }
});

liricle.on("sync", (line, word) => {
  updateLyricsDisplay(line);
});

liricle.on("load", (data) => {
  currentLyricsLines = data.lines;
  renderLyrics();
});

function renderLyrics() {
  lyricsContainer.innerHTML = "";
  if (currentLyricsLines.length === 0) {
    lyricsContainer.innerHTML = `<img src="${random404Image}" alt="Lyrics not found" class="mx-auto block max-w-sm rounded-lg shadow-lg">
                                    <p class="font-semibold text-white">No lyrics available!</p>
                                    <p class="font-semibold text-white">All images are by guuchama</p>`;
    return;
  }

  currentLyricsLines.forEach((line, index) => {
    const lineEl = document.createElement("div");
    lineEl.className =
      "lyrics-line py-2 px-4 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 rounded-lg hover:bg-gray-700/50";
    lineEl.textContent = line.text;
    lineEl.dataset.time = line.time;
    lineEl.dataset.index = index;
    lineEl.addEventListener("click", () => {
      audio.currentTime = line.time;
    });
    lyricsContainer.appendChild(lineEl);
  });
}

function updateLyricsDisplay(currentLine) {
  const lines = lyricsContainer.querySelectorAll(".lyrics-line");
  lines.forEach((line, index) => {
    line.classList.remove("text-blue-400", "font-semibold", "scale-105");
    if (currentLine && index === currentLine.index) {
      line.classList.add("text-blue-400", "font-semibold", "scale-105");
      line.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}
