import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { PropTypes } from 'prop-types';
import Autosuggest from 'react-autosuggest';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [],
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length > 0) {
      const url = `https://api.themoviedb.org/3/search/multi?query=${trimmedValue}&api_key=2e0e3a384f4b2319fbe441f5da30407f`;
      fetch(url)
        .then(response => response.json())
        .then(json => json.results)
        .then((data) => {
          const results = data.map((movie) => {
            const temp = {};
            temp.id = movie.id;
            if (movie.title) { temp.title = movie.title; }
            if (movie.name) { temp.title = movie.name; }
            temp.img = movie.poster_path;
            return temp;
          });
          this.setState({
            suggestions: results,
          });
        })
        .catch(error => new Error(error));
    } else {
      this.setState({
        suggestions: [],
      });
    }
  }


  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };


  onSuggestionSelected = (event, { suggestion, method }) => {
    if (method === 'enter') { event.preventDefault(); }
    this.props.dispatch(push(`/movie/${suggestion.id}`));
    this.setState({ value: '' });
  };

  getSuggestionValue = suggestion => suggestion.title;

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      return this.handleSubmit(this.state.value);
    }
    return true;
  }

  handleSubmit = (searchText) => {
    this.props.dispatch(push(`/search/${searchText}`));
    this.setState({ value: '' });
  }

  renderSuggestion = suggestion => (
    <a href="/">
      <img alt="result" className="searchResult-image" src={suggestion.img == null ? '' : `https://image.tmdb.org/t/p/w45/${suggestion.img}`} />
      <div className="searchResult-text">
        <div className="searchResult-name">
          {suggestion.title}
        </div>
        {suggestion.year}
      </div>
    </a>
  );

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      value,
      onChange: this.onChange,
      onKeyPress: this.handleKeyDown,
      placeholder: 'Search for something...',
    };

    return (
      <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

SearchBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(SearchBar);
