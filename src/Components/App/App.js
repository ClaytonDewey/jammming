import React from "react";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

Spotify.getAccessToken();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            playlistName: "My Playlist",
            playlistTracks: [],
        };

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }

    addTrack(track) {
        if (!this.state.playlistTracks.some((playlistTrack) => playlistTrack.id === track.id)) {
            this.state.playlistTracks.push(track);
            this.setState({ playlistTracks: this.state.playlistTracks });
        }
    }

    removeTrack(track) {
        let tracks = this.state.playlistTracks;
        tracks = tracks.filter((current) => current.id !== track.id);
        this.setState({ playlistTracks: tracks });
    }

    updatePlaylistName(name) {
        this.setState({ playlistName: name });
    }

    savePlaylist() {
        const trackUris = this.state.playlistTracks.map((playlistTrack) => playlistTrack.uri);
        Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
            this.setState({
                searchResults: [],
                playlistName: "New Playlist",
                playlistTracks: [],
            });
        });
    }

    search(term) {
        Spotify.search(term).then((searchResults) =>
            this.setState({
                searchResults: searchResults,
            })
        );
    }

    render() {
        return (
            <div>
                <header>
                    <h1>
                        Ja<span className="highlight">\m/</span>ing
                    </h1>
                </header>
                <main id="main-content" className="App">
                    <SearchBar onSearch={this.search} />
                    <div className="grid__container">
                        <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
                        <Playlist
                            playlistName={this.state.playlistName}
                            playlistTracks={this.state.playlistTracks}
                            onRemove={this.removeTrack}
                            onNameChange={this.updatePlaylistName}
                            onSave={this.savePlaylist}
                        />
                    </div>
                </main>
            </div>
        );
    }
}

export default App;
