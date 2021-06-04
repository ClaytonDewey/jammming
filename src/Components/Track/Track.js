import React from "react";

class Track extends React.Component {
    constructor(props) {
        super(props);

        this.renderAction = this.renderAction.bind(this);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }

    renderAction() {
        if (this.props.isRemoval) {
            return (
                <button onClick={this.removeTrack} className="track__action">
                    {" "}
                    -{" "}
                </button>
            );
        } else {
            return (
                <button onClick={this.addTrack} className="track__action">
                    {" "}
                    +{" "}
                </button>
            );
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    render() {
        return (
            <div className="track__item mb-3">
                <img
                    alt=""
                    src={this.props.track.image.url}
                    width={this.props.track.image.width}
                    height={this.props.track.height}
                    className="mr-1 mb-1"
                />
                <div className="track__info">
                    <h3>{this.props.track.name}</h3>
                    <p>
                        {this.props.track.artist} | {this.props.track.album}
                    </p>
                </div>
                {this.renderAction()}
            </div>
        );
    }
}

export default Track;
