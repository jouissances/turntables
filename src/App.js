import React from 'react';
import Spotify from './util/Spotify';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            playlistName: 'new playlist',
            playlistTracks: []
        }
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }

    addTrack(track) {
        let trackFound = this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id);
        if (!trackFound) {
            this.setState(prevState => ({
                playlistTracks: [...prevState.playlistTracks, track]
            }))
        }
    }

    removeTrack(track) {
        this.setState({
            playlistTracks: this.state.playlistTracks.filter(playlistTrack =>
                playlistTrack.id !== track.id)
        });
    }

    updatePlaylistName(name) {
        this.setState({
            playlistName: name
        })
    }

    savePlaylist() {
        let trackURIs = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
        Spotify.savePlaylist(this.state.playlistName, trackURIs);
        this.setState({
            searchResults: []
        });
        this.updatePlaylistName('My Playlist');
    }

    search(term) {
        Spotify.search(term).then(searchResults =>
            this.setState({
                searchResults: searchResults
            }));
    }

    render() {
        return ( <
            div >
            <
            h1 > Turntables < /h1>   <
            div className = "App" >
            <
            SearchBar onSearch = { this.search }
            / > <
            div className = "App-playlist" >
            <
            SearchResults searchResults = { this.state.searchResults }
            onAdd = { this.addTrack }
            />   <
            Playlist name = { this.state.playlistName }
            tracks = { this.state.playlistTracks }
            onRemove = { this.removeTrack }
            onNameChange = { this.updatePlaylistName }
            onSave = { this.savePlaylist }
            />   < /
            div > <
            /div>   < /
            div >
        );
    }
}

export default App;