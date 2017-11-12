import React from 'react';
import './Track.css';

class Track extends React.Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.previewTrack = this.previewTrack.bind(this);
    }
    
    renderAction() {
        if (!this.props.onAdd) {
            return <a className = 'Track-action' onClick = { this.removeTrack } > - < /a>
        } else {
            return <a className = 'Track-action' onClick = { this.addTrack } > + < /a>; 
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }
    
    previewTrack() {
        let audio = new Audio(this.props.track.preview);
        audio.play(); 
    }

    render() {
        return ( 
            <div className = "Track" >
                <div className = "Track-information" >
                    <h3> { this.props.track.name } </h3>  
                    <p> { this.props.track.artist } | { this.props.track.album } </p>  
                </div>  
                <a className = "Track-preview" onClick = { this.previewTrack } > ▻ < /a>
            {this.renderAction()}
            </div>
        )
    }
}

export default Track;