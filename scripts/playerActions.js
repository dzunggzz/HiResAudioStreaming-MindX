import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const PlayerActions = {
  async createPlaylist(db, currentUser, title, description = "") {
    if (!currentUser) throw new Error("User not logged in");

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

    const docRef = doc(db, "playlists", currentUser.uid);
    await setDoc(
      docRef,
      {
        playlists: arrayUnion(newPlaylist),
      },
      { merge: true }
    );

    return newPlaylist;
  },

  async addTrackToPlaylist(db, currentUser, playlist, track) {
    if (!currentUser || !playlist) throw new Error("Invalid params");

    if (playlist.tracks.some((t) => t.id === track.id)) {
      throw new Error("Track already in playlist");
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

    const docRef = doc(db, "playlists", currentUser.uid);
    await updateDoc(docRef, {
      playlists: arrayRemove(playlist),
    });
    await updateDoc(docRef, {
      playlists: arrayUnion(updatedPlaylist),
    });

    return updatedPlaylist;
  },

  async deletePlaylist(db, currentUser, playlist) {
    if (!currentUser) throw new Error("User not logged in");
    
    const docRef = doc(db, "playlists", currentUser.uid);
    await updateDoc(docRef, {
      playlists: arrayRemove(playlist),
    });
  },

  async toggleFavorite(db, currentUser, favorites, track) {
    if (!currentUser) throw new Error("User not logged in");

    const index = favorites.findIndex((fav) => fav.id === track.id);
    const docRef = doc(db, "favorites", currentUser.uid);
    let isAdded = false;

    if (index > -1) {
        await updateDoc(docRef, {
            tracks: arrayRemove(track),
        });
        isAdded = false;
    } else {
        await setDoc(
            docRef,
            {
                tracks: arrayUnion(track),
            },
            { merge: true }
        );
        isAdded = true;
    }
    return isAdded;
  },

  async addToRecentlyPlayed(db, currentUser, track) {
    if (!currentUser || !track) return;
    const docRef = doc(db, "history", currentUser.uid);
    try {
        const docSnap = await getDoc(docRef);
        let history = [];
        if (docSnap.exists()) {
            history = docSnap.data().tracks || [];
        }
        
        history = history.filter(t => t.id !== track.id);
        
        history.unshift(track);
        
        if (history.length > 20) {
            history = history.slice(0, 20);
        }
        
        await setDoc(docRef, { tracks: history }, { merge: true });
        return history;
    } catch (e) {
        console.error("Error updating recently played:", e);
        return null;
    }
  }
};
