import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, Input, Icon, Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import theMovieDBAPI from '../../apis/theMovieDBAPI';
import noImageFound from '../../images/no-image-found.jpg';

class Search extends React.Component {
  state = {
    searchBarValue: '',
    results: [],
    fetching: false,
  };

  handleSearch = (q) => {
    this.setState({ fetching: true });
    if (q) {
      theMovieDBAPI.searchMulti({ query: q })
        .then(response => response.results)
        .then(data =>
        // filter out people
        /* TODO: Ability to search for people */
          data.map(mediaItem => ({
            id: mediaItem.id,
            title: _.get(mediaItem, 'title') || _.get(mediaItem, 'name') || 'No title',
            /* set image to placeholder if not found */
            img: (mediaItem.poster_path && `https://image.tmdb.org/t/p/w45${mediaItem.poster_path}`) || (mediaItem.profile_path && `https://image.tmdb.org/t/p/w45${mediaItem.profile_path}`) || noImageFound,
            year: (mediaItem.release_date && new Date(mediaItem.release_date).getFullYear()) ||
          (mediaItem.first_air_date && new Date(mediaItem.first_air_date).getFullYear()),
            /* convert tmdbid types */
            url: `/${mediaItem.media_type === 'tv' ? 'show' : mediaItem.media_type}/${mediaItem.id}`,
          })))
        .then(res => this.setState({ results: res, fetching: false }));
    } else {
      this.setState({
        results: [],
        fetching: false,
        searchBarValue: '',
      });
    }
  }

  /* wait 0.3s before searching */
  debouncedSearch = _.debounce(q => this.handleSearch(q), 300);

  /* search with trimmed value on change */
  handleAutoCompleteSearch = (value) => {
    this.debouncedSearch(value.trim());
  }

  /* go to media page on select */
  handleSelectOnAutoCompleteDropdown = (value, option) => {
    this.props.history.push(option.props.url);
  }

  handleOnChangeForAutoComplete = (value) => {
    this.setState({
      searchBarValue: value,
    });
  }

  render() {
    const { searchBarValue, results, fetching } = this.state;
    const { dropdownClassName } = this.props;

    const dropdownOptions = _.map(results, option => (
      <AutoComplete.Option key={`${option.id}`} title={option.title} url={option.url} className="search-autocomplete">
        <img alt="" width="45px" src={option.img} />
        {option.title} {option.year && `(${option.year})`}
      </AutoComplete.Option>
    ));

    return (
      <AutoComplete
        dropdownClassName={dropdownClassName}
        dataSource={dropdownOptions}
        onSearch={this.handleAutoCompleteSearch}
        onChange={this.handleOnChangeForAutoComplete}
        onSelect={this.handleSelectOnAutoCompleteDropdown}
        defaultActiveFirstOption={false}
        dropdownMatchSelectWidth={false}
        value={searchBarValue}
        autoFocus
        optionLabelProp="title"
      >
        <Input
          placeholder="What are you looking for?"
          autoCapitalize="off"
          spellCheck="false"
          autoCorrect="off"
          /* search and fetching icon */
          suffix={fetching ? <Spin indicator={<Icon type="loading" style={{ fontSize: 16, color: '#cccccc' }} spin />} /> : <Icon type="search" />}
        />
      </AutoComplete>
    );
  }
}

Search.propTypes = {
  history: PropTypes.shape().isRequired,
  dropdownClassName: PropTypes.string.isRequired,
};

export default withRouter(Search);
