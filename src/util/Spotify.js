const clientId = 'f595183f55e34c4a8f600bd999357fc8';
const redirectURI = 'http://localhost:3000/';
let accessToken = '';
let expiresIn = '';

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        
        const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
            if (urlAccessToken && urlExpiresIn) {
              accessToken = urlAccessToken[1];
              expiresIn = urlExpiresIn[1];
              window.setTimeout(() => accessToken = '', expiresIn * 1000);
              window.history.pushState('Access Token', null, '/');
            } else {
              window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            }
    },
        
    search(term) {
        Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => response.json()
        ).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            } else {
                return jsonResponse.tracks.items.map(track => {
                    return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }
                })
            }
        })   
    },
    
    savePlaylist(name, trackURIs) {
        if (name.length === 0 || trackURIs.length === 0) return;
        let userURL = 'https://api.spotify.com/v1/me';
        let header = {
             Authorization: `Bearer ${accessToken}`
        };
        let userID = '';
        let playlistID = '';
        
        fetch(userURL, {
            headers: header 
        }).then(response => response.json())
        .then(jsonResponse => userID = jsonResponse.id)
        .then(() => {
            let createPlaylistURL = `https://api.spotify.com/v1/users/${userID}/playlists`;
      
        fetch(createPlaylistURL, {
          method: 'POST',
          headers: header,
          body: JSON.stringify({
            name: name
          })
        })
        .then(response => response.json())
        .then(jsonResponse => playlistID = jsonResponse.id)
        .then(() => {
          const addPlaylistTracksURL = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
          fetch(addPlaylistTracksURL, {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
              uris: trackURIs
            })
          });
        })
        })    
    }
}
    
    
export default Spotify;