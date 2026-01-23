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
import { PlayerActions } from "./playerActions.js";

const API_BASES = [
  "https://hifi-one.spotisaver.net",
  "https://hifi-two.spotisaver.net"
];

const IMAGE_API_BASE = "https://resources.tidal.com/images/";

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
const settingsBtn = document.getElementById("settingsBtn");
const settingsDropdown = document.getElementById("settingsDropdown");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");


const openSettingsBtn = document.getElementById('openSettingsBtn');
const settingsQualityBtn = document.getElementById('settingsQualityBtn');
const settingsCrossfadeToggle = document.getElementById('settingsCrossfadeToggle');
const settingsCrossfadeSlider = document.getElementById('settingsCrossfadeSlider');
const settingsCrossfadeInput = document.getElementById('settingsCrossfadeInput');
const settingsEqualizerBtn = document.getElementById('settingsEqualizerBtn');
const settingsKeyboardBtn = document.getElementById('settingsKeyboardBtn');
const keyboardShortcutsModal = document.getElementById('keyboardShortcutsModal');
const closeKeyboardModal = document.getElementById('closeKeyboardModal');
const settingsLogoutBtn = document.getElementById('settingsLogoutBtn');
const settingsPcUsername = document.getElementById('settingsPcUsername');
const settingsPcEmail = document.getElementById('settingsPcEmail');

const mobileFullscreenPlayer = document.getElementById("mobileFullscreenPlayer");
const fsMinimizeBtn = document.getElementById("fsMinimizeBtn");
const fsPlayPauseBtn = document.getElementById("fsPlayPauseBtn");
const fsPrevBtn = document.getElementById("fsPrevBtn");
const fsNextBtn = document.getElementById("fsNextBtn");
const fsShuffleBtn = document.getElementById("fsShuffleBtn");
const fsRepeatBtn = document.getElementById("fsRepeatBtn");
const fsProgressBarContainer = document.getElementById("fsProgressBarContainer");
const fsProgressBar = document.getElementById("fsProgressBar");
const fsProgressThumb = document.getElementById("fsProgressThumb");
const fsOptionsBtn = document.getElementById("fsOptionsBtn");
const fsLyricsBtn = document.getElementById("fsLyricsBtn");
const fsQueueBtn = document.getElementById("fsQueueBtn");
const fsFavoriteBtn = document.getElementById("fsFavoriteBtn");
const fsMainContent = document.getElementById("fsMainContent");
const fsArtWrapper = document.getElementById("fsArtWrapper");
const fsLyricsContainer = document.getElementById("fsLyricsContainer");
const fsAmLyricsWrapper = document.getElementById("fsAmLyricsWrapper");
const mobileQueueModal = document.getElementById("mobileQueueModal");
const closeMobileQueueBtn = document.getElementById("closeMobileQueueBtn");
const mobileQueueList = document.getElementById("mobileQueueList");
const fsOptionsModal = document.getElementById("fsOptionsModal");
const playerBackdrop = document.querySelector('.audio-player-backdrop');

const pcFullscreenPlayer = document.getElementById("pcFullscreenPlayer");
const openPcFullscreenBtn = document.getElementById("openPcFullscreenBtn");
const closePcFullscreenBtn = document.getElementById("closePcFullscreenBtn");
const pcFsArt = document.getElementById("pcFsArt");
const pcFsBackground = document.getElementById("pcFsBackground");
const pcFsTitle = document.getElementById("pcFsTitle");
const pcFsArtist = document.getElementById("pcFsArtist");
const pcFsAlbumTitle = document.getElementById("pcFsAlbumTitle");
const pcFsProgressBar = document.getElementById("pcFsProgressBar");
const pcFsCurrentTime = document.getElementById("pcFsCurrentTime");
const pcFsDuration = document.getElementById("pcFsDuration");
const pcFsPlayPauseBtn = document.getElementById("pcFsPlayPauseBtn");
const pcFsPrevBtn = document.getElementById("pcFsPrevBtn");
const pcFsNextBtn = document.getElementById("pcFsNextBtn");
const pcFsShuffleBtn = document.getElementById("pcFsShuffleBtn");
const pcFsRepeatBtn = document.getElementById("pcFsRepeatBtn");
const pcFsLyricsContainer = document.getElementById("pcFsLyricsContainer");
const pcFsProgressBarContainer = document.getElementById("pcFsProgressBarContainer");
let pcFsAmLyricsElement = null;
let isPcFullscreen = false;
let pcLyricsRafId = null;

function syncPcLyrics() {
    if (!isPcFullscreen || audio.paused || !pcFsAmLyricsElement) {
        if (pcLyricsRafId) {
            cancelAnimationFrame(pcLyricsRafId);
            pcLyricsRafId = null;
        }
        return;
    }
    
    pcFsAmLyricsElement.currentTime = audio.currentTime * 1000;
    pcLyricsRafId = requestAnimationFrame(syncPcLyrics);
}

function updateMediaSession(song) {
    if (!('mediaSession' in navigator) || !song) return;

    navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist.name || song.artist || "Unknown Artist",
        album: song.album.title || song.album || "Unknown Album",
        artwork: [
            { src: song.album?.cover ? `${IMAGE_API_BASE}${song.album.cover.split("-").join("/")}/320x320.jpg` : "https://placehold.co/320x320", sizes: "320x320", type: "image/jpeg" },
            { src: song.album?.cover ? `${IMAGE_API_BASE}${song.album.cover.split("-").join("/")}/640x640.jpg` : "https://placehold.co/640x640", sizes: "640x640", type: "image/jpeg" },
        ]
    });

    navigator.mediaSession.setActionHandler('play', () => {
        if (typeof togglePlay === 'function') togglePlay(true);
        else audio.play();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
        if (typeof togglePlay === 'function') togglePlay(false);
        else audio.pause();
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (typeof playPrevSong === 'function') playPrevSong();
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (typeof playNextSong === 'function') playNextSong();
    });
    navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime && audio.duration) {
            audio.currentTime = details.seekTime;
        }
    });
}

const pcFsBufferBar = document.getElementById("pcFsBufferBar");
const fsBufferBar = document.getElementById("fsBufferBar");
const closeFsOptionsBtn = document.getElementById("closeFsOptionsBtn");
const fsOptionArtist = document.getElementById("fsOptionArtist");
const fsOptionAlbum = document.getElementById("fsOptionAlbum");
const fsOptionAdd = document.getElementById("fsOptionAdd");
const miniPlayerInfo = document.querySelector(".audio-player-glass .flex.items-center.gap-3");
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


const pcFsFavoriteBtn = document.getElementById("pcFsFavoriteBtn");

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

const artistTopTracksInfo = document.getElementById("artistTopTracksInfo");

let currentList = [];
let queue = [];
let currentSong = 0;
let isPlaying = false;
let currentSearchMode = "tracks";
let currentPlayingTrackId = null;
let isMobileFullscreenOpen = false;

let favorites = [];
let userPlaylists = [];
let recentlyPlayed = [];
let currentUser = null;
let currentAlbumTracks = [];

onAuthStateChanged(window.auth, async (user) => {
  currentUser = user;
  if (user) {
    await loadFavoritesFromFirestore();
    await loadPlaylistsFromFirestore();
    await loadRecentlyPlayedFromFirestore();
  } else {
    favorites = [];
    userPlaylists = [];
    recentlyPlayed = [];
  }
});



async function loadRecentlyPlayedFromFirestore() {
    if (!currentUser) return;
    try {
        const docRef = doc(window.db, "history", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            recentlyPlayed = docSnap.data().tracks || [];
        } else {
            recentlyPlayed = [];
        }
    } catch (e) {
        console.error("Error loading history:", e);
        recentlyPlayed = [];
    }
}

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
let isShuffle = false;


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

let isDragging = false;
let dragProgress = 0;
let isFsDragging = false;
let fsDragProgress = 0;
let wasPlaying = false;
let lyricsRafId = null;


function toggleShuffleMode() {
  isShuffle = !isShuffle;
  updateShuffleButton();
}

function updateShuffleButton() {

  if (pcFsShuffleBtn) {
    const icon = pcFsShuffleBtn.querySelector("i") || pcFsShuffleBtn.querySelector("svg");
    if (isShuffle) {
      pcFsShuffleBtn.classList.add("text-blue-400");
      pcFsShuffleBtn.classList.remove("text-white/40");

    } else {
      pcFsShuffleBtn.classList.remove("text-blue-400");
      pcFsShuffleBtn.classList.add("text-white/40");
    }
  }

  if (fsShuffleBtn) {
      if (isShuffle) {
          fsShuffleBtn.classList.add("text-blue-400");
          fsShuffleBtn.classList.remove("text-gray-400");
      } else {
          fsShuffleBtn.classList.remove("text-blue-400");
          fsShuffleBtn.classList.add("text-gray-400");
      }
  }

  if (shuffleBtn) {
       if (isShuffle) {
          shuffleBtn.classList.add("text-blue-500");
          shuffleBtn.classList.remove("text-gray-400");
      } else {
          shuffleBtn.classList.remove("text-blue-500");
          shuffleBtn.classList.add("text-gray-400");
      }
  }
}

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
  
  const fsRepeatBtn = document.getElementById("fsRepeatBtn");
  if (fsRepeatBtn) {
    const fsIcon = fsRepeatBtn.querySelector("svg") || fsRepeatBtn.querySelector("i");
    if (repeatMode === "one") {
      if (fsIcon) fsIcon.setAttribute("data-lucide", "repeat-1");
      fsRepeatBtn.classList.add("text-blue-400");
      fsRepeatBtn.classList.remove("text-gray-400");
    } else if (repeatMode === "all") {
      if (fsIcon) fsIcon.setAttribute("data-lucide", "repeat");
      fsRepeatBtn.classList.add("text-blue-400");
      fsRepeatBtn.classList.remove("text-gray-400");
    } else {
      if (fsIcon) fsIcon.setAttribute("data-lucide", "repeat");
      fsRepeatBtn.classList.remove("text-blue-400");
      fsRepeatBtn.classList.add("text-gray-400");
    }
  }

  const pcFsRepeatBtn = document.getElementById("pcFsRepeatBtn");
  if (pcFsRepeatBtn) {
    const pcIcon = pcFsRepeatBtn.querySelector("svg") || pcFsRepeatBtn.querySelector("i");
    if (repeatMode === "one") {
      if (pcIcon) pcIcon.setAttribute("data-lucide", "repeat-1");
      pcFsRepeatBtn.classList.add("text-blue-400");
      pcFsRepeatBtn.classList.remove("text-white/40");
      pcFsRepeatBtn.setAttribute("title", "repeat one");
    } else if (repeatMode === "all") {
      if (pcIcon) pcIcon.setAttribute("data-lucide", "repeat");
      pcFsRepeatBtn.classList.add("text-blue-400");
      pcFsRepeatBtn.classList.remove("text-white/40");
      pcFsRepeatBtn.setAttribute("title", "repeat all");
    } else {
      if (pcIcon) pcIcon.setAttribute("data-lucide", "repeat");
      pcFsRepeatBtn.classList.remove("text-blue-400");
      pcFsRepeatBtn.classList.add("text-white/40");
      pcFsRepeatBtn.setAttribute("title", "repeat off");
    }
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

  if (!searchInput.value.trim() && (mode === 'tracks' || mode === 'artists' || mode === 'albums')) {
      renderSearchHistory();
  } else if (searchInput.value.trim() && (mode === 'tracks' || mode === 'artists' || mode === 'albums')) {
      searchSongs(searchInput.value.trim());
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

searchInput.addEventListener("focus", () => {
    if (!searchInput.value.trim()) {
        renderSearchHistory();
    }
});

searchInput.addEventListener("input", () => {
    if (!searchInput.value.trim()) {
        renderSearchHistory();
    }
});

function setupKeyboardShortcuts() {
    document.addEventListener("keydown", async (e) => {
        if (
            e.target.tagName.toLowerCase() === "input" ||
            e.target.tagName.toLowerCase() === "textarea"
        ) {
            return;
        }

        switch (e.key) {
            case " ":
                e.preventDefault();
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
                break;

            case "ArrowLeft":
                if (audio.duration) {
                    audio.currentTime = Math.max(0, audio.currentTime - 5);
                }
                break;

            case "ArrowRight":
                if (audio.duration) {
                    audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
                }
                break;
            
            case "ArrowUp":
                 e.preventDefault();
                 const newVolUp = Math.min(1, parseFloat(volumeSlider.value) + 0.1);
                 volumeSlider.value = newVolUp;
                 updateEffectiveVolume();
                 break;

            case "ArrowDown":
                 e.preventDefault();
                 const newVolDown = Math.max(0, parseFloat(volumeSlider.value) - 0.1);
                 volumeSlider.value = newVolDown;
                 updateEffectiveVolume();
                 break;

            case "m": 
            case "M":
                 toggleMute();
                 break;

            case "/":
                e.preventDefault();
                const searchInput = document.getElementById("searchInput");
                if (searchInput) {
                    searchInput.focus();
                }
                break;
        }
    });
}

function setupMiniPlayerGestures() {
    const backdrop = document.querySelector('.audio-player-backdrop');
    const player = document.getElementById("mobileFullscreenPlayer");
    
    if (!backdrop || !player) return;

    let touchStartY = 0;
    let touchMoveY = 0;
    const minSwipeDistanceY = 50; 

    backdrop.addEventListener('touchstart', (e) => {
        if (window.innerWidth >= 768) return;
        
        touchStartY = e.touches[0].clientY;
        touchMoveY = 0;
    }, { passive: true });

    backdrop.addEventListener('touchmove', (e) => {
        if (window.innerWidth >= 768) return;
        if (e.cancelable) e.preventDefault();
        touchMoveY = e.touches[0].clientY;
    }, { passive: false });

    backdrop.addEventListener('wheel', (e) => {
        e.preventDefault();
    }, { passive: false });

    backdrop.addEventListener('touchend', () => {
        if (window.innerWidth >= 768) return;
        if (!touchMoveY) return;

        const deltaY = touchMoveY - touchStartY;

        if (deltaY < -minSwipeDistanceY) {
             if (mobileFullscreenPlayer) {
                mobileFullscreenPlayer.classList.remove("translate-y-full");
                isMobileFullscreenOpen = true;
                document.body.style.overflow = "hidden";
                backdrop.classList.add('hidden');
            }
        }
        
        touchStartY = 0;
        touchMoveY = 0;
    });
}

function setupPageSwipeDismiss(elementId, closeCallback) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let touchStartY = 0;
    let touchMoveY = 0;
    const minSwipeDistanceY = 100;

    element.addEventListener('touchstart', (e) => {
        if (element.scrollTop > 0) return;
        touchStartY = e.touches[0].clientY;
        touchMoveY = 0;
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
        if (element.scrollTop > 0) return;
        touchMoveY = e.touches[0].clientY;
    }, { passive: true });

    element.addEventListener('touchend', () => {
        if (!touchMoveY) return;
        if (element.scrollTop > 0) return;

        const deltaY = touchMoveY - touchStartY;

        if (deltaY > minSwipeDistanceY) {
            if (typeof closeCallback === 'function') {
                closeCallback();
            }
        }
        
        touchStartY = 0;
        touchMoveY = 0;
    });
}

setupKeyboardShortcuts();
setupTouchGestures();
setupMiniPlayerGestures();

setupPageSwipeDismiss('artistPage', () => {
    if (typeof closeArtistPage === 'function') closeArtistPage();
    else document.getElementById('closeArtistPageBtn')?.click();
});
setupPageSwipeDismiss('albumPage', () => {
     if (typeof closeAlbumPage === 'function') closeAlbumPage();
     else document.getElementById('closeAlbumPageBtn')?.click();
});
setupPageSwipeDismiss('playlistPage', () => {
     if (typeof closePlaylistPage === 'function') closePlaylistPage();
     else document.getElementById('closePlaylistPageBtn')?.click();
});


function closeMobileFullscreenPlayer() {
    const player = document.getElementById("mobileFullscreenPlayer");
    const backdrop = document.querySelector('.audio-player-backdrop');
    if (player) {
        player.classList.add("translate-y-full");
        isMobileFullscreenOpen = false;
        document.body.style.overflow = "";
        if (backdrop) backdrop.classList.remove('hidden');
        
        const fsOptionsModal = document.getElementById("fsOptionsModal");
        if (fsOptionsModal) fsOptionsModal.classList.add("translate-y-full");
    }
}

function setupTouchGestures() {
    const player = document.getElementById("mobileFullscreenPlayer");
    const artWrapper = document.getElementById("fsArtWrapper");
    
    if (!player || !artWrapper) return;

    let touchStartY = 0;
    let touchMoveY = 0;
    const minSwipeDistanceY = 100;

    let shouldIgnoreSwipe = false;

    player.addEventListener('touchstart', (e) => {
        if (e.target.closest('#fsLyricsContainer')) {
            shouldIgnoreSwipe = true;
            return;
        }
        shouldIgnoreSwipe = false;
        touchStartY = e.touches[0].clientY;
        touchMoveY = 0;
    }, { passive: true });

    player.addEventListener('touchmove', (e) => {
        if (shouldIgnoreSwipe) return;
        touchMoveY = e.touches[0].clientY;
    }, { passive: true });

    player.addEventListener('touchend', () => {
        if (shouldIgnoreSwipe || !touchMoveY) return; 
        const deltaY = touchMoveY - touchStartY;

        if (deltaY > minSwipeDistanceY && isMobileFullscreenOpen) {
            closeMobileFullscreenPlayer();
        }
        touchStartY = 0;
        touchMoveY = 0;
    });


    let touchStartX = 0;
    let touchMoveX = 0;
    let lastTap = 0;
    const minSwipeDistanceX = 60;
    
    artWrapper.style.perspective = "1000px";
    artWrapper.style.transformStyle = "preserve-3d";
    
    
    let currentImg = null;
    let nextImg = null;
    let prevImg = null;

    artWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchMoveX = 0;
        
        currentImg = document.getElementById('fsPlayerImage');
        if (currentImg) {
            currentImg.classList.add("rounded-lg");
            currentImg.style.transition = 'none';
            currentImg.style.transform = 'translateZ(0) rotateY(0deg)';
        }
        
        prepareSwipeImages(artWrapper);

    }, { passive: true });

    artWrapper.addEventListener('touchmove', (e) => {
        touchMoveX = e.touches[0].clientX;
        const deltaX = touchMoveX - touchStartX;
        
        if (Math.abs(deltaX) > 10) {
            
            if (currentImg) {
                const rotation = deltaX / 20;
                currentImg.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
                currentImg.style.filter = `brightness(${Math.max(0.5, 1 - Math.abs(deltaX)/1000)})`;
            }
            
            updateSwipeVisuals(deltaX);
        }
    }, { passive: true });

    artWrapper.addEventListener('touchend', (e) => {
        const now = new Date().getTime();
        const tapDelay = now - lastTap;
        
        if (tapDelay < 300 && tapDelay > 0 && Math.abs(touchMoveX - touchStartX) < 10) {
             if (navigator.vibrate) navigator.vibrate(50);
             if (window.togglePlay) window.togglePlay();
             createDoubleTapEffect(e);
             lastTap = 0;
             resetSwipeVisuals();
             return;
        }
        lastTap = now;

        if (touchMoveX) {
            const deltaX = touchMoveX - touchStartX;

            if (Math.abs(deltaX) > minSwipeDistanceX) {
                if (navigator.vibrate) navigator.vibrate(15);
                
                if (currentImg) {
                     currentImg.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease-out';
                     const targetX = deltaX > 0 ? window.innerWidth * 1.2 : -window.innerWidth * 1.2;
                     const rotation = deltaX > 0 ? 30 : -30;
                     currentImg.style.transform = `translateX(${targetX}px) rotate(${rotation}deg)`;
                     currentImg.style.opacity = '0';
                }
                
                const prevEl = document.getElementById('swipePrevImg');
                const nextEl = document.getElementById('swipeNextImg');
                
                if (deltaX > 0 && prevEl) {
                     prevEl.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease-out';
                     prevEl.style.transform = 'translateX(0) scale(1) rotate(0deg)';
                     prevEl.style.opacity = '1';
                     prevEl.style.zIndex = '20';
                } else if (deltaX < 0 && nextEl) {
                     nextEl.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease-out';
                     nextEl.style.transform = 'translateX(0) scale(1) rotate(0deg)';
                     nextEl.style.opacity = '1';
                     nextEl.style.zIndex = '20';
                }

                setTimeout(() => {
                    if (deltaX > 0) {
                        if (window.playPrevSong) window.playPrevSong();
                    } else {
                        if (window.playNextSong) window.playNextSong();
                    }
                    setTimeout(resetSwipeVisuals, 50); 
                }, 300);
            } else {
               resetSwipeVisuals();
            }
        } else {
            resetSwipeVisuals();
        }
        
        touchStartX = 0;
        touchMoveX = 0;
    });
    
    function prepareSwipeImages(container) {
        const baseStyle = 'absolute top-0 left-0 w-full h-full object-cover rounded-xl brightness-75';
        
        if (!document.getElementById('swipePrevImg')) {
            const img = document.createElement('img');
            img.id = 'swipePrevImg';
            img.className = baseStyle;
            img.style.transform = 'translateX(-100%) scale(0.9)'; 
            img.style.opacity = '1';
            img.style.zIndex = '5';
            img.style.display = 'none';
            img.style.pointerEvents = 'none';
            container.appendChild(img);
        }
        if (!document.getElementById('swipeNextImg')) {
            const img = document.createElement('img');
            img.id = 'swipeNextImg';
            img.className = baseStyle;
            img.style.transform = 'translateX(100%) scale(0.9)';
            img.style.opacity = '1';
            img.style.zIndex = '5';
            img.style.display = 'none';
            img.style.pointerEvents = 'none';
            container.appendChild(img);
        }
        
        const prev = getTrackById(getIdFromQueue(currentSong - 1));
        const next = getTrackById(getIdFromQueue(currentSong + 1));
        
        const prevEl = document.getElementById('swipePrevImg');
        const nextEl = document.getElementById('swipeNextImg');
        
        if(prevEl) {
            prevEl.classList.add("rounded-xl");
             prevEl.style.transform = 'translateX(-100%) scale(0.9)';
             prevEl.style.opacity = '1';
             prevEl.style.zIndex = '5';
             prevEl.style.transition = 'none';
             if (prev) {
                 const url = prev.album?.cover || prev.picture;
                 if(url) prevEl.src = `${IMAGE_API_BASE}${url.split("-").join("/")}/640x640.jpg`;
             }
        }
        if(nextEl) {
            nextEl.classList.add("rounded-xl");
            nextEl.style.transform = 'translateX(100%) scale(0.9)';
            nextEl.style.opacity = '1';
            nextEl.style.zIndex = '5';
            nextEl.style.transition = 'none';
            if (next) {
                 const url = next.album?.cover || next.picture;
                 if(url) nextEl.src = `${IMAGE_API_BASE}${url.split("-").join("/")}/640x640.jpg`;
             }
        }
    }
    
    function updateSwipeVisuals(deltaX) {
        const prevEl = document.getElementById('swipePrevImg');
        const nextEl = document.getElementById('swipeNextImg');
        const width = window.innerWidth;
        
        if (deltaX > 0 && prevEl) {
            prevEl.style.display = 'block';
            prevEl.style.transition = 'none';
            
            const moveAmount = -width + deltaX; 
            
            prevEl.style.transform = `translateX(${moveAmount}px) scale(${0.9 + (0.1 * (deltaX/width))}) rotate(${-5 + (5 * (deltaX/width))}deg)`;
            prevEl.style.zIndex = '5';

        } else if (deltaX < 0 && nextEl) {
            nextEl.style.display = 'block';
            nextEl.style.transition = 'none';
            
            const moveAmount = width + deltaX; 

            nextEl.style.transform = `translateX(${moveAmount}px) scale(${0.9 + (0.1 * (Math.abs(deltaX)/width))}) rotate(${5 - (5 * (Math.abs(deltaX)/width))}deg)`;
            nextEl.style.zIndex = '5';
        }
    }
    
    function resetSwipeVisuals() {
        const current = document.getElementById('fsPlayerImage');
        const prevEl = document.getElementById('swipePrevImg');
        const nextEl = document.getElementById('swipeNextImg');
        
        if (current) {
            current.classList.add("rounded-xl");
            current.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease-out, filter 0.3s';
            current.style.transform = '';
            current.style.opacity = '1';
            current.style.filter = 'brightness(1)';
        }
        if (prevEl) {
            prevEl.classList.add("rounded-xl");
             prevEl.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
             prevEl.style.transform = 'scale(0.85)';
             prevEl.style.opacity = '0';
             setTimeout(() => prevEl.style.display = 'none', 300);
        }
        if (nextEl) {
            nextEl.classList.add("rounded-xl");
             nextEl.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
             nextEl.style.transform = 'scale(0.85)';
             nextEl.style.opacity = '0';
             setTimeout(() => nextEl.style.display = 'none', 300);
        }
    }
    
    function getIdFromQueue(idx) {
        if (!queue || queue.length === 0) return null;
        if (isShuffle) return null;
        let i = idx;
        if (i < 0) i = queue.length - 1;
        if (i >= queue.length) i = 0;
        return queue[i] ? queue[i].id : null;
    }

    setupSwipeToDismiss('mobileQueueModal', () => {
        const modal = document.getElementById('mobileQueueModal');
        if (modal) modal.classList.add('translate-y-full');
    });
    
    setupSwipeToDismiss('fsOptionsModal', () => {
        const modal = document.getElementById('fsOptionsModal');
        if (modal) modal.classList.add('translate-y-full');
    });
}

function setupSwipeToDismiss(elementId, closeCallback, threshold = 100) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    element.addEventListener('touchstart', (e) => {
        const scrollContainer = element.querySelector('.overflow-y-auto') || element;
        if (scrollContainer && scrollContainer.scrollTop > 0) return;

        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        if (deltaY > 0) {
            if (e.cancelable) e.preventDefault(); 
            element.style.transition = 'none';
            element.style.transform = `translateY(${deltaY}px)`;
        }
    }, { passive: false });

    element.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaY = currentY - startY;
        element.style.transition = 'transform 0.3s ease-out';

        if (deltaY > threshold) {
            closeCallback();
            setTimeout(() => {
                element.style.transform = '';
            }, 300);
        } else {
            element.style.transform = ''; 
        }
        startY = 0;
        currentY = 0;
    });
}
    
function createDoubleTapEffect(e) {
    const isPlaying = !document.getElementById("audio").paused;
    
    const heart = document.createElement('div');
    heart.innerHTML = isPlaying 
        ? `<svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="text-white drop-shadow-lg"><polygon points="5,3 19,12 5,21"></polygon></svg>`
        : `<svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="text-white drop-shadow-lg"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`; 
        
    
    
    
    
    heart.style.position = 'absolute';
    heart.style.left = '50%';
    heart.style.top = '50%';
    heart.style.transform = 'translate(-50%, -50%) scale(0)';
    heart.style.zIndex = '100';
    heart.style.pointerEvents = 'none';
    
    const container = document.getElementById('fsArtWrapper');
    if (container) {
        container.appendChild(heart);
        
        requestAnimationFrame(() => {
            heart.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease-in';
            heart.style.transform = 'translate(-50%, -50%) scale(1.5)';
            heart.style.opacity = '0';
        });

        setTimeout(() => {
            heart.remove();
        }, 400);
    }
}



const HISTORY_KEYS = {
    tracks: "tidal_search_history_tracks",
    artists: "tidal_search_history_artists",
    albums: "tidal_search_history_albums"
};
const MAX_HISTORY = 5;

function getSearchHistory() {
    const key = HISTORY_KEYS[currentSearchMode] || HISTORY_KEYS.tracks;
    try {
        const history = localStorage.getItem(key);
        return history ? JSON.parse(history) : [];
    } catch (e) {
        console.error("Failed to parse search history", e);
        return [];
    }
}

function saveSearchHistory(query) {
    if (!query) return;
    if (!HISTORY_KEYS[currentSearchMode]) return;

    let history = getSearchHistory();
    history = history.filter(item => item.toLowerCase() !== query.toLowerCase());
    history.unshift(query);
    if (history.length > MAX_HISTORY) {
        history = history.slice(0, MAX_HISTORY);
    }
    
    const key = HISTORY_KEYS[currentSearchMode];
    localStorage.setItem(key, JSON.stringify(history));
}

function deleteFromHistory(query, e) {
    if (e) e.stopPropagation();
    let history = getSearchHistory();
    history = history.filter(item => item !== query);
    
    const key = HISTORY_KEYS[currentSearchMode] || HISTORY_KEYS.tracks;
    localStorage.setItem(key, JSON.stringify(history));
    renderSearchHistory();
}

function renderSearchHistory() {
    if (currentSearchMode !== "tracks" && currentSearchMode !== "artists" && currentSearchMode !== "albums") return; 
    if (searchInput.value.trim()) return;

    const history = getSearchHistory();
    if (history.length === 0 && recentlyPlayed.length === 0) {
        resultsGrid.innerHTML = ""; 
        return;
    }

    resultsGrid.className = "flex flex-col gap-6 pb-20";
    resultsGrid.innerHTML = "";

    if (recentlyPlayed.length > 0) {
        const rpSection = document.createElement("div");
        rpSection.className = "flex flex-col gap-3";
        rpSection.innerHTML = `
            <div class="px-2 text-sm text-gray-500 font-semibold uppercase tracking-wider">Recently Played</div>
        `;

        const scrollContainer = document.createElement("div");
        scrollContainer.className = "flex overflow-x-auto gap-4 pb-4 px-2 snap-x hide-scrollbar";
        
        recentlyPlayed.slice(0, 5).forEach((song, index) => {
             const card = createTrackCard(song, index, recentlyPlayed, { showIndex: false });
             const isPlaying = song.id === currentPlayingTrackId;
             const activeClass = isPlaying ? "border-blue-500/50 bg-blue-900/20" : "border-transparent hover:border-white/5 hover:bg-white/5";
             card.className = `group flex-shrink-0 w-52 flex flex-col items-start gap-3 p-3 rounded-xl transition-colors border cursor-pointer snap-start ${activeClass}`;

             let imageUrl = "https://placehold.co/64x64?text=No+Cover";
             if (song.album && song.album.cover) {
                imageUrl = `${IMAGE_API_BASE}${song.album.cover.split("-").join("/")}/320x320.jpg`;
             } else if (song.picture) {
                imageUrl = `${IMAGE_API_BASE}${song.picture.split("-").join("/")}/320x320.jpg`;
             }

             card.innerHTML = `
                <div class="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg group-hover:shadow-2xl transition-all">
                     <img src="${imageUrl}" alt="${song.title}" class="w-full h-full object-cover" loading="lazy" decoding="async">
                     <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg class="text-white drop-shadow-lg transform scale-90 hover:scale-100 transition-transform" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"></polygon></svg>
                     </div>
                </div>
                <div class="w-full min-w-0">
                    <h3 class="truncate font-medium text-white group-hover:text-blue-400 transition-colors">${song.title}</h3>
                    <p class="truncate text-sm text-gray-400">${song.artist.name}</p>
                </div>
             `;

             card.onclick = () => playSong(index, recentlyPlayed);
             
             scrollContainer.appendChild(card);
        });
        
        rpSection.appendChild(scrollContainer);
        resultsGrid.appendChild(rpSection);
    }

    if (history.length > 0) {
        const historySection = document.createElement("div");
        historySection.className = "flex flex-col gap-1";
        const header = document.createElement("div");
        header.className = "px-2 pb-2 text-sm text-gray-500 font-semibold uppercase tracking-wider";
        header.textContent = "Recent Searches";
        historySection.appendChild(header);

        history.forEach(query => {
            const item = document.createElement("div");
            item.className = "group flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors";
            item.innerHTML = `
                <div class="flex items-center gap-3">
                    <svg class="text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span class="text-gray-300 group-hover:text-white transition-colors">${query}</span>
                </div>
                <button class="delete-history-btn p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" title="Remove from history">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
            
            item.addEventListener("click", () => {
                searchInput.value = query;
                searchSongs(query);
            });

            item.querySelector(".delete-history-btn").addEventListener("click", (e) => {
                deleteFromHistory(query, e);
            });

            historySection.appendChild(item);
        });
        resultsGrid.appendChild(historySection);
    }
    return;

}

async function searchSongs(query) {
  resultsGrid.innerHTML = createSkeletonLoaders(6);
  saveSearchHistory(query);

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

function createAlbumCard(album, extraClasses = "") {
    const card = document.createElement("div");
    card.className = `group relative flex flex-col text-left cursor-pointer p-3 rounded-xl transition-all duration-200 hover:bg-white/5 ${extraClasses}`;
    card.dataset.albumId = album.id;

    let imageUrl = "https://placehold.co/320x320?text=No+Cover";
    if (album.cover) {
         imageUrl = `${IMAGE_API_BASE}${album.cover.split("-").join("/")}/320x320.jpg`;
    }

    const artistName = album.artists && album.artists.length > 0 ? album.artists[0].name : "Unknown Artist";
    const releaseYear = album.releaseDate ? album.releaseDate.split("-")[0] : "";

    card.innerHTML = `
        <div class="relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-gray-900 shadow-lg group-hover:shadow-2xl transition-all duration-300">
            <img src="${imageUrl}" alt="${album.title}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async">
             <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button class="play-album-btn text-white drop-shadow-lg transform scale-90 hover:scale-100 transition-transform" title="Play Album">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"></polygon></svg>
                </button>
            </div>
        </div>
        
        <h3 class="truncate text-base font-medium text-white group-hover:text-blue-400 transition-colors">
            ${album.title}
        </h3>
        <p class="truncate text-sm text-gray-400 mt-0.5">${artistName}</p>
        <p class="text-xs text-gray-500 mt-0.5 opacity-60">${releaseYear}</p>
    `;

    card.addEventListener("click", () => {
        if (document.startViewTransition) {
             document.startViewTransition(() => showAlbumPage(album));
        } else {
             showAlbumPage(album);
        }
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
                artistTypes: item.artistTypes || ["ARTIST"]
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
              artistTypes: ["ARTIST"]
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
    "group flex w-full items-center gap-4 rounded-xl p-3 transition-colors border border-transparent hover:border-white/5 hover:bg-white/5 cursor-pointer";
  card.dataset.artistId = artist.id;

  let imageHtml;
  if (artist.picture) {
      const artistImageUrl = `${IMAGE_API_BASE}${artist.picture.split("-").join("/")}/320x320.jpg`;
      imageHtml = `<img src="${artistImageUrl}" alt="${artist.name}" class="h-16 w-16 rounded-lg object-cover shadow-lg group-hover:shadow-2xl transition-shadow" loading="lazy" decoding="async">`;
  } else {
      imageHtml = `
      <div class="h-16 w-16 rounded-lg bg-gray-800 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>`;
  }

  card.innerHTML = `
        ${imageHtml}
        <div class="min-w-0 flex-1">
            <h3 class="break-words font-medium text-base text-white group-hover:text-blue-400 transition-colors">${artist.name}</h3>
            <p class="text-sm text-gray-400">${
              artist.artistTypes?.join(", ") || "Artist"
            }</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-400">
            <button class="view-artist-btn rounded-full p-2 text-gray-400 transition-colors hover:text-white" title="view artist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
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
  if (document.startViewTransition) {
      document.startViewTransition(() => {
          showArtistPage(artist.id);
      });
  } else {
      showArtistPage(artist.id);
  }
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

function createTrackCard(song, index, list = currentList, options = {}) {
  const showIndex = options.showIndex !== undefined ? options.showIndex : false;
  const trackNumber = options.trackNumber !== undefined ? options.trackNumber : (index + 1);
  const isCurrentlyPlaying = song.id === currentPlayingTrackId;
  
  const card = document.createElement("div");
  card.className =
    "group flex w-full items-center gap-3 md:gap-4 rounded-xl p-3 transition-colors border border-transparent hover:border-white/5 hover:bg-white/5 cursor-pointer";
  card.dataset.trackId = song.id;

  let imageUrl = "https://placehold.co/64x64?text=No+Cover";
  if (song.album && song.album.cover) {
      imageUrl = `${IMAGE_API_BASE}${song.album.cover
        .split("-")
        .join("/")}/320x320.jpg`;
  }
  const isFav = isFavorite(song);

  const trackNumberHtml = showIndex ? `
        <div class="flex-shrink-0 w-8 text-center font-mono">
            <span class="track-number text-sm ${isCurrentlyPlaying ? 'text-blue-400 font-bold' : 'text-gray-500'} group-hover:hidden">${trackNumber}</span>
            <svg class="play-icon hidden group-hover:block mx-auto text-white drop-shadow-md" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"></polygon>
            </svg>
        </div>
    ` : '';

  card.innerHTML = `
        ${trackNumberHtml}
        <img src="${imageUrl}" alt="${song.title}" class="h-16 w-16 rounded-lg object-cover shadow-lg group-hover:shadow-2xl transition-shadow" loading="lazy" decoding="async">
        <div class="min-w-0 flex-1">
            <h3 class="truncate font-medium text-base ${isCurrentlyPlaying ? 'text-blue-400' : 'text-white group-hover:text-blue-400'} transition-colors">${song.title}</h3>
            <a class="artist-link truncate text-sm text-gray-400 hover:text-white hover:underline inline-block mt-0.5 transition-colors relative z-10">${
              song.artist.name
            }</a>
            <div class="flex items-center text-xs text-gray-500 mt-1 gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <a class="album-link truncate hover:text-white hover:underline cursor-pointer transition-colors relative z-10">${song.album ? song.album.title : ''}</a>
                <span class="flex-shrink-0 w-1 h-1 rounded-full bg-gray-600"></span>
                <span class="flex-shrink-0 border border-gray-700 rounded px-1 text-[0.6rem] leading-none py-0.5 text-gray-400">LOSSLESS</span>
            </div>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-400">
            <div class="relative sm:hidden">
                <button class="mobile-actions-btn rounded-full p-2 text-gray-400 transition-colors hover:text-white" title="Actions" onclick="showTrackContextMenu(event, '${song.id}')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                         <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                </button>
            </div>
            </div>

            <div class="hidden sm:flex items-center gap-2">
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
                
                <button class="context-menu-btn rounded-full p-2 text-gray-400 transition-colors hover:text-white" title="track options" onclick="showTrackContextMenu(event, '${song.id}')">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                </button>
            </div>
            <span>${formatTime(song.duration || 0)}</span>
        </div>
    `;

    const mobileActionsBtn = card.querySelector('.mobile-actions-btn');
    if (mobileActionsBtn) {
         mobileActionsBtn.addEventListener('click', (e) => {
             e.stopPropagation();
         });
    }

  card.querySelector(".artist-link").addEventListener("click", (e) => {
    e.stopPropagation();
    if (song.artist && song.artist.id) {
        showArtistPage(song.artist.id);
    }
  });

  card.querySelector(".album-link").addEventListener("click", (e) => {
    e.stopPropagation();
    if (song.album && song.album.id) {
        const navigate = () => {
            showAlbumPage({
                id: song.album.id,
                title: song.album.title,
                cover: song.album.cover,
                artists: [song.artist]
            });
        };

        if (document.startViewTransition) {
             document.startViewTransition(() => navigate());
        } else {
             navigate();
        }
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
        <div class="group flex w-full cursor-pointer items-center gap-4 rounded-xl p-3 text-left transition-colors ${
          isCurrentSong
            ? "bg-blue-900/20 text-white border border-blue-500/30"
            : "text-white border border-transparent hover:bg-white/5 hover:border-white/5"
        }">
            <span class="w-6 text-xs font-mono font-medium text-gray-500 group-hover:text-white text-center">${
              index + 1
            }</span>
            <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium ${isCurrentSong ? 'text-blue-400' : 'text-white'}">${song.title}</p>
                <a class="truncate text-xs text-gray-400 hover:text-white hover:underline inline-block mt-0.5">${
                  song.artist.name
                }</a>
            </div>
            <button class="rounded-full p-2 text-gray-500 transition-colors hover:text-red-400 hover:bg-white/10" title="remove">
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

function updateTrackHighlighting() {
    const allCards = document.querySelectorAll('[data-track-id]');
    allCards.forEach(card => {
        const trackId = parseInt(card.dataset.trackId, 10);
        const isPlaying = trackId === currentPlayingTrackId;

        if (isPlaying) {
            card.classList.remove('border-transparent', 'hover:border-white/5', 'hover:bg-white/5');
            card.classList.add('border-blue-500/50', 'bg-blue-900/20');
        } else {
            card.classList.remove('border-blue-500/50', 'bg-blue-900/20');
            card.classList.add('border-transparent', 'hover:border-white/5', 'hover:bg-white/5');
        }

        const title = card.querySelector('h3');
        if (title) {
            if (isPlaying) {
                title.classList.remove('text-white', 'group-hover:text-blue-400', 'transition-colors');
                title.classList.add('text-blue-400');
            } else {
                title.classList.remove('text-blue-400');
                title.classList.add('text-white', 'group-hover:text-blue-400', 'transition-colors');
            }
        }

        const trackNum = card.querySelector('.track-number');
        if (trackNum) {
            if (isPlaying) {
                trackNum.classList.remove('text-gray-400');
                trackNum.classList.add('text-blue-400');
            } else {
                trackNum.classList.remove('text-blue-400');
                trackNum.classList.add('text-gray-400');
            }
        }
    });
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

  currentPlayingTrackId = song.id;
  updateTrackHighlighting();
  
  if (typeof updateFullscreenPlayerUI === 'function') {
      updateFullscreenPlayerUI(song);
  }

  
  try {
    const fadeDuration = userSettings.crossfadeEnabled ? userSettings.crossfadeDuration : 300;

    const fadeOutPromise = isPlaying ? fadeVolume(0, fadeDuration) : Promise.resolve();
    
    const quality = "LOSSLESS";
    const fetchPromise = apiFetch("/track/", {
      id: song.id,
      quality: quality,
    })
    .then(res => res.json())
    .catch(err => {
        console.error("Fetch failed", err);
        return null;
    });

    if (currentUser) {
        PlayerActions.addToRecentlyPlayed(window.db, currentUser, song).then(updatedHistory => {
            if (updatedHistory) {
                recentlyPlayed = updatedHistory;
                renderSearchHistory();
            }
        });
    }

    const [_, streamData] = await Promise.all([fadeOutPromise, fetchPromise]);
    
    if (!streamData) throw new Error("Failed to fetch stream data");

    updateEffectiveVolume();
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
    
    let statsText = quality;
    document.getElementById("qualityLabel").textContent = statsText;

    const albumCoverUrl = `${IMAGE_API_BASE}${song.album.cover
      .split("-")
      .join("/")}/320x320.jpg`;
    albumArt.src = albumCoverUrl;

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
    
    updateMediaSession(song);


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

        if (amLyricsWrapper && amLyricsElement) {
             amLyricsWrapper.innerHTML = '';
             amLyricsWrapper.appendChild(amLyricsElement);
        }
    }

    if (pcFsArt) pcFsArt.src = albumCoverUrl.replace('320x320', '640x640');
    if (pcFsBackground) pcFsBackground.src = albumCoverUrl.replace('320x320', '640x640');
    if (pcFsTitle) pcFsTitle.textContent = song.title;
    if (pcFsArtist) pcFsArtist.textContent = song.artist.name;
    if (pcFsAlbumTitle) pcFsAlbumTitle.textContent = song.album.title;
    
    updatePcFsFavoriteBtn();
    
    if (pcFsLyricsContainer) {
        pcFsLyricsContainer.innerHTML = '';
        pcFsAmLyricsElement = document.createElement('am-lyrics');
        pcFsAmLyricsElement.className = "w-full h-full text-md lg:text-2xl font-semibold leading-relaxed text-white/50";
        
        pcFsAmLyricsElement.setAttribute('song-title', song.title);
        pcFsAmLyricsElement.setAttribute('song-artist', song.artist.name);
        pcFsAmLyricsElement.setAttribute('song-album', song.album.title);
        pcFsAmLyricsElement.setAttribute('song-duration', (song.duration || 0) * 1000);
        pcFsAmLyricsElement.setAttribute('query', `${song.title} ${song.artist.name}`);
        
        if (song.isrc) pcFsAmLyricsElement.setAttribute('isrc', song.isrc);

        pcFsAmLyricsElement.setAttribute('autoscroll', '');
        pcFsAmLyricsElement.setAttribute('interpolate', '');
        pcFsAmLyricsElement.setAttribute('highlight-color', '#3b82f6');
        pcFsAmLyricsElement.setAttribute('hover-background-color', 'rgba(59, 130, 246, 0.1)');
        pcFsAmLyricsElement.setAttribute('highlight-color', '#3b82f6');
        pcFsAmLyricsElement.setAttribute('hover-background-color', 'rgba(59, 130, 246, 0.1)');
        pcFsAmLyricsElement.setAttribute('font-family', "'Outfit', sans-serif");
        pcFsAmLyricsElement.romanizationEnabled = localStorage.getItem('romajiEnabled') === 'true';
        
        pcFsAmLyricsElement.addEventListener('line-click', (e) => {
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

        pcFsLyricsContainer.appendChild(pcFsAmLyricsElement);
    }

    if (!audioCtx) {
      await initWebAudio();
    }

    if (!audioCtx) {
      await initWebAudio();
    }

    audio.play();
    isPlaying = true;
    updatePlayButton(isPlaying);
    await fadeVolume(volumeSlider.value, fadeDuration);
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

window.togglePlay = async function() {
  if (navigator.vibrate) navigator.vibrate(10);
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
};



function togglePcFullscreen() {
    if (!pcFullscreenPlayer) return;
    
    isPcFullscreen = !isPcFullscreen;
    
    if (isPcFullscreen) {
        pcFullscreenPlayer.classList.remove('hidden');
        requestAnimationFrame(() => {
            pcFullscreenPlayer.classList.remove('opacity-0');
            document.body.style.overflow = 'hidden';
            if (isPlaying) syncPcLyrics();
        });
        if (playerBackdrop) playerBackdrop.classList.add('hidden');
    } else {
        if (pcLyricsRafId) {
            cancelAnimationFrame(pcLyricsRafId);
            pcLyricsRafId = null;
        }
        pcFullscreenPlayer.classList.add('opacity-0');
        document.body.style.overflow = '';
        setTimeout(() => {
            pcFullscreenPlayer.classList.add('hidden');
        }, 300);
        if (playerBackdrop) playerBackdrop.classList.remove('hidden');
    }
}

if (openPcFullscreenBtn) openPcFullscreenBtn.addEventListener('click', togglePcFullscreen);
if (closePcFullscreenBtn) closePcFullscreenBtn.addEventListener('click', togglePcFullscreen);

if (pcFsPlayPauseBtn) pcFsPlayPauseBtn.addEventListener('click', window.togglePlay);
if (pcFsPrevBtn) pcFsPrevBtn.addEventListener('click', () => prevBtn.click());
if (pcFsNextBtn) pcFsNextBtn.addEventListener('click', () => nextBtn.click());
if (pcFsShuffleBtn) pcFsShuffleBtn.addEventListener('click', toggleShuffleMode);
if (pcFsRepeatBtn) pcFsRepeatBtn.addEventListener('click', toggleRepeatMode);

let isPcFsDragging = false;
let pcFsDragProgress = 0;

function updatePcFsProgress(e) {
    if (!audio.duration || !pcFsProgressBarContainer) return;

    const rect = pcFsProgressBarContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = audio.duration;
    let newTime = (clickX / width) * duration;
    
    newTime = Math.max(0, Math.min(newTime, duration));

    if (isPcFsDragging) {
        pcFsDragProgress = newTime;
        if (pcFsProgressBar) pcFsProgressBar.style.width = `${(newTime / duration) * 100}%`;
        if (pcFsCurrentTime) pcFsCurrentTime.textContent = formatTime(newTime);
    } else {
        audio.currentTime = newTime;
    }
}

if (pcFsProgressBarContainer) {
    pcFsProgressBarContainer.addEventListener('mousedown', async (e) => {
        wasPlaying = isPlaying;
        isPcFsDragging = true;
        updatePcFsProgress(e);
    });
}



playBtn.addEventListener("click", window.togglePlay);


function updatePlayButton(playing) {
  const playIcon = playBtn.querySelector(".play-icon");
  const pauseIcon = playBtn.querySelector(".pause-icon");

  if (playing) {
    playIcon.style.display = "none";
    pauseIcon.style.display = "flex";
    
    if (isPcFullscreen) syncPcLyrics();
    
    if (document.getElementById("fsPlayIcon")) {
        document.getElementById("fsPlayIcon").setAttribute("data-lucide", "pause");
    }

    if (document.getElementById("pcFsPlayIcon")) {
        document.getElementById("pcFsPlayIcon").setAttribute("data-lucide", "pause");
        document.getElementById("pcFsPlayIcon").classList.remove("ml-1");
    }

  } else {
    playIcon.style.display = "flex";
    pauseIcon.style.display = "none";

    if (pcLyricsRafId) {
        cancelAnimationFrame(pcLyricsRafId);
        pcLyricsRafId = null;
    }

    if (document.getElementById("fsPlayIcon")) {
        document.getElementById("fsPlayIcon").setAttribute("data-lucide", "play");
    }

    if (document.getElementById("pcFsPlayIcon")) {
        document.getElementById("pcFsPlayIcon").setAttribute("data-lucide", "play");
        document.getElementById("pcFsPlayIcon").classList.add("ml-1");
    }
  }
  lucide.createIcons();
  lucide.createIcons();
}

function updatePcFsFavoriteBtn() {
    const pcFsFavoriteBtn = document.getElementById("pcFsFavoriteBtn");
    if (!pcFsFavoriteBtn) return;
    
    if (!queue || queue.length === 0 || !queue[currentSong]) return;
    
    const track = queue[currentSong];
    const isFav = isFavorite(track);
    const icon = pcFsFavoriteBtn.querySelector('svg') || pcFsFavoriteBtn.querySelector('i');
    
    if (isFav) {
        pcFsFavoriteBtn.classList.add('text-red-500');
        pcFsFavoriteBtn.classList.remove('text-white/40');
        if (icon) {
             icon.setAttribute('fill', 'currentColor');
             icon.setAttribute('stroke', 'currentColor');
             icon.classList.add("fill-current");
        }
    } else {
        pcFsFavoriteBtn.classList.remove('text-red-500');
        pcFsFavoriteBtn.classList.add('text-white/40');
        if (icon) {
             icon.setAttribute('fill', 'none');
             icon.setAttribute('stroke', 'currentColor');
             icon.classList.remove("fill-current");
        }
    }
    lucide.createIcons();
}

if (document.getElementById("pcFsFavoriteBtn")) {
    document.getElementById("pcFsFavoriteBtn").addEventListener('click', async (e) => {
        e.stopPropagation();
        if (queue && queue.length > 0 && queue[currentSong]) {
            await toggleFavorite(queue[currentSong]);
            updatePcFsFavoriteBtn();
        }
    });
}


window.playNextSong = function() {
  if (navigator.vibrate) navigator.vibrate(10);
  if (queue.length > 0) {
    if (isShuffle && queue.length > 1) {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * queue.length);
        } while (nextIndex === currentSong);
        playSongFromQueue(nextIndex);
    } else {
        playSongFromQueue((currentSong + 1) % queue.length);
    }
  }
};

window.playPrevSong = function() {
  if (navigator.vibrate) navigator.vibrate(10);
  if (queue.length > 0) {
    playSongFromQueue((currentSong - 1 + queue.length) % queue.length);
  }
};

nextBtn.addEventListener("click", window.playNextSong);
prevBtn.addEventListener("click", window.playPrevSong);

window.seek = function(percent) {
    if (audio.duration) {
        audio.currentTime = percent * audio.duration;
        if (typeof updateProgressBar === 'function') updateProgressBar();
    }
};

window.toggleShuffle = function() {
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
  
  if (shuffleBtn) {
      shuffleBtn.classList.add("text-blue-400");
      setTimeout(() => shuffleBtn.classList.remove("text-blue-400"), 200);
  }
  const fsShuffleBtn = document.getElementById("fsShuffleBtn");
  if (fsShuffleBtn) {
       fsShuffleBtn.classList.add("text-blue-400");
       setTimeout(() => fsShuffleBtn.classList.remove("text-blue-400"), 200);
  }
};

shuffleBtn.addEventListener("click", window.toggleShuffle);

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

    if (isMobileFullscreenOpen) {
        if (document.getElementById("fsCurrentTime")) {
             document.getElementById("fsCurrentTime").textContent = formatTime(audio.currentTime);
             document.getElementById("fsDuration").textContent = formatTime(audio.duration);
             const percent = (audio.currentTime / audio.duration) * 100;
             if (document.getElementById("fsProgressBar") && !isFsDragging) document.getElementById("fsProgressBar").style.width = `${percent}%`;
             if (document.getElementById("fsProgressThumb") && !isFsDragging) document.getElementById("fsProgressThumb").style.left = `${percent}%`;
        }
    }
    
    if (isPcFullscreen && pcFullscreenPlayer && !pcFullscreenPlayer.classList.contains('hidden')) {
        if (pcFsCurrentTime && !isPcFsDragging) pcFsCurrentTime.textContent = formatTime(audio.currentTime);
        if (pcFsDuration) pcFsDuration.textContent = formatTime(audio.duration);
        
        if (!isPcFsDragging) {
             const pcPercent = (audio.currentTime / audio.duration) * 100;
             if (pcFsProgressBar) pcFsProgressBar.style.width = `${pcPercent}%`;
        }
        
        if (pcFsAmLyricsElement && !lyricsRafId) {
        }
    }
    
  }
    updateDynamicStats();
});

audio.addEventListener("progress", () => {
  if (audio.duration && audio.buffered.length > 0) {
    const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
    const duration = audio.duration;
    if (duration > 0) {
        const width = `${(bufferedEnd / duration) * 100}%`;
        if (bufferBar) bufferBar.style.width = width;
        if (pcFsBufferBar) pcFsBufferBar.style.width = width;
        if (fsBufferBar) fsBufferBar.style.width = width;
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
  const newTime = Math.max(0, Math.min(duration, (clickX / width) * duration));

  if (isDragging) {
    dragProgress = newTime;
    progressBar.style.width = `${(newTime / duration) * 100}%`;
    currentTimeEl.textContent = formatTime(newTime); 
  } else {
    audio.currentTime = newTime;
  }
}

progressContainer.addEventListener("mousedown", async (e) => {
  wasPlaying = isPlaying;
  isDragging = true;
  updateProgress(e);
});

if (pcFsProgressBarContainer) {
    pcFsProgressBarContainer.addEventListener("mousedown", (e) => {
        isPcFsDragging = true;
        updatePcFsProgress(e);
    });
}

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    updateProgress(e);
  }
  if (isPcFsDragging) {
    updatePcFsProgress(e);
  }
  if (isFsDragging) {
    updateFsProgress(e);
  }
});

document.addEventListener("mouseup", async () => {
  if (isDragging) {
    audio.currentTime = dragProgress;
    isDragging = false;
  }
  if (isPcFsDragging) {
      audio.currentTime = pcFsDragProgress;
      isPcFsDragging = false;
  }
  if (isFsDragging) {
      audio.currentTime = fsDragProgress;
      isFsDragging = false;
      if (wasPlaying) {
          await fadeVolume(volumeSlider.value, 100);
      }
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
    "group relative flex flex-col text-left cursor-pointer p-3 rounded-xl transition-all duration-200 hover:bg-white/5";
  card.dataset.playlistIndex = index;
  let imageUrl = "https://placehold.co/320x320/1f2937/ffffff?text=Playlist";
  if (playlist.image) {
      imageUrl = `${IMAGE_API_BASE}${playlist.image.split("-").join("/")}/320x320.jpg`;
  } else if (playlist.tracks && playlist.tracks.length > 0 && playlist.tracks[0].album && playlist.tracks[0].album.cover) {
       imageUrl = `${IMAGE_API_BASE}${playlist.tracks[0].album.cover.split("-").join("/")}/320x320.jpg`;
  } else if (playlist.squareImage) {
      imageUrl = `${IMAGE_API_BASE}${playlist.squareImage.split("-").join("/")}/320x320.jpg`;
  }

  card.innerHTML = `
        <div class="relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-gray-900 shadow-lg group-hover:shadow-2xl transition-all duration-300">
            <img src="${imageUrl}" alt="${playlist.title}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button class="play-playlist-btn text-white drop-shadow-lg transform scale-90 hover:scale-100 transition-transform" title="Play Playlist">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"></polygon></svg>
                </button>
            </div>
        </div>
        
        <h3 class="truncate text-base font-medium text-white group-hover:text-blue-400 transition-colors">${playlist.title}</h3>
        <p class="truncate text-sm text-gray-400 mt-0.5">${playlist.tracks.length} tracks</p>
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
    card.className = "group flex flex-col text-left cursor-pointer p-3 rounded-xl transition-all duration-200 hover:bg-white/5";
    
    card.innerHTML = `
        <div class="relative mb-3 aspect-square w-full flex items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/30 transition-colors group-hover:border-blue-500/50 group-hover:bg-gray-800/50 group-hover:shadow-lg">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
        </div>
        <h3 class="truncate text-base font-medium text-gray-300 group-hover:text-white transition-colors">Create New</h3>
        <p class="truncate text-sm text-gray-500 mt-0.5">Add a playback list</p>
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
    
    page.classList.add("translate-y-full");
    setTimeout(() => {
        page.classList.add("hidden");
    }, 300);
    
    document.body.style.overflow = ""; 
    document.documentElement.style.overflow = "";
}

async function showAlbumPage(album) {
    const page = document.getElementById("albumPage");
    
    page.classList.remove("hidden");
    requestAnimationFrame(() => {
        page.classList.remove("translate-y-full");
    });

    document.body.style.overflow = "hidden"; 
    document.documentElement.style.overflow = "hidden";

    document.getElementById("albumPageTitle").textContent = album.title;
    document.getElementById("albumPageArtist").textContent = album.artists ? album.artists[0]?.name : "Unknown Artist";
    document.getElementById("albumPageYear").textContent = album.releaseDate ? album.releaseDate.split("-")[0] : "";
    document.getElementById("albumPageCount").textContent = "Loading...";
    document.getElementById("albumPageDuration").textContent = "...";
    document.getElementById("albumTracksGrid").innerHTML = createSkeletonLoaders(1);

    let imageUrl = "https://placehold.co/320x320?text=No+Cover";
    if (album.cover) {
         imageUrl = `${IMAGE_API_BASE}${album.cover.split("-").join("/")}/320x320.jpg`;
    }
    document.getElementById("albumPageImage").src = imageUrl;
    


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
    currentAlbumTracks = tracks || [];
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
        const trackNum = track.trackNumber || (index + 1);
        const card = createTrackCard(track, index, tracks, { showIndex: true, trackNumber: trackNum });
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

window.showAlbumPage = showAlbumPage;
window.showArtistPage = showArtistPage;
window.playAlbumContext = playAlbumContext;



let currentPlaylistIndex = null;
let playlistEditMode = false;
let playlistSortable = null;

function showPlaylistPage(playlist, index) {
    currentPlaylistIndex = index;
    playlistEditMode = false;
    
    const page = document.getElementById("playlistPage");
    page.classList.remove("hidden");
    
    requestAnimationFrame(() => {
        page.classList.remove("translate-y-full");
    });

    document.getElementById("playlistPageTitle").textContent = playlist.title;
    document.getElementById("playlistPageCount").textContent = `${playlist.tracks.length} tracks`;

    const totalDuration = playlist.tracks.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    document.getElementById("playlistPageDuration").textContent = formatTime(totalDuration);

    let imageUrl = "https://placehold.co/320x320/1f2937/ffffff?text=Playlist";
    if (playlist.image) {
        imageUrl = `${IMAGE_API_BASE}${playlist.image.split("-").join("/")}/320x320.jpg`;
    } else if (playlist.tracks && playlist.tracks.length > 0 && playlist.tracks[0].album && playlist.tracks[0].album.cover) {
         imageUrl = `${IMAGE_API_BASE}${playlist.tracks[0].album.cover.split("-").join("/")}/320x320.jpg`;
    }
    document.getElementById("playlistPageImage").src = imageUrl;

    renderPlaylistTracks(playlist, index, false);

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

    const editBtn = document.getElementById("editPlaylistBtn");
    const newEditBtn = editBtn.cloneNode(true);
    editBtn.parentNode.replaceChild(newEditBtn, editBtn);

    newEditBtn.addEventListener("click", () => {
        playlistEditMode = !playlistEditMode;
        renderPlaylistTracks(userPlaylists[index], index, playlistEditMode);

        const icon = newEditBtn.querySelector('i');
        if (playlistEditMode) {
            newEditBtn.innerHTML = `<i data-lucide="check" style="width: 18px; height: 18px"></i> Done`;
            newEditBtn.classList.remove('bg-gray-700', 'hover:bg-gray-600');
            newEditBtn.classList.add('bg-green-600', 'hover:bg-green-500');
        } else {
            newEditBtn.innerHTML = `<i data-lucide="pencil" style="width: 18px; height: 18px"></i> Edit`;
            newEditBtn.classList.remove('bg-green-600', 'hover:bg-green-500');
            newEditBtn.classList.add('bg-gray-700', 'hover:bg-gray-600');
        }
        lucide.createIcons();
    });

    if(document.getElementById("artistPage")) document.getElementById("artistPage").classList.add("hidden");
    page.classList.remove("hidden");
    lucide.createIcons();
}

function renderPlaylistTracks(playlist, playlistIndex, editMode) {
    const grid = document.getElementById("playlistTracksGrid");
    grid.innerHTML = "";
    if (playlistSortable) {
        playlistSortable.destroy();
        playlistSortable = null;
    }
    
    if (!playlist.tracks || playlist.tracks.length === 0) {
        grid.innerHTML = `<p class="text-gray-400 text-center py-8">No tracks in this playlist yet.</p>`;
        return;
    }

    if (editMode) {
        const toolbar = document.createElement('div');
        toolbar.className = 'flex items-center justify-between mb-6 p-4 bg-gray-900/80 backdrop-blur-md rounded-xl border border-white/10 shadow-xl sticky top-0 z-30 ring-1 ring-white/5';
        toolbar.innerHTML = `
            <div class="flex items-center gap-3">
                <input type="checkbox" id="selectAllTracks" class="w-5 h-5 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900 transition-colors">
                <label for="selectAllTracks" class="text-sm font-medium text-gray-300 hover:text-white cursor-pointer select-none">Select all</label>
            </div>
            <button id="deleteSelectedTracks" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500/10" disabled>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="M19,6v14a2,2,0,0,1,-2,2H7a2,2,0,0,1,-2,-2V6m3,0V4a2,2,0,0,1,2,-2h4a2,2,0,0,1,2,2v2"></path>
                </svg>
                Delete selected
            </button>
        `;
        grid.appendChild(toolbar);
        toolbar.querySelector('#selectAllTracks').addEventListener('change', (e) => {
            const checkboxes = grid.querySelectorAll('.track-checkbox');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
            updateDeleteButtonState();
        });

        toolbar.querySelector('#deleteSelectedTracks').addEventListener('click', async () => {
            const checkboxes = grid.querySelectorAll('.track-checkbox:checked');
            const indicesToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.trackIndex, 10)).sort((a, b) => b - a);
            
            if (indicesToDelete.length === 0) return;
            
            if (confirm(`Delete ${indicesToDelete.length} track(s) from this playlist?`)) {
                for (const idx of indicesToDelete) {
                    await deleteTrackFromPlaylistSilent(playlistIndex, idx);
                }
                renderPlaylistTracks(userPlaylists[playlistIndex], playlistIndex, true);
                document.getElementById("playlistPageCount").textContent = `${userPlaylists[playlistIndex].tracks.length} tracks`;
                const totalDuration = userPlaylists[playlistIndex].tracks.reduce((acc, curr) => acc + (curr.duration || 0), 0);
                document.getElementById("playlistPageDuration").textContent = formatTime(totalDuration);
            }
        });
    }

    const trackContainer = document.createElement('div');
    trackContainer.id = 'playlistTrackContainer';
    trackContainer.className = 'flex flex-col gap-1';
    grid.appendChild(trackContainer);

    playlist.tracks.forEach((track, trackIndex) => {
        const card = document.createElement('div');
        card.className = `group flex w-full items-center gap-4 rounded-xl p-3 transition-all border cursor-pointer ${track.id === currentPlayingTrackId ? 'border-blue-500/50 bg-blue-900/20' : 'border-transparent hover:border-white/5 hover:bg-white/5'}`;
        card.dataset.trackId = track.id;
        card.dataset.trackIndex = trackIndex;

        const imageUrl = `${IMAGE_API_BASE}${track.album.cover.split("-").join("/")}/320x320.jpg`;
        const isCurrentlyPlaying = track.id === currentPlayingTrackId;
        const isFav = isFavorite(track);

        if (editMode) {
            card.innerHTML = `
                <input type="checkbox" class="track-checkbox w-5 h-5 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900 ml-2" data-track-index="${trackIndex}">
                <div class="drag-handle cursor-grab p-2 text-gray-500 hover:text-white transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="8" y1="6" x2="16" y2="6"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                        <line x1="8" y1="18" x2="16" y2="18"></line>
                    </svg>
                </div>
                <div class="flex-shrink-0 w-8 text-center font-mono">
                    <span class="text-sm ${isCurrentlyPlaying ? 'text-blue-400 font-bold' : 'text-gray-500'}">${trackIndex + 1}</span>
                </div>
                <img src="${imageUrl}" alt="${track.title}" class="h-16 w-16 rounded-lg object-cover shadow-lg">
                <div class="min-w-0 flex-1">
                    <h3 class="truncate font-medium text-base ${isCurrentlyPlaying ? 'text-blue-400' : 'text-white'}">${track.title}</h3>
                    <p class="truncate text-sm text-gray-400 mt-0.5">${track.artist.name}</p>
                </div>
                <span class="text-sm text-gray-500 font-mono tracking-tighter">${formatTime(track.duration || 0)}</span>
            `;
            
            card.querySelector('.track-checkbox').addEventListener('change', updateDeleteButtonState);
            card.querySelector('.track-checkbox').onclick = (e) => e.stopPropagation();
            card.querySelector('.drag-handle').onclick = (e) => e.stopPropagation();
        } else {
            card.innerHTML = `
                <div class="flex-shrink-0 w-10 text-center font-mono">
                    <span class="track-number text-sm ${isCurrentlyPlaying ? 'text-blue-400 font-bold' : 'text-gray-500'} group-hover:hidden">${trackIndex + 1}</span>
                    <svg class="play-icon hidden group-hover:block mx-auto text-white drop-shadow-md" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21"></polygon>
                    </svg>
                </div>
                <img src="${imageUrl}" alt="${track.title}" class="h-16 w-16 rounded-lg object-cover shadow-lg group-hover:shadow-2xl transition-shadow">
                <div class="min-w-0 flex-1">
                    <h3 class="truncate font-medium text-base ${isCurrentlyPlaying ? 'text-blue-400' : 'text-white group-hover:text-blue-400'} transition-colors">${track.title}</h3>
                    <a class="artist-link cursor-pointer truncate text-sm text-gray-400 hover:text-white hover:underline inline-block mt-0.5 transition-colors relative z-10">${
                      track.artist.name
                    }</a>
                    <div class="flex items-center text-xs text-gray-500 mt-1 gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <a class="album-link truncate hover:text-white hover:underline cursor-pointer transition-colors relative z-10">${track.album.title}</a>
                        <span class="flex-shrink-0 w-1 h-1 rounded-full bg-gray-600"></span>
                        <span class="flex-shrink-0 border border-gray-700 rounded px-1 text-[0.6rem] leading-none py-0.5 text-gray-400">LOSSLESS</span>
                    </div>
                </div>
                
                <div class="flex items-center gap-2 text-sm text-gray-400">
                    <div class="relative sm:hidden">
                        <button class="mobile-context-btn rounded-full p-2 text-gray-400 transition-colors hover:text-white" title="Options" onclick="showTrackContextMenu(event, '${track.id}')">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="19" cy="12" r="1"></circle>
                                <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                        </button>
                    </div>

                    <div class="hidden sm:flex items-center gap-2">
                        <button class="favorite-btn rounded-full p-2 transition-colors ${isFav ? 'text-red-400' : 'text-gray-400'} hover:text-red-400" title="${isFav ? 'remove from favorites' : 'add to favorites'}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>
                        
                        <button class="context-menu-btn rounded-full p-2 text-gray-400 transition-colors hover:text-white" title="Current track options" onclick="showTrackContextMenu(event, '${track.id}')">
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="19" cy="12" r="1"></circle>
                                <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                        </button>
                    </div>
                    <span class="text-sm text-gray-400">${formatTime(track.duration || 0)}</span>
                </div>
            `;
            
            card.addEventListener("click", (e) => {
                e.stopPropagation();
                playSong(trackIndex, playlist.tracks);
            });



             const favBtn = card.querySelector(".favorite-btn");
             if (favBtn) {
                 favBtn.addEventListener("click", async (e) => {
                     e.stopPropagation();
                     await toggleFavorite(track);
                     renderPlaylistTracks(userPlaylists[playlistIndex], playlistIndex, false);
                 });
             }


            const artistLink = card.querySelector(".artist-link");
            if (artistLink) {
                artistLink.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (track.artist && track.artist.id) {
                        showArtistPage(track.artist.id);
                    }
                });
            }

            const albumLink = card.querySelector(".album-link");
            if (albumLink) {
                albumLink.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (track.album && track.album.id) {
                        showAlbumPage(track.album); 
                    }
                });
            }
        }
        
        trackContainer.appendChild(card);
    });

    if (editMode && typeof Sortable !== 'undefined') {
        playlistSortable = new Sortable(trackContainer, {
            animation: 150,
            handle: '.drag-handle',
            ghostClass: 'opacity-50',
            onEnd: async function(evt) {
                const oldIndex = evt.oldIndex;
                const newIndex = evt.newIndex;
                
                if (oldIndex !== newIndex) {
                    await reorderPlaylistTrack(playlistIndex, oldIndex, newIndex);
                    renderPlaylistTracks(userPlaylists[playlistIndex], playlistIndex, true);
                }
            }
        });
    }
}

function updateDeleteButtonState() {
    const deleteBtn = document.getElementById('deleteSelectedTracks');
    const checkboxes = document.querySelectorAll('.track-checkbox:checked');
    if (deleteBtn) {
        deleteBtn.disabled = checkboxes.length === 0;
    }
}

async function deleteTrackFromPlaylistSilent(playlistIndex, trackIndex) {
    if (!currentUser || playlistIndex < 0 || playlistIndex >= userPlaylists.length) return;

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
        await updateDoc(docRef, { playlists: arrayRemove(playlist) });
        await updateDoc(docRef, { playlists: arrayUnion(updatedPlaylist) });
        userPlaylists[playlistIndex] = updatedPlaylist;
    } catch (error) {
        console.error("Error removing track from playlist:", error);
    }
}

async function reorderPlaylistTrack(playlistIndex, oldIndex, newIndex) {
    if (!currentUser || playlistIndex < 0 || playlistIndex >= userPlaylists.length) return;

    const playlist = userPlaylists[playlistIndex];
    if (!playlist || !playlist.tracks) return;

    const updatedTracks = [...playlist.tracks];
    const [movedTrack] = updatedTracks.splice(oldIndex, 1);
    updatedTracks.splice(newIndex, 0, movedTrack);

    const updatedPlaylist = {
        ...playlist,
        tracks: updatedTracks,
        lastUpdated: new Date().toISOString(),
    };

    try {
        const docRef = doc(window.db, "playlists", currentUser.uid);
        await updateDoc(docRef, { playlists: arrayRemove(playlist) });
        await updateDoc(docRef, { playlists: arrayUnion(updatedPlaylist) });
        userPlaylists[playlistIndex] = updatedPlaylist;
    } catch (error) {
        console.error("Error reordering playlist:", error);
    }
}

function closePlaylistPage() {
    const page = document.getElementById("playlistPage");
    
    page.classList.add("translate-y-full");
    setTimeout(() => {
        page.classList.add("hidden");
    }, 300);
}

document.getElementById("closePlaylistPageBtn").addEventListener("click", closePlaylistPage);


const artistPage = document.getElementById("artistPage");
const closeArtistPageBtn = document.getElementById("closeArtistPageBtn");
const artistPageImage = document.getElementById("artistPageImage");
const artistPageName = document.getElementById("artistPageName");
const artistPageRoles = document.getElementById("artistPageRoles");
const artistTopTracksGrid = document.getElementById("artistTopTracksGrid");
const artistDiscographyGrid = document.getElementById("artistDiscographyGrid");

const artistDiscographyPagination = document.getElementById("artistDiscographyPagination");
const artistTopTracksPagination = document.getElementById("artistTopTracksPagination");

let currentArtistAlbums = [];
let currentDiscographyPage = 1;
const DISCOGRAPHY_ITEMS_PER_PAGE = 10;

let currentArtistTopTracks = []; 
let currentTopTracksPage = 1;    
const TOP_TRACKS_ITEMS_PER_PAGE = 10; 

let currentArtistId = null;

async function showArtistPage(artistId) {
    currentArtistId = artistId;
    artistPage.classList.remove("hidden");
    
    requestAnimationFrame(() => {
        artistPage.classList.remove("translate-y-full");
    });

    document.body.style.overflow = "hidden"; 
    document.documentElement.style.overflow = "hidden"; 

    artistPageName.textContent = "Loading...";
    artistPageImage.src = "https://placehold.co/320x320?text=Loading";
    artistPageRoles.innerHTML = "";
    artistTopTracksGrid.innerHTML = createSkeletonLoaders(1);
    artistTopTracksPagination.innerHTML = "";
    artistDiscographyGrid.innerHTML = createSkeletonLoaders(1);

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
    artistPage.classList.add("translate-y-full");
    setTimeout(() => {
        artistPage.classList.add("hidden");
    }, 300);
    
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
        
        if ((obj.type === 'ALBUM' || (obj.numberOfTracks && obj.releaseDate)) && obj.title && obj.cover) {
            if (!albums.some(a => a.id === obj.id)) {
                albums.push(obj);
            }
        }

        Object.values(obj).forEach(scan);
    };

    scan(data);

    if (!artist && Array.isArray(data) && data[0]) artist = data[0]; 
    if(!artist) throw new Error("Artist not found in response");

    tracks.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    albums.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

    return {
        ...artist,
        topTracks: tracks,
        albums: albums
    };
}

function renderArtistPage(artist) {
    console.log(artist)
    artistTopTracksInfo.textContent = `Best songs from ${artist.name}.`;
    artistPageName.textContent = artist.name;
    const imgContainer = artistPageImage.parentElement;
    const existingIcon = imgContainer.querySelector(".artist-placeholder-icon");
    
    if (artist.picture) {
        artistPageImage.classList.remove("hidden");
        if (existingIcon) existingIcon.remove();
        artistPageImage.src = `${IMAGE_API_BASE}${artist.picture.split("-").join("/")}/320x320.jpg`;
    } else {
        artistPageImage.classList.add("hidden");
        if (!existingIcon) {
            const iconDiv = document.createElement("div");
            iconDiv.className = "artist-placeholder-icon h-full w-full flex items-center justify-center bg-gray-800 text-gray-500";
            iconDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
            imgContainer.appendChild(iconDiv);
        }
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

    if (artist.topTracks.length === 0) {
        artistTopTracksGrid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No top tracks available.</div>';
    } else {
        artist.topTracks.forEach(track => {
             if (!track.artist) track.artist = { id: artist.id, name: artist.name };
        });
        renderTopTracks(artist.topTracks);
    }

    renderDiscography(artist.albums);
}

function renderDiscography(albums) {
    currentArtistAlbums = albums || [];
    currentDiscographyPage = 1;
    updateDiscographyView();
}

function updateDiscographyView() {
    artistDiscographyGrid.innerHTML = "";
    artistDiscographyPagination.innerHTML = "";

    if (currentArtistAlbums.length === 0) {
        artistDiscographyGrid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No albums found.</div>';
        return;
    }

    const totalPages = Math.ceil(currentArtistAlbums.length / DISCOGRAPHY_ITEMS_PER_PAGE);
    
    if (currentDiscographyPage > totalPages) currentDiscographyPage = totalPages;
    if (currentDiscographyPage < 1) currentDiscographyPage = 1;

    const start = (currentDiscographyPage - 1) * DISCOGRAPHY_ITEMS_PER_PAGE;
    const end = start + DISCOGRAPHY_ITEMS_PER_PAGE;
    const pageAlbums = currentArtistAlbums.slice(start, end);

    pageAlbums.forEach(album => {
        const card = createAlbumCard(album, "flex-shrink-0 w-44 md:w-auto snap-start");
        artistDiscographyGrid.appendChild(card);
    });

    if (totalPages > 1) {
        renderPaginationControls(totalPages);
    }
}

function renderPaginationControls(totalPages) {
    artistDiscographyPagination.innerHTML = "";
    
    const createButton = (text, page, isActive = false, isDisabled = false) => {
        const btn = document.createElement("button");
        btn.className = `flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            isActive 
                ? "bg-blue-600 text-white" 
                : "text-gray-400 hover:bg-white/10 hover:text-white"
        } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`;
        
        btn.textContent = text;
        
        if (!isDisabled && !isActive) {
            btn.addEventListener("click", () => {
                currentDiscographyPage = page;
                updateDiscographyView();
            });
        }
        
        return btn;
    };

    const createIconBtn = (iconName, page, isDisabled) => {
        const btn = document.createElement("button");
        btn.className = `flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`;
        btn.innerHTML = `<i data-lucide="${iconName}" style="width: 16px; height: 16px;"></i>`;
        
        if (!isDisabled) {
             btn.addEventListener("click", () => {
                currentDiscographyPage = page;
                updateDiscographyView();
            });
        }
        return btn;
    };

    artistDiscographyPagination.appendChild(createIconBtn("chevron-left", currentDiscographyPage - 1, currentDiscographyPage === 1));

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentDiscographyPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        artistDiscographyPagination.appendChild(createButton("1", 1));
        if (startPage > 2) {
             const ellipsis = document.createElement("span");
             ellipsis.className = "flex h-8 w-8 items-center justify-center text-gray-600";
             ellipsis.textContent = "...";
             artistDiscographyPagination.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        artistDiscographyPagination.appendChild(createButton(i.toString(), i, i === currentDiscographyPage));
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
             const ellipsis = document.createElement("span");
             ellipsis.className = "flex h-8 w-8 items-center justify-center text-gray-600";
             ellipsis.textContent = "...";
             artistDiscographyPagination.appendChild(ellipsis);
        }
        artistDiscographyPagination.appendChild(createButton(totalPages.toString(), totalPages));
    }

    artistDiscographyPagination.appendChild(createIconBtn("chevron-right", currentDiscographyPage + 1, currentDiscographyPage === totalPages));
    
    lucide.createIcons();
}

function renderTopTracks(tracks) {
    currentArtistTopTracks = tracks || [];
    currentTopTracksPage = 1;
    updateTopTracksView();
}

function updateTopTracksView() {
    artistTopTracksGrid.innerHTML = "";
    artistTopTracksPagination.innerHTML = "";

    if (currentArtistTopTracks.length === 0) {
        artistTopTracksGrid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No top tracks available.</div>';
        return;
    }

    const totalPages = Math.ceil(currentArtistTopTracks.length / TOP_TRACKS_ITEMS_PER_PAGE);
    
    if (currentTopTracksPage > totalPages) currentTopTracksPage = totalPages;
    if (currentTopTracksPage < 1) currentTopTracksPage = 1;

    const start = (currentTopTracksPage - 1) * TOP_TRACKS_ITEMS_PER_PAGE;
    const end = start + TOP_TRACKS_ITEMS_PER_PAGE;
    const pageTracks = currentArtistTopTracks.slice(start, end);

    pageTracks.forEach((track, index) => {
        if (!track.artist && currentArtistId) {
        }
        const globalIndex = start + index;
        const trackNumber = globalIndex + 1;
        
        const card = createTrackCard(track, index, pageTracks, { showIndex: true, trackNumber: trackNumber });
        artistTopTracksGrid.appendChild(card);
    });

    if (totalPages > 1) {
        renderTopTracksPaginationControls(totalPages);
    }
}

function renderTopTracksPaginationControls(totalPages) {
    artistTopTracksPagination.innerHTML = "";
    
    const createButton = (text, page, isActive = false, isDisabled = false) => {
        const btn = document.createElement("button");
        btn.className = `flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            isActive 
                ? "bg-blue-600 text-white" 
                : "text-gray-400 hover:bg-white/10 hover:text-white"
        } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`;
        
        btn.textContent = text;
        
        if (!isDisabled && !isActive) {
            btn.addEventListener("click", () => {
                currentTopTracksPage = page;
                updateTopTracksView();
            });
        }
        
        return btn;
    };

    const createIconBtn = (iconName, page, isDisabled) => {
        const btn = document.createElement("button");
        btn.className = `flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`;
        btn.innerHTML = `<i data-lucide="${iconName}" style="width: 16px; height: 16px;"></i>`;
        
        if (!isDisabled) {
             btn.addEventListener("click", () => {
                currentTopTracksPage = page;
                updateTopTracksView();
            });
        }
        return btn;
    };
    const addEllipsis = () => {
         const ellipsis = document.createElement("span");
         ellipsis.className = "flex h-8 w-8 items-center justify-center text-gray-600";
         ellipsis.textContent = "...";
         artistTopTracksPagination.appendChild(ellipsis);
    };

    artistTopTracksPagination.appendChild(createIconBtn("chevron-left", currentTopTracksPage - 1, currentTopTracksPage === 1));

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentTopTracksPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        artistTopTracksPagination.appendChild(createButton("1", 1));
        if (startPage > 2) addEllipsis();
    }

    for (let i = startPage; i <= endPage; i++) {
        artistTopTracksPagination.appendChild(createButton(i.toString(), i, i === currentTopTracksPage));
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) addEllipsis();
        artistTopTracksPagination.appendChild(createButton(totalPages.toString(), totalPages));
    }

    artistTopTracksPagination.appendChild(createIconBtn("chevron-right", currentTopTracksPage + 1, currentTopTracksPage === totalPages));
    
    lucide.createIcons();
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
    await PlayerActions.deletePlaylist(window.db, currentUser, playlist);

    userPlaylists.splice(index, 1);
    displayMyPlaylists();
  } catch (error) {
    console.error("Error deleting playlist:", error);
  }
}

window.showCreatePlaylistModal = showCreatePlaylistModal;

function showCreatePlaylistModal() {
  const modalHTML = `
    <div id="createPlaylistModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full ring-1 ring-white/5 transform transition-all scale-100 opacity-100">
        <div class="flex items-center justify-between p-5 border-b border-white/10">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <i data-lucide="list-plus" class="w-5 h-5 text-blue-400"></i>
            Create New Playlist
          </h3>
          <button id="closeCreateModal" class="p-2 -mr-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
        <div class="p-6">
          <form id="createPlaylistForm" class="space-y-5">
            <div>
              <label for="playlistTitle" class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Playlist Name</label>
              <input type="text" id="playlistTitle" name="title" required 
                     class="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                     placeholder="My Awesome Playlist">
            </div>
            <div>
              <label for="playlistDescription" class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description (optional)</label>
              <textarea id="playlistDescription" name="description" rows="3"
                        class="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                        placeholder="What's the vibe?"></textarea>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" id="cancelCreateBtn" class="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
              <button type="submit" class="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-95">Create Playlist</button>
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
  try {
    const newPlaylist = await PlayerActions.createPlaylist(window.db, currentUser, title, description);
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

  try {
      const updatedPlaylist = await PlayerActions.addTrackToPlaylist(window.db, currentUser, playlist, track);
      userPlaylists[playlistIndex] = updatedPlaylist;
      console.log(`Added "${track.title}" to "${playlist.title}"`);
  } catch (error) {
      if (error.message === "Track already in playlist") {
          alert("This track is already in the playlist!");
      } else {
          console.error("Error adding track to playlist:", error);
      }
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
  try {
     const isAdded = await PlayerActions.toggleFavorite(window.db, currentUser, favorites, track);
     
     if (isAdded) {
         favorites.push(track);
     } else {
         const index = favorites.findIndex((fav) => fav.id === track.id);
         if (index > -1) favorites.splice(index, 1);
     }
  } catch (error) {
    console.error("Error updating favorites:", error);
  }
}

function getTrackById(id) {
    if (!id) return null;
    if (typeof currentList !== 'undefined' && currentList) {
        const found = currentList.find(t => t.id == id);
        if (found) return found;
    }
    if (typeof queue !== 'undefined' && queue) {
         const found = queue.find(t => t.id == id);
         if (found) return found;
    }
    if (typeof favorites !== 'undefined' && favorites) {
         const found = favorites.find(t => t.id == id);
         if (found) return found;
    }
    if (typeof currentArtistTopTracks !== 'undefined' && currentArtistTopTracks) {
         const found = currentArtistTopTracks.find(t => t.id == id);
         if (found) return found;
    }
    if (typeof currentAlbumTracks !== 'undefined' && currentAlbumTracks) {
         const found = currentAlbumTracks.find(t => t.id == id);
         if (found) return found;
    }
    return null;
}

window.getTrackById = getTrackById;
window.toggleFavorite = toggleFavorite;
window.addToQueue = addToQueue;
window.showAddToPlaylistModal = showAddToPlaylistModal;
window.isFavorite = isFavorite;

function fadeVolume(targetVolume, duration = 300) {
  return new Promise((resolve) => {
    if (!gainNode) {
      resolve();
      return;
    }

    if (document.hidden) {
        gainNode.gain.value = targetVolume;
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
  return Array(count).fill(0).map(() => `
    <div class="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5">
        <div class="h-16 w-16 rounded-lg animate-shimmer flex-shrink-0"></div>
        <div class="flex-1 min-w-0 space-y-2">
            <div class="h-4 w-3/4 rounded animate-shimmer"></div>
            <div class="h-3 w-1/2 rounded animate-shimmer"></div>
        </div>
        <div class="h-4 w-12 rounded animate-shimmer"></div>
    </div>
  `).join('');
}


function startLyricsSync() {
    if (lyricsRafId) cancelAnimationFrame(lyricsRafId);
    
    function sync() {
        if (!audio.paused) {
            const time = audio.currentTime * 1000;
            if (amLyricsElement) {
                amLyricsElement.currentTime = time;
            }
            if (mobileAmLyrics && isMobileFullscreenOpen && isMobileLyricsOpen) {
                mobileAmLyrics.currentTime = time;
            }
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
    if (!amLyricsContainer.classList.contains('hidden') || isNpModalOpen) {
        startLyricsSync();
    }
});


const isNpModalOpen = false;


function showAddToPlaylistModal(song) {
    const modalId = 'tempPlaylistModal';
    const existingModal = document.getElementById(modalId);
    if (existingModal) existingModal.remove();

    const playlists = userPlaylists; 
    
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = "fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4";
    modal.innerHTML = `
        <div class="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-sm overflow-hidden shadow-2xl">
            <div class="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 class="text-white font-semibold">Add to Playlist</h3>
                <button id="closeTempModal" class="text-gray-400 hover:text-white">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <div class="max-h-[60vh] overflow-y-auto p-2 space-y-1">
                ${playlists.length === 0 ? '<div class="p-4 text-center text-gray-500 text-sm">No playlists found</div>' : ''}
                ${playlists.map((pl, idx) => `
                    <button class="w-full text-left p-3 rounded-lg hover:bg-white/10 flex items-center gap-3 group transition-colors" data-idx="${idx}">
                        <div class="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-500 group-hover:text-white">
                            <i data-lucide="music-2" class="w-5 h-5"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="text-gray-200 font-medium truncate group-hover:text-white">${pl.title}</div>
                            <div class="text-xs text-gray-500">${pl.tracks ? pl.tracks.length : 0} tracks</div>
                        </div>
                    </button>
                `).join('')}
                
                <button id="createNewPlBtn" class="w-full text-left p-3 rounded-lg hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 flex items-center gap-3 transition-colors mt-2">
                    <div class="w-10 h-10 rounded border border-dashed border-blue-500/50 flex items-center justify-center">
                        <i data-lucide="plus" class="w-5 h-5"></i>
                    </div>
                    <span class="font-medium">Create New Playlist</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    lucide.createIcons();

    const closeBtn = modal.querySelector('#closeTempModal');
    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => { if(e.target === modal) modal.remove(); };

    modal.querySelectorAll('button[data-idx]').forEach(btn => {
        btn.onclick = async () => {
            const idx = parseInt(btn.dataset.idx);
            
            
            try {
               const playlist = userPlaylists[idx];
               const updatedPlaylist = await PlayerActions.addTrackToPlaylist(window.db, currentUser, playlist, song);
               userPlaylists[idx] = updatedPlaylist;
               alert(`Added to ${playlist.title}`);
            } catch (err) {
                if (err.message === "Track already in playlist") {
                    alert("Song already in playlist!");
                } else {
                    console.error("Error adding to playlist:", err);
                    alert("Failed to add to playlist");
                }
            }
            modal.remove();
        };
    });

    modal.querySelector('#createNewPlBtn').onclick = () => {
        modal.remove();
        if (typeof showCreatePlaylistModal === 'function') {
            showCreatePlaylistModal();
        } else {
            const title = prompt("Enter playlist name:");
            if (title && currentUser) {
                 alert("Please implement full Create Playlist logic."); 
            }
        }
    };
}





let userSettings = {
    quality: 'High',
    crossfadeEnabled: false,
    crossfadeDuration: 0,
    statsEnabled: false,
    equalizerPreset: 'Flat'
};

function loadSettings() {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
        userSettings = { ...userSettings, ...JSON.parse(saved) };
    }
    applySettingsUI();
}

function saveSettings() {
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
    if (typeof fadeDuration !== 'undefined') {
        window.fadeDuration = userSettings.crossfadeEnabled ? userSettings.crossfadeDuration : 0;
    }
}

function applySettingsUI() {
    const qualityLabel = document.getElementById('settingsQualityLabel');
    if (qualityLabel) {
        qualityLabel.textContent = userSettings.quality;
        if (userSettings.quality === 'High') qualityLabel.className = "text-xs font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5";
        if (userSettings.quality === 'Lossless') qualityLabel.className = "text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20";
        if (userSettings.quality === 'Hi-Res') qualityLabel.className = "text-xs font-mono text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20";
    }

    if (settingsCrossfadeToggle) settingsCrossfadeToggle.checked = userSettings.crossfadeEnabled;
    if (settingsCrossfadeSlider) settingsCrossfadeSlider.value = userSettings.crossfadeDuration;
    if (settingsCrossfadeInput) settingsCrossfadeInput.value = userSettings.crossfadeDuration;

    
    updateCrossfadeState();
}

function updateCrossfadeState() {
    if (!settingsCrossfadeToggle) return;
    const isEnabled = settingsCrossfadeToggle.checked;
    settingsCrossfadeSlider.disabled = !isEnabled;
    settingsCrossfadeInput.disabled = !isEnabled;
    
    settingsCrossfadeSlider.style.opacity = isEnabled ? '1' : '0.5';
    settingsCrossfadeInput.style.opacity = isEnabled ? '1' : '0.5';
    settingsCrossfadeSlider.style.pointerEvents = isEnabled ? 'auto' : 'none';
}



if (openSettingsBtn && settingsDropdown) {

    openSettingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = settingsDropdown.classList.contains('hidden');
        
        if (isHidden) {
            settingsDropdown.classList.remove('hidden');

            requestAnimationFrame(() => {
                settingsDropdown.classList.remove('scale-95', 'opacity-0');
                settingsDropdown.classList.add('scale-100', 'opacity-100');
            });
            
            if (currentUser) {
                if (settingsPcUsername) settingsPcUsername.textContent = currentUser.displayName || "User";
                if (settingsPcEmail) settingsPcEmail.textContent = currentUser.email || "Free Account";
            }
        } else {
            closeSettingsDropdown();
        }
    });

    settingsDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
        if (!settingsDropdown.classList.contains('hidden')) {
            closeSettingsDropdown();
        }
    });
}

function closeSettingsDropdown() {
    if (!settingsDropdown) return;
    settingsDropdown.classList.remove('scale-100', 'opacity-100');
    settingsDropdown.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        settingsDropdown.classList.add('hidden');
    }, 200);
}

if (settingsCrossfadeToggle) {
    settingsCrossfadeToggle.addEventListener('change', (e) => {
        userSettings.crossfadeEnabled = e.target.checked;
        updateCrossfadeState();
        saveSettings();
    });
}

if (settingsCrossfadeSlider) {
    settingsCrossfadeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        settingsCrossfadeInput.value = val;
        userSettings.crossfadeDuration = val;
        saveSettings();
    });
}

if (settingsCrossfadeInput) {
    settingsCrossfadeInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 0;
        if (val < 0) val = 0;
        if (val > 12000) val = 12000;
        
        settingsCrossfadeInput.value = val;
        settingsCrossfadeSlider.value = val;
        userSettings.crossfadeDuration = val;
        saveSettings();
    });
}

if (settingsQualityBtn) {
    settingsQualityBtn.addEventListener('click', () => {
        const qualities = ['High', 'Lossless', 'Hi-Res'];
        const currentIdx = qualities.indexOf(userSettings.quality);
        const nextIdx = (currentIdx + 1) % qualities.length;
        userSettings.quality = qualities[nextIdx];
        saveSettings();
        applySettingsUI();
    });
}

const romanizationToggle = document.getElementById('romanizationToggle');
if (romanizationToggle) {
    romanizationToggle.checked = localStorage.getItem('romajiEnabled') === 'true';
    romanizationToggle.addEventListener('change', (e) => {
        localStorage.setItem('romajiEnabled', e.target.checked);
        const allLyrics = document.querySelectorAll('am-lyrics');
        allLyrics.forEach(lyrics => {
            lyrics.romanizationEnabled = e.target.checked;
        });
    });
}
window.addEventListener('load', () => {
    const enabled = localStorage.getItem('romajiEnabled') === 'true';
    const allLyrics = document.querySelectorAll('am-lyrics');
    allLyrics.forEach(lyrics => {
        lyrics.romanizationEnabled = enabled;
    });
});

if (settingsEqualizerBtn) {
    settingsEqualizerBtn.addEventListener('click', () => {
        closeSettingsDropdown();
        setTimeout(() => {
            const eqBtn = document.getElementById('equalizerBtn');
            if (eqBtn) eqBtn.click();
        }, 300);
    });
}

const statsOverlay = document.getElementById('statsOverlay');
const statsCloseBtn = document.getElementById('statsCloseBtn');
const statTrackId = document.getElementById('statTrackId');
const statFormat = document.getElementById('statFormat');
const statGain = document.getElementById('statGain');
const statPeak = document.getElementById('statPeak');
const statConnection = document.getElementById('statConnection');
const statBandwidth = document.getElementById('statBandwidth');
const statBuffer = document.getElementById('statBuffer');
const statIsrc = document.getElementById('statIsrc');
const statBpmKey = document.getElementById('statBpmKey');

if (statsCloseBtn) {
    statsCloseBtn.addEventListener('click', () => {
        userSettings.statsEnabled = false;
        if (settingsStatsToggle) settingsStatsToggle.checked = false;
        saveSettings();
        if (statsOverlay) statsOverlay.classList.add('hidden');
    });
}

function updateDynamicStats() {
    if (!userSettings.statsEnabled || !statsOverlay) return;
    
    if (audio.buffered.length > 0) {
        for (let i = 0; i < audio.buffered.length; i++) {
            if (audio.buffered.start(i) <= audio.currentTime && audio.buffered.end(i) >= audio.currentTime) {
                const bufferHealth = audio.buffered.end(i) - audio.currentTime;
                 if (statBuffer) statBuffer.textContent = `${bufferHealth.toFixed(2)} s`;
                break;
            }
        }
    }
    
    if (navigator.connection) {
        const conn = navigator.connection;
        if (statConnection) statConnection.textContent = conn.effectiveType ? conn.effectiveType.toUpperCase() : 'Unknown';
        if (statBandwidth) statBandwidth.textContent = conn.downlink ? `~${conn.downlink} Mbps` : '-';
    }
}




loadSettings();






if (settingsKeyboardBtn) {
    settingsKeyboardBtn.addEventListener('click', () => {
        if (keyboardShortcutsModal) {
            keyboardShortcutsModal.classList.remove('hidden');
            setTimeout(() => {
                keyboardShortcutsModal.querySelector('.modal-panel').classList.remove('scale-95', 'opacity-0');
                keyboardShortcutsModal.querySelector('.modal-panel').classList.add('scale-100', 'opacity-100');
            }, 10);
        }
    });
}

if (closeKeyboardModal && keyboardShortcutsModal) {
    closeKeyboardModal.addEventListener('click', () => {
        keyboardShortcutsModal.querySelector('.modal-panel').classList.remove('scale-100', 'opacity-100');
        keyboardShortcutsModal.querySelector('.modal-panel').classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            keyboardShortcutsModal.classList.add('hidden');
        }, 300);
    });
    
    keyboardShortcutsModal.addEventListener('click', (e) => {
        if (e.target === keyboardShortcutsModal) {
             keyboardShortcutsModal.querySelector('.modal-panel').classList.remove('scale-100', 'opacity-100');
            keyboardShortcutsModal.querySelector('.modal-panel').classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                keyboardShortcutsModal.classList.add('hidden');
            }, 300);
        }
    });
}

if (settingsLogoutBtn) {
    settingsLogoutBtn.addEventListener('click', () => {
       import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js").then(({ signOut }) => {
           signOut(window.auth).then(() => {
                window.location.href = 'login.html';
           }).catch(console.error);
       });
    });
}

loadSettings();


if (fsOptionsBtn && fsOptionsModal) {
    fsOptionsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        const song = queue[currentSong];
        if (song) {
             const art = document.getElementById("fsOptionsArt");
             const title = document.getElementById("fsOptionsTitle");
             const artist = document.getElementById("fsOptionsArtist");
             
             if (art) art.src = song.album?.cover 
                ? `${IMAGE_API_BASE}${song.album.cover.split("-").join("/")}/320x320.jpg`
                : "https://placehold.co/320x320";
             if (title) title.textContent = song.title;
             if (artist) artist.textContent = song.artist.name;
             
             if (fsOptionArtist) {
                 fsOptionArtist.onclick = () => {
                     fsOptionsModal.classList.add("translate-y-full");
                     if (mobileFullscreenPlayer) mobileFullscreenPlayer.classList.add("translate-y-full");
                     isMobileFullscreenOpen = false;
                     document.body.style.overflow = "";
                     if (playerBackdrop) playerBackdrop.classList.remove('hidden');
                     if (song.artist && song.artist.id) showArtistPage(song.artist.id);
                 };
             }
             if (fsOptionAlbum) {
                 fsOptionAlbum.onclick = () => {
                     fsOptionsModal.classList.add("translate-y-full");
                     if (mobileFullscreenPlayer) mobileFullscreenPlayer.classList.add("translate-y-full");
                     isMobileFullscreenOpen = false;
                     document.body.style.overflow = "";
                     if (playerBackdrop) playerBackdrop.classList.remove('hidden');
                     if (song.album && song.album.id) {
                        showAlbumPage({
                            id: song.album.id,
                            title: song.album.title,
                            cover: song.album.cover,
                            artists: [song.artist]
                        });
                     }
                 };
             }
             if (fsOptionAdd) {
                 fsOptionAdd.onclick = () => {
                      alert("Add to Playlist feature coming soon!");
                      fsOptionsModal.classList.add("translate-y-full");
                 };
             }
        }
        
        fsOptionsModal.classList.remove("translate-y-full");
    });
}

if (closeFsOptionsBtn && fsOptionsModal) {
    closeFsOptionsBtn.addEventListener("click", () => {
        fsOptionsModal.classList.add("translate-y-full");
    });
}

if (queueBtn && queueModal) {
    const newQueueBtn = queueBtn.cloneNode(true);
    queueBtn.parentNode.replaceChild(newQueueBtn, queueBtn);
    newQueueBtn.addEventListener("click", () => {
        queueModal.classList.remove("hidden");
        renderQueue();
    });
}

const closeQueueModalBtn = document.getElementById("closeQueueModal");
if (closeQueueModalBtn) {
    const newCloseBtn = closeQueueModalBtn.cloneNode(true);
    closeQueueModalBtn.parentNode.replaceChild(newCloseBtn, closeQueueModalBtn);
    newCloseBtn.addEventListener("click", () => {
        queueModal.classList.add("hidden");
    });
}

window.addEventListener("click", (e) => {
    if (e.target === queueModal) {
        queueModal.classList.add("hidden");
    }
}); 
if (miniPlayerInfo) {
    miniPlayerInfo.addEventListener("click", () => {
        if (window.innerWidth < 768) {
            if (mobileFullscreenPlayer) {
                mobileFullscreenPlayer.classList.remove("translate-y-full");
                isMobileFullscreenOpen = true;
                document.body.style.overflow = "hidden";
                if (playerBackdrop) playerBackdrop.classList.add('hidden');
            }
        }
    });
}

if (fsMinimizeBtn) {
    fsMinimizeBtn.addEventListener("click", () => {
        if (mobileFullscreenPlayer) {
            mobileFullscreenPlayer.classList.add("translate-y-full");
            isMobileFullscreenOpen = false;
            document.body.style.overflow = "";
            if (playerBackdrop) playerBackdrop.classList.remove('hidden');
        }
    });
}

if (fsShuffleBtn) {
    fsShuffleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (typeof toggleShuffle === 'function') window.toggleShuffle();
    });
}

if (fsPlayPauseBtn) {
    fsPlayPauseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (typeof togglePlay === 'function') togglePlay();
    });
}

if (fsPrevBtn && typeof playPrevSong === 'function') fsPrevBtn.addEventListener("click", playPrevSong);
if (fsNextBtn && typeof playNextSong === 'function') fsNextBtn.addEventListener("click", playNextSong);

if (fsProgressBarContainer) {
    fsProgressBarContainer.addEventListener("mousedown", async (e) => {
        wasPlaying = isPlaying; 
        if (isPlaying) {
             await fadeVolume(0, 100);
        }
        isFsDragging = true;
        updateFsProgress(e);
    });
}

function updateFsProgress(e) {
  if (!audio.duration) return;
  const rect = fsProgressBarContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const duration = audio.duration;
  const newTime = Math.max(0, Math.min(duration, (clickX / width) * duration));

  if (isFsDragging) {
    fsDragProgress = newTime;
    if (fsProgressBar) fsProgressBar.style.width = `${(newTime / duration) * 100}%`;
    if (fsProgressThumb) fsProgressThumb.style.left = `${(newTime / duration) * 100}%`;
    if (document.getElementById("fsCurrentTime")) document.getElementById("fsCurrentTime").textContent = formatTime(newTime);
  } else {
    audio.currentTime = newTime;
  }
}



let isMobileLyricsOpen = false;
let mobileAmLyrics = null;

async function updateMobileLyrics(song) {
     if (!fsAmLyricsWrapper || !song) return;

     fsAmLyricsWrapper.innerHTML = '';
     mobileAmLyrics = document.createElement('am-lyrics');
     mobileAmLyrics.className = "w-full h-full text-xs md:text-sm font-medium leading-relaxed";
     
     mobileAmLyrics.setAttribute('song-title', song.title);
     mobileAmLyrics.setAttribute('song-artist', song.artist.name);
     mobileAmLyrics.setAttribute('song-album', song.album.title);
     mobileAmLyrics.setAttribute('song-duration', (song.duration || 0) * 1000);
     mobileAmLyrics.setAttribute('query', `${song.title} ${song.artist.name}`);
     
     if (song.isrc) {
         mobileAmLyrics.setAttribute('isrc', song.isrc);
     }
     
     mobileAmLyrics.setAttribute('autoscroll', '');
     mobileAmLyrics.setAttribute('interpolate', '');
     mobileAmLyrics.setAttribute('highlight-color', '#3b82f6');
     mobileAmLyrics.setAttribute('hover-background-color', 'rgba(59, 130, 246, 0.1)');
     mobileAmLyrics.setAttribute('font-family', "'Figtree', system-ui, sans-serif");
     fsAmLyricsWrapper.appendChild(mobileAmLyrics);

     mobileAmLyrics.addEventListener('line-click', (evt) => {
         const timestampMs = evt.detail.timestamp;
         if (timestampMs !== undefined && !isNaN(timestampMs)) {
             audio.currentTime = timestampMs / 1000;
             if (audio.paused) {
                 audio.play();
                 isPlaying = true;
                 updatePlayButton(true);
             }
         }
     });

     if (!audio.paused) {
         startLyricsSync();
     }
}

if (fsLyricsBtn) {
    fsLyricsBtn.addEventListener("click", (e) => {
         e.stopPropagation();
         isMobileLyricsOpen = !isMobileLyricsOpen;
         
         const artContainer = document.getElementById("fsArtContainer");
         const artWrapper = document.getElementById("fsArtWrapper");
         const infoContainer = document.getElementById("fsInfoContainer");
         const titleEl = document.getElementById("fsPlayerTitle");
         const artistEl = document.getElementById("fsPlayerArtist");

         if (isMobileLyricsOpen) {
             fsLyricsBtn.classList.add("text-blue-400");
             fsLyricsContainer.classList.remove("hidden");
             
             fsMainContent.classList.remove("flex-col", "flex-1");
             fsMainContent.classList.add("flex-row", "items-center", "gap-4", "flex-none", "mb-3");
             
             artContainer.classList.remove("flex-1", "py-4", "justify-center");
             artContainer.classList.add("w-auto", "p-0", "flex-none");
             artWrapper.classList.remove("w-90", "h-90", "shadow-2xl", "rounded-xl");
             artWrapper.classList.add("w-16", "h-16", "shadow-sm", "rounded-lg");
             
             infoContainer.classList.remove("mt-4", "mb-6", "text-center");
             infoContainer.classList.add("m-0", "text-left", "flex-1");
             
             titleEl.classList.remove("text-2xl", "mb-2", "text-center");
             titleEl.classList.add("text-lg", "mb-0", "text-left");
             
             artistEl.classList.remove("text-lg", "text-center");
             artistEl.classList.add("text-sm", "text-left");

             if (currentPlayingTrackId) {
                  const song = currentList.find(s => s.id === currentPlayingTrackId) || queue[currentSong];
                  if (song) updateMobileLyrics(song);
             }

         } else {
             fsLyricsBtn.classList.remove("text-blue-400", "bg-white/10");
             fsLyricsContainer.classList.add("hidden");

             fsMainContent.classList.add("flex-col", "flex-1");
             fsMainContent.classList.remove("flex-row", "items-center", "gap-4", "flex-none", "mb-3");
             
             artContainer.classList.add("flex-1", "py-4", "justify-center");
             artContainer.classList.remove("w-auto", "p-0", "flex-none");
             artWrapper.classList.add("w-90", "h-90", "shadow-2xl", "rounded-xl");
             artWrapper.classList.remove("w-16", "h-16", "shadow-sm", "rounded-lg");
             
             infoContainer.classList.add("mt-4", "mb-6", "text-center");
             infoContainer.classList.remove("m-0", "text-left", "flex-1");
             
             titleEl.classList.add("text-2xl", "mb-2", "text-center");
             titleEl.classList.remove("text-lg", "mb-0", "text-left");
             
             artistEl.classList.add("text-lg", "text-center");
             artistEl.classList.remove("text-sm", "text-left");
         }
    });
}

if (fsQueueBtn) {
    fsQueueBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (mobileQueueModal) {
            mobileQueueModal.classList.remove("translate-y-full");
            renderMobileQueue();
        }
    });
}

if (closeMobileQueueBtn) {
    closeMobileQueueBtn.addEventListener("click", () => {
        if (mobileQueueModal) {
            mobileQueueModal.classList.add("translate-y-full");
        }
    });
}

function renderMobileQueue() {
    if (!mobileQueueList) return;
    mobileQueueList.innerHTML = "";
    
    if (queue.length === 0) {
        mobileQueueList.innerHTML = `
            <div class="flex flex-col items-center justify-center py-20 opacity-50">
                <i data-lucide="music" class="w-12 h-12 mb-4 text-gray-500"></i>
                <p class="text-gray-400">Queue is empty</p>
            </div>
        `;
        return;
    }

    queue.forEach((song, index) => {
         const isCurrent = index === currentSong;
         const item = document.createElement("div");
         
         item.className = `group flex w-full items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer border border-transparent ${
            isCurrent 
            ? 'bg-white/10' 
            : 'hover:bg-white/5 hover:border-white/5'
         }`;
         
         const cover = song.album?.cover 
            ? `${IMAGE_API_BASE}${song.album.cover.split("-").join("/")}/320x320.jpg`
            : "https://placehold.co/320x320";
            
         item.innerHTML = `
            <div class="w-6 text-center text-sm font-mono text-gray-500 flex-shrink-0">
                ${isCurrent 
                  ? '<i data-lucide="bar-chart-2" class="w-4 h-4 text-blue-400 mx-auto animate-pulse"></i>' 
                  : `<span class="group-hover:hidden">${index + 1}</span>
                     <i data-lucide="play" class="w-4 h-4 text-white hidden group-hover:block mx-auto"></i>`
                }
            </div>
            
            <img src="${cover}" class="w-10 h-10 rounded object-cover shadow-sm bg-gray-800">
            
            <div class="flex-1 min-w-0">
                <h4 class="font-medium text-[15px] truncate leading-tight ${isCurrent ? 'text-blue-400' : 'text-gray-200 group-hover:text-white'}">${song.title}</h4>
                <p class="text-xs text-gray-500 truncate mt-0.5 group-hover:text-gray-400">${song.artist.name}</p>
            </div>
            
            ${isCurrent ? '' : `
                <div class="opacity-0 group-hover:opacity-100 px-2">
                    <i data-lucide="more-horizontal" class="w-4 h-4 text-gray-400 hover:text-white"></i>
                </div>
            `}
         `;
         
         item.addEventListener("click", async () => {
             if (index !== currentSong) {
                 await playSongFromQueue(index, true);
             } else {
                 if (typeof togglePlay === 'function') togglePlay();
             }
         });
         
         mobileQueueList.appendChild(item);
    });
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

if (fsFavoriteBtn) {
    fsFavoriteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (currentPlayingTrackId) {
             const song = currentList.find(s => s.id === currentPlayingTrackId) || queue[currentSong];
             if (song) {
                if (typeof toggleFavorite === 'function') await toggleFavorite(song);
                const isFav = isFavorite(song);
                if (fsFavoriteBtn) {
                    fsFavoriteBtn.classList.toggle("text-red-500", isFav);
                    fsFavoriteBtn.classList.toggle("text-gray-400", !isFav);
                    const icon = fsFavoriteBtn.querySelector("i") || fsFavoriteBtn.querySelector("svg");
                    if (icon && typeof lucide !== 'undefined') {
                        if (icon.tagName.toLowerCase() === 'svg') {
                            icon.setAttribute('fill', isFav ? 'currentColor' : 'none');
                        }
                    }
                }
             }
        }
    });
}

function updateFullscreenPlayerUI(song) {
    if (!song || !mobileFullscreenPlayer) return;
    
    const titleEl = document.getElementById("fsPlayerTitle");
    const artistEl = document.getElementById("fsPlayerArtist");
    const imgEl = document.getElementById("fsPlayerImage");
    const bgEl = document.getElementById("fsPlayerBg");

    if (titleEl) titleEl.textContent = song.title || "Unknown Title";
    if (artistEl) artistEl.textContent = song.artist?.name || song.artist || "Unknown Artist";
    
    if (imgEl || bgEl) {
        const coverUrl = song.album?.cover 
            ? `${IMAGE_API_BASE}${song.album.cover.split("-").join("/")}/640x640.jpg`
            : (song.picture 
                ? `${IMAGE_API_BASE}${song.picture.split("-").join("/")}/640x640.jpg` 
                : "https://placehold.co/400x400");
                
        if (imgEl) imgEl.src = coverUrl;
        if (bgEl) bgEl.src = coverUrl;
    }

    if (fsFavoriteBtn) {
         const isFav = isFavorite(song);
         fsFavoriteBtn.classList.toggle("text-red-500", isFav);
         fsFavoriteBtn.classList.toggle("text-gray-400", !isFav);
         const icon = fsFavoriteBtn.querySelector("i") || fsFavoriteBtn.querySelector("svg");
          if (icon && icon.tagName.toLowerCase() === 'svg') {
                icon.setAttribute('fill', isFav ? 'currentColor' : 'none');
          }
    }
    
    if (typeof isMobileLyricsOpen !== 'undefined' && isMobileLyricsOpen && typeof updateMobileLyrics === 'function') {
        const currentTitle = mobileAmLyrics ? mobileAmLyrics.getAttribute('song-title') : null;
        if (currentTitle !== song.title) {
            updateMobileLyrics(song);
        }
    }
}
