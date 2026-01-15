document.addEventListener('contextmenu', (e) => {
    const trackCard = e.target.closest('[data-track-id]');

    if (!trackCard) return;

    e.preventDefault();

    const existingMenu = document.getElementById('custom-context-menu');
    if (existingMenu) {
        existingMenu.remove();
        document.body.style.overflow = '';
    }

    const trackId = trackCard.dataset.trackId;
    const track = window.getTrackById ? window.getTrackById(trackId) : null;

    if (!track) {
        console.warn("Track data not found for ID:", trackId);
        return;
    }

    document.body.style.overflow = 'hidden';

    const menu = document.createElement('div');
    menu.id = 'custom-context-menu';
    menu.className = "fixed z-[100] w-56 bg-gray-900 border border-white/10 rounded-xl shadow-2xl py-1 transform scale-95 opacity-0 transition-all duration-200 origin-top-left";

    const { clientX: mouseX, clientY: mouseY } = e;
    menu.style.left = `${mouseX}px`;
    menu.style.top = `${mouseY}px`;

    menu.innerHTML = `
        <div class="px-4 py-3 border-b border-white/10 mb-1">
            <div class="text-sm font-medium text-white truncate">${track.title}</div>
            <div class="text-xs text-gray-400 truncate">${track.artist.name}</div>
        </div>
        
        <button class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-play-next">
             <i data-lucide="play" class="w-4 h-4"></i> Play Next
        </button>
        <button class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-add-queue">
             <i data-lucide="list-plus" class="w-4 h-4"></i> Add to Queue
        </button>
        
        <div class="h-px bg-white/10 my-1 mx-2"></div>
        
        <button class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-favorite">
             <i data-lucide="heart" class="w-4 h-4 ${window.isFavorite && window.isFavorite(track) ? 'fill-current text-red-500' : ''}"></i> 
             ${window.isFavorite && window.isFavorite(track) ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
        <button class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-playlist">
             <i data-lucide="plus-square" class="w-4 h-4"></i> Add to Playlist
        </button>
        
        <div class="h-px bg-white/10 my-1 mx-2"></div>

        <button class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-artist">
             <i data-lucide="user" class="w-4 h-4"></i> Go to Artist
        </button>
         <button class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors" id="ctx-album">
             <i data-lucide="disc" class="w-4 h-4"></i> Go to Album
        </button>
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

    menu.querySelector('#ctx-add-queue').onclick = () => {
        if (window.addToQueue) window.addToQueue(track);
        closeMenu();
    };
    menu.querySelector('#ctx-favorite').onclick = async () => {
        if (window.toggleFavorite) await window.toggleFavorite(track);
        closeMenu();
    };
    menu.querySelector('#ctx-playlist').onclick = () => {
        if (window.showAddToPlaylistModal) window.showAddToPlaylistModal(track);
        closeMenu();
    };
    menu.querySelector('#ctx-artist').onclick = () => {
        if (window.showArtistPage && track.artist && track.artist.id) window.showArtistPage(track.artist.id);
        closeMenu();
    };
    menu.querySelector('#ctx-album').onclick = () => {
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
     menu.querySelector('#ctx-play-next').onclick = () => {
        if (window.playNext) window.playNext(track);
        else if (window.addToQueue) {
             window.addToQueue(track); 
        }
        closeMenu();
    };

    const closeMenu = () => {
        document.body.style.overflow = '';
        
        menu.classList.remove('scale-100', 'opacity-100');
        menu.classList.add('scale-95', 'opacity-0');
        setTimeout(() => menu.remove(), 200);
        document.removeEventListener('click', clickOutsideHandler);
    };

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
