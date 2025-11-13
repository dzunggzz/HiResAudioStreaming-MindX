const API_BASE = "https://vogel.qqdl.site";
const IMAGE_API_BASE = "https://resources.tidal.com/images/";
const TOP_TRACKS_API = "https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=0ad369170a5a3d839efe249ca049ecc9&format=json"

const searchInput = document.getElementById("searchInput");
const resultsGrid = document.getElementById("resultsGrid");
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

const searchBtn = document.getElementById("searchBtn");
const trackSearchTab = document.getElementById("trackSearchTab");
const artistSearchTab = document.getElementById("artistSearchTab");
const topTracksTab = document.getElementById("topTracksTab");
const topTracksBadge = document.getElementById("topTracksBadge");
const queuePanel = document.getElementById("queuePanel");
const closeQueueBtn = document.getElementById("closeQueueBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const clearBtn = document.getElementById("clearBtn");
const queueCount = document.getElementById("queueCount");
const queueLength = document.getElementById("queueLength");
const queueListContainer = document.getElementById("queueListContainer");

let currentList = [];
let queue = [];
let currentSong = 0;
let isPlaying = false;
let currentSearchMode = 'tracks'; 
let topTracksData = null;
let topTracksLastUpdated = null;

trackSearchTab.addEventListener("click", () => switchSearchMode('tracks'));
artistSearchTab.addEventListener("click", () => switchSearchMode('artists'));
topTracksTab.addEventListener("click", () => switchSearchMode('topTracks'));

function switchSearchMode(mode) {
    currentSearchMode = mode;
    
    updateTabStyling();
    
    resultsGrid.innerHTML = '';
    currentList = [];
    
    if (mode === 'topTracks') {
        searchInput.style.display = 'none';
        loadTopTracks();
    } else {
        searchInput.style.display = 'block';
        searchInput.placeholder = mode === 'tracks' ? "Search for tracks..." : "Search for artists...";
    }
}

function updateTabStyling() {
    const tabs = [
        { tab: trackSearchTab, mode: 'tracks' },
        { tab: artistSearchTab, mode: 'artists' },
        { tab: topTracksTab, mode: 'topTracks' }
    ];
    
    tabs.forEach(({ tab, mode }) => {
        if (mode === currentSearchMode) {
            tab.classList.add('border-blue-500', 'text-blue-500');
            tab.classList.remove('border-transparent', 'text-gray-300');
        } else {
            tab.classList.remove('border-blue-500', 'text-blue-500');
            tab.classList.add('border-transparent', 'text-gray-300');
        }
    });
}

async function loadTopTracks() {
    resultsGrid.innerHTML = `<p id="placeholder">Loading top tracks...</p>`;
    
    try {
        if (topTracksData && topTracksLastUpdated && isDataStillValid()) {
            console.log('Using cached top tracks data');
            displayTopTracks(topTracksData);
            return;
        }
        
        console.log('Fetching fresh top tracks data');
        const topTracksResponse = await fetch(TOP_TRACKS_API);
        const topTracksDatas = await topTracksResponse.json();

        const trackPromises = topTracksDatas.tracks.track.map(track =>
            fetch(`${API_BASE}/search/?s=${track.name}&limit=50`).then(res => res.json())
        );
        const trackDatas = await Promise.all(trackPromises);

        const allItems = trackDatas.flatMap(data => data.items || []);

        if (allItems.length > 0) {
            const sortedTracks = allItems
                .filter(track => track.popularity > 0)
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, 20); 

            topTracksData = sortedTracks;
            topTracksLastUpdated = new Date();

            topTracksBadge.classList.add('hidden');

            displayTopTracks(sortedTracks);
            console.log('Top tracks loaded:', sortedTracks.length);
        } else {
            resultsGrid.innerHTML = `<p id="placeholder">No top tracks available at the moment.</p>`;
        }
    } catch (error) {
        console.error('Error loading top tracks:', error);
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
    
    const header = document.createElement('div');
    header.className = 'mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20';
    
    const lastUpdatedText = topTracksLastUpdated 
        ? `Last updated: ${formatDate(topTracksLastUpdated)}`
        : 'Fresh data';
    
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
    card.className = "track-glass group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:brightness-110";
    
    const imageUrl = `${IMAGE_API_BASE}${track.album.cover.split("-").join("/")}/320x320.jpg`;
    const rankColor = index < 3 ? 'text-yellow-400' : index < 10 ? 'text-gray-300' : 'text-gray-500';
    const rankBgColor = index < 3 ? 'bg-yellow-500/20' : index < 10 ? 'bg-gray-500/20' : 'bg-gray-600/20';
    
    card.innerHTML = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full ${rankBgColor} ${rankColor} font-bold text-sm">
            ${index + 1}
        </div>
        <img src="${imageUrl}" alt="${track.title}" class="h-[64px] w-[64px] rounded object-cover">
        <div class="min-w-0 flex-1">
            <h3 class="break-words font-semibold text-white group-hover:text-blue-400">${track.title}</h3>
            <a class="break-words text-sm text-gray-400 hover:text-blue-400 hover:underline inline-block">${track.artist.name}</a>
            <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-gray-500">${track.album.title}</span>
                <span class="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">${track.popularity}% popular</span>
            </div>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-400">
            <button class="add-to-queue-btn rounded-full p-2 text-gray-400 transition-colors hover:text-white" title="add to queue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <span>${formatTime(track.duration || 0)}</span>
        </div>
    `;
    
    
    card.querySelector(".add-to-queue-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        addToQueue(track);
    });
    
    card.addEventListener("click", () => playSong(index, currentList));
    
    return card;
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}


setInterval(() => {
    if (currentSearchMode === 'topTracks' && topTracksData) {
        console.log('Auto-refreshing top tracks data');
        topTracksData = null; 
        loadTopTracks();
    }
}, 24 * 60 * 60 * 1000); 

searchBtn.addEventListener("click", () => {
    if (searchInput.value.trim()) {
        searchSongs(searchInput.value.trim());
    }
});

async function searchSongs(query) {
    resultsGrid.innerHTML = `<p id="placeholder">Searching "${query}"...</p>`;
    
    try {
        const apiUrl = currentSearchMode === 'tracks' 
            ? `${API_BASE}/search/?s=${query}`
            : `${API_BASE}/search/?a=${query}&limit=50`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log('API Response:', data);
        
        if (currentSearchMode === 'artists') {
            const artists = extractArtistData(data);
            console.log('Extracted artists:', artists);
            displayArtistResults(artists);
        } else {
            displayResults(data.items || []);
        }
    } catch (error) {
        console.error('Search error:', error);
        resultsGrid.innerHTML = `<p id="placeholder" style="color: #f87171;">Error fetching data</p>`;
    }
}

function extractArtistData(apiResponse) {
    const artists = [];
    
    if (!apiResponse || !Array.isArray(apiResponse) || apiResponse.length === 0) {
        return artists;
    }
    
    const responseData = apiResponse[0];
    console.log('Response data structure:', responseData);
    
    if (responseData.artists?.items?.length > 0) {
        console.log('Found artists in items array:', responseData.artists.items);
        
        responseData.artists.items.forEach(artist => {
            artists.push({
                id: artist.id,
                name: artist.name,
                url: artist.url || `https://tidal.com/artist/${artist.id}`,
                picture: artist.picture,
                artistTypes: artist.artistTypes || ['ARTIST'],
                bio: artist.bio || { text: null, source: null }
            });
        });
    }
    
    if (responseData.topHits?.length > 0) {
        console.log('Checking topHits:', responseData.topHits);
        
        responseData.topHits.forEach(hit => {
            if (hit.item) {
                const item = hit.item;
                
                if (item.type === 'artist' || item.artistTypes || 
                    (item.name && !item.title && !item.album)) {
                    console.log('Found artist in topHits:', item);
                    
                    artists.push({
                        id: item.id,
                        name: item.name,
                        url: item.url || `https://tidal.com/artist/${item.id}`,
                        picture: item.picture,
                        artistTypes: item.artistTypes || ['ARTIST'],
                        bio: item.bio || { text: null, source: null }
                    });
                }
            }
        });
    }
    
    if (artists.length === 0 && responseData.tracks?.items?.length > 0) {
        console.log('No direct artists found, extracting from tracks...');
        const artistMap = new Map();
        
        responseData.tracks.items.forEach(track => {
            if (track.artists && Array.isArray(track.artists)) {
                track.artists.forEach(artist => {
                    if (!artistMap.has(artist.id)) {
                        artistMap.set(artist.id, {
                            id: artist.id,
                            name: artist.name,
                            url: artist.url || `https://tidal.com/artist/${artist.id}`,
                            picture: artist.picture,
                            artistTypes: ['ARTIST'],
                            bio: { text: null, source: null }
                        });
                    }
                });
            }
        });
        
        const extractedArtists = Array.from(artistMap.values());
        artists.push(...extractedArtists);
        console.log('Extracted artists from tracks:', extractedArtists);
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
    card.className = "track-glass group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:brightness-110";
    
    const artistImageUrl = artist.picture 
        ? `${IMAGE_API_BASE}${artist.picture.split("-").join("/")}/320x320.jpg`
        : "https://placehold.co/64x64";
    
    card.innerHTML = `
        <img src="${artistImageUrl}" alt="${artist.name}" class="h-[64px] w-[64px] rounded object-cover">
        <div class="min-w-0 flex-1">
            <h3 class="break-words font-semibold text-white group-hover:text-blue-400">${artist.name}</h3>
            <p class="text-sm text-gray-400">${artist.artistTypes?.join(', ') || 'Artist'}</p>
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
    const bioText = artist.bio?.text || 'No bio available';
    const types = artist.artistTypes?.join(', ') || 'Artist';
    
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
    card.className = "track-glass group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:brightness-110";
    
    const imageUrl = `${IMAGE_API_BASE}${song.album.cover.split("-").join("/")}/320x320.jpg`;
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${song.title}" class="h-[64px] w-[64px] rounded object-cover">
        <div class="min-w-0 flex-1">
            <h3 class="break-words font-semibold text-white group-hover:text-blue-400">${song.title}</h3>
            <a class="break-words text-sm text-gray-400 hover:text-blue-400 hover:underline inline-block">${song.artist.name}</a>
            <p class="text-xs text-gray-500">${song.album.title} • CD • 16-bit/44.1 kHz FLAC</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-400">
            <button class="add-to-queue-btn rounded-full p-2 text-gray-400 transition-colors hover:text-white" title="add to queue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <span>${formatTime(song.duration || 0)}</span>
        </div>
    `;
    
    card.querySelector(".add-to-queue-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        addToQueue(song);
    });
    
    card.addEventListener("click", () => playSong(index, currentList));
    
    return card;
}

queueBtn.addEventListener("click", () => {
    queuePanel.style.display = queuePanel.style.display === "none" ? "block" : "none";
});

closeQueueBtn.addEventListener("click", () => {
    queuePanel.style.display = "none";
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
        queueListContainer.innerHTML = '<p class="rounded-lg border border-dashed border-gray-700 bg-gray-900/70 px-3 py-8 text-center text-gray-400">Queue is empty</p>';
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
}

function createQueueItem(song, index) {
    const li = document.createElement("li");
    const isCurrentSong = index === currentSong;
    
    li.innerHTML = `
        <div class="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
            isCurrentSong ? "bg-blue-500/10 text-white" : "text-gray-200 hover:bg-gray-800/70"
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
    
    li.querySelector("div").addEventListener("click", () => playSongFromQueue(index));
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
        const streamResponse = await fetch(`${API_BASE}/track/?id=${song.id}&quality=LOSSLESS`);
        const streamData = await streamResponse.json();

        audio.src = streamData[2].OriginalTrackUrl;
        albumArt.src = `${IMAGE_API_BASE}${song.album.cover.split("-").join("/")}/320x320.jpg`;
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist.name;
        document.getElementById("albumTitle").textContent = song.album.title;
        document.getElementById("qualityLabel").textContent = "CD";

        audio.play();
        isPlaying = true;
        updatePlayButton(isPlaying);
    } catch (error) {
        console.error('Playback error:', error);
    }
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

shuffleBtn.addEventListener("click", () => {
    if (queue.length <= 1) return;

    const currentSongItem = queue[currentSong];
    const remainingSongs = queue.filter((_, index) => index !== currentSong);

    for (let i = remainingSongs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingSongs[i], remainingSongs[j]] = [remainingSongs[j], remainingSongs[i]];
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
        progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
});

audio.addEventListener("ended", () => nextBtn.click());

volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value;
});

document.getElementById("progressContainer").addEventListener("click", (e) => {
    if (!audio.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
});

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

