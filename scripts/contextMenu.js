document.addEventListener('contextmenu', (e) => {
    const trackCard = e.target.closest('[data-track-id]');
    const albumCard = e.target.closest('[data-album-id]');
    const artistCard = e.target.closest('[data-artist-id]');
    const playlistCard = e.target.closest('[data-playlist-index]');

    if (!trackCard && !albumCard && !artistCard && !playlistCard) return;



    e.preventDefault();

    const existingMenu = document.getElementById('custom-context-menu');
    if (existingMenu) {
        existingMenu.remove();
        document.body.style.overflow = '';
    }


    let title = "";
    let subtitle = "";
    let menuItems = "";

    if (trackCard) {
        const trackId = trackCard.dataset.trackId;
        const track = window.getTrackById ? window.getTrackById(trackId) : null;
        if (!track) return;
        
        title = track.title;
        subtitle = track.artist.name;
        menuItems = `
            <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-play-next">
                <i data-lucide="play" class="w-4 h-4"></i> Play Next
            </button>
            <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-add-queue">
                <i data-lucide="list-plus" class="w-4 h-4"></i> Add to Queue
            </button>
            <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-share-track">
                <i data-lucide="share-2" class="w-4 h-4"></i> Share
            </button>
            <div class="h-px bg-white/10 my-1 mx-2"></div>
            <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-favorite">
                <i data-lucide="heart" class="w-4 h-4 ${window.isFavorite && window.isFavorite(track) ? 'fill-current text-red-500' : ''}"></i> 
                ${window.isFavorite && window.isFavorite(track) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-playlist">
                <i data-lucide="plus-square" class="w-4 h-4"></i> Add to Playlist
            </button>
            <div class="h-px bg-white/10 my-1 mx-2"></div>
            <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-artist">
                <i data-lucide="user" class="w-4 h-4"></i> Go to Artist
            </button>
            <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-album">
                <i data-lucide="disc" class="w-4 h-4"></i> Go to Album
            </button>
        `;
    } else if (albumCard) {
        const albumId = albumCard.dataset.albumId;
        title = albumCard.querySelector('h3')?.textContent || "Album";
        subtitle = albumCard.querySelector('p')?.textContent || "Artist";
        
        menuItems = `
            <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-album-play">
                <i data-lucide="play" class="w-4 h-4"></i> Play Album
            </button>
            <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-album-shuffle">
                <i data-lucide="shuffle" class="w-4 h-4"></i> Shuffle Album
            </button>
            <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-share-album">
                <i data-lucide="share-2" class="w-4 h-4"></i> Share
            </button>
             <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-album-open">
                <i data-lucide="disc" class="w-4 h-4"></i> View Album
            </button>
        `;
    } else if (artistCard) {
        const artistId = artistCard.dataset.artistId;
        title = artistCard.querySelector('h3')?.textContent || "Artist";
        subtitle = "Artist";
        
        menuItems = `
            <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-artist-open">
                <i data-lucide="user" class="w-4 h-4"></i> View Artist
            </button>
            <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-share-artist">
                <i data-lucide="share-2" class="w-4 h-4"></i> Share
            </button>
        `;
    } else if (playlistCard) {
        const index = playlistCard.dataset.playlistIndex;
        title = playlistCard.querySelector('h3')?.textContent || "Playlist";
        subtitle = playlistCard.querySelector('p')?.textContent || "";
        
        menuItems = `
            <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-playlist-play">
                <i data-lucide="play" class="w-4 h-4"></i> Play Playlist
            </button>
            <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-playlist-shuffle">
                <i data-lucide="shuffle" class="w-4 h-4"></i> Shuffle Playlist
            </button>
             <button class="cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-playlist-delete">
                <i data-lucide="trash-2" class="w-4 h-4 text-red-400"></i> Delete Playlist
            </button>
        `;
    }

    e.preventDefault();



    document.body.style.overflow = 'hidden';

    const menu = document.createElement('div');
    menu.id = 'custom-context-menu';
    menu.className = "fixed z-[201] w-56 bg-gray-900 border border-white/10 rounded-xl shadow-2xl py-1 transform scale-95 opacity-0 transition-all duration-200 origin-top-left";

    const { clientX: mouseX, clientY: mouseY } = e;
    menu.style.left = `${mouseX}px`;
    menu.style.top = `${mouseY}px`;

    menu.innerHTML = `
        <div class="px-4 py-3 border-b border-white/10 mb-1">
            <div class="text-sm font-medium text-white truncate">${title}</div>
            <div class="text-xs text-gray-400 truncate">${subtitle}</div>
        </div>
        ${menuItems}
    `;

    document.body.appendChild(menu);
    lucide.createIcons();

    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
        menu.style.left = `${window.innerWidth - rect.width - 10}px`;
        menu.style.transformOrigin = "top right";
    }
    if (rect.bottom > window.innerHeight) {
        menu.style.top = `${window.innerHeight - rect.height - 10}px`;
        menu.style.transformOrigin = "bottom left";
    }

    requestAnimationFrame(() => {
        menu.classList.remove('scale-95', 'opacity-0');
        menu.classList.add('scale-100', 'opacity-100');
    });

    const closeMenu = () => {
        document.body.style.overflow = '';
        menu.classList.remove('scale-100', 'opacity-100');
        menu.classList.add('scale-95', 'opacity-0');
        setTimeout(() => menu.remove(), 200);
        document.removeEventListener('click', clickOutsideHandler);
    };

    if (trackCard) {
        const trackId = trackCard.dataset.trackId;
        const track = window.getTrackById ? window.getTrackById(trackId) : null;
        
        if (menu.querySelector('#ctx-add-queue')) menu.querySelector('#ctx-add-queue').onclick = () => {
            if (window.addToQueue) window.addToQueue(track);
            closeMenu();
        };
        if (menu.querySelector('#ctx-share-track')) menu.querySelector('#ctx-share-track').onclick = () => {
             if (window.shareContent) window.shareContent('track', track.id, track.title, track.artist.name);
             closeMenu();
        };
        if (menu.querySelector('#ctx-favorite')) menu.querySelector('#ctx-favorite').onclick = async () => {
            if (window.toggleFavorite) await window.toggleFavorite(track);
            closeMenu();
        };
        if (menu.querySelector('#ctx-playlist')) menu.querySelector('#ctx-playlist').onclick = () => {
            if (window.showAddToPlaylistModal) window.showAddToPlaylistModal(track);
            closeMenu();
        };
        if (menu.querySelector('#ctx-artist')) menu.querySelector('#ctx-artist').onclick = () => {
             if (window.showArtistPage && track.artist && track.artist.id) window.showArtistPage(track.artist.id);
            closeMenu();
        };
        if (menu.querySelector('#ctx-album')) menu.querySelector('#ctx-album').onclick = () => {
            if (window.showAlbumPage && track.album && track.album.id) {
                window.showAlbumPage({
                    id: track.album.id,
                    title: track.album.title,
                    cover: track.album.cover,
                    artists: [track.artist]
                });
            }
            closeMenu();
        };
        if (menu.querySelector('#ctx-play-next')) menu.querySelector('#ctx-play-next').onclick = () => {
            if (window.playNext) window.playNext(track);
            else if (window.addToQueue) window.addToQueue(track); 
            closeMenu();
        };
    } else if (albumCard) {
        const albumId = albumCard.dataset.albumId;
        if (menu.querySelector('#ctx-album-play')) menu.querySelector('#ctx-album-play').onclick = () => {
             if (window.playAlbumContext) window.playAlbumContext(albumId);
             closeMenu();
        };
        if (menu.querySelector('#ctx-album-shuffle')) menu.querySelector('#ctx-album-shuffle').onclick = () => {
             if (window.shuffleAlbumContext) window.shuffleAlbumContext(albumId);
             closeMenu();
        };
        if (menu.querySelector('#ctx-share-album')) menu.querySelector('#ctx-share-album').onclick = () => {
            if (window.shareContent) window.shareContent('album', albumId, title, subtitle);
            closeMenu();
        };
        if (menu.querySelector('#ctx-album-open')) menu.querySelector('#ctx-album-open').onclick = () => {
             albumCard.click();
             closeMenu();
        };
    } else if (artistCard) {
        const artistId = artistCard.dataset.artistId;
        if (menu.querySelector('#ctx-artist-open')) menu.querySelector('#ctx-artist-open').onclick = () => {
             artistCard.click();
             closeMenu();
        };
        if (menu.querySelector('#ctx-share-artist')) menu.querySelector('#ctx-share-artist').onclick = () => {
             if (window.shareContent) window.shareContent('artist', artistId, title, subtitle);
             closeMenu();
        };
    } else if (playlistCard) {
        const index = parseInt(playlistCard.dataset.playlistIndex);
        if (menu.querySelector('#ctx-playlist-play')) menu.querySelector('#ctx-playlist-play').onclick = () => {
             if (window.playPlaylist) window.playPlaylist(index);
             closeMenu();
        };
        if (menu.querySelector('#ctx-playlist-shuffle')) menu.querySelector('#ctx-playlist-shuffle').onclick = () => {
             if (window.shufflePlaylist) window.shufflePlaylist(index);
             closeMenu();
        };
        if (menu.querySelector('#ctx-playlist-delete')) menu.querySelector('#ctx-playlist-delete').onclick = () => {
             if (window.deletePlaylist) {
                 if(confirm("Are you sure you want to delete this playlist?")) {
                    window.deletePlaylist(index);
                 }
             }
             closeMenu();
        };
    }

    const clickOutsideHandler = (ev) => {
        if (!menu.contains(ev.target)) {
            closeMenu();
        }
    };

    setTimeout(() => {
        document.addEventListener('click', clickOutsideHandler);
    }, 10);
});

window.showTrackContextMenu = (e, trackId) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget || e.target;
    const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: e.clientX,
        clientY: e.clientY
    });
    target.dispatchEvent(contextMenuEvent);
};

window.showAlbumContextMenu = (e, albumId) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget || e.target;
    const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: e.clientX,
        clientY: e.clientY
    });
    target.dispatchEvent(contextMenuEvent);
};

window.showArtistContextMenu = (e, artistId) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget || e.target;
    const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: e.clientX,
        clientY: e.clientY
    });
    target.dispatchEvent(contextMenuEvent);
};

(() => {
    let timer = null;
    let startX = 0;
    let startY = 0;
    const LONG_PRESS_DURATION = 500;
    const MAX_MOVE_DISTANCE = 10;

    const handleTouchStart = (e) => {
        const target = e.target.closest('[data-track-id], [data-album-id], [data-artist-id], [data-playlist-index]');
        if (!target) return;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        timer = setTimeout(() => {
            const contextMenuEvent = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: startX,
                clientY: startY
            });
            target.dispatchEvent(contextMenuEvent);
            
            if (navigator.vibrate) navigator.vibrate(50);
        }, LONG_PRESS_DURATION);
    };

    const handleTouchMove = (e) => {
        if (!timer) return;
        const moveX = e.touches[0].clientX;
        const moveY = e.touches[0].clientY;
        
        if (Math.abs(moveX - startX) > MAX_MOVE_DISTANCE || Math.abs(moveY - startY) > MAX_MOVE_DISTANCE) {
            clearTimeout(timer);
            timer = null;
        }
    };

    const handleTouchEnd = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);
})();


