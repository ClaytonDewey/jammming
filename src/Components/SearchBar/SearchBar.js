import React from "react";

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search(term) {
        this.props.onSearch(term);
    }

    handleTermChange(e) {
        this.search(e.target.value);
    }

    render() {
        return (
            <section className="search">
                <label htmlFor="spotify-search" className="search__label">
                    Search: <span className="visually-hidden">Enter A Song, Album, or Artist</span>
                </label>
                <input
                    className="search__input"
                    id="spotify-search"
                    placeholder="Enter A Song, Album, or Artist"
                    onChange={this.handleTermChange}
                />
                <button className="btn btn-primary" onClick={this.search}>
                    SEARCH
                </button>
            </section>
        );
    }
}

export default SearchBar;
