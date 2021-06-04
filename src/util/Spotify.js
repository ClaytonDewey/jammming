const client_id = "a3ad6940f4664f17aadb4906e0d0a8e8";
// const redirect_uri = "http://localhost:3000";
const redirect_uri = "http://dryadmedia.surge.sh";
const spotify_url = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${client_id}&redirect_uri=${redirect_uri}`;
let accessToken = undefined;
let expiresIn = undefined;

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
            window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
            window.history.pushState("Access Token", null, "/");
        } else {
            window.location = spotify_url;
        }
    },

    search(term) {
        const search_url = `https://api.spotify.com/v1/search?type=track&q=${term.replace(" ", "%20")}`;
        return fetch(search_url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                if (!jsonResponse.tracks) return [];

                return jsonResponse.tracks.items.map((track) => {
                    return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        image: track.album.images[2],
                        uri: track.uri,
                    };
                });
            });
    },

    savePlaylist(playlistName, trackUris) {
        if (!playlistName || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        let user_id;

        return fetch("https://api.spotify.com/v1/me", {
            headers: headers,
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                user_id = jsonResponse.id;

                return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify({ name: playlistName }),
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            console.error("API request failed");
                        }
                    })
                    .then((jsonResponse) => {
                        const playlist_id = jsonResponse.id;

                        return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`, {
                            headers: headers,
                            method: "POST",
                            body: JSON.stringify({ uris: trackUris }),
                        });
                    });
            });
    },
};

export default Spotify;
