import React from 'react';
import PropTypes from 'prop-types';
import { Menu, AutoComplete, Input, Icon, Layout } from 'antd';
import { Link } from 'react-router-dom';
import _ from 'lodash';

// import SearchBar from '../SearchBar/SearchBar';
import noImageFound from '../../images/no-image-found.jpg';

import SteemConnect from '../../apis/steemConnectAPI';

import './Topnav.less';

class Topnav extends React.Component {
  static propTypes = {
    history: PropTypes.shape().isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      searchBarValue: '',
    };
  }

  hideAutoCompleteDropdown = () => {
    this.setState({
      suggestions: [],
    });
  }

  handleSearchForInput = () => {
    this.hideAutoCompleteDropdown();
    this.setState({
      suggestions: [],
      searchBarValue: '',
    });
  }

  handleAutoCompleteSearch = (value) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length > 0) {
      const url = `https://api.themoviedb.org/3/search/multi?query=${trimmedValue}&api_key=2e0e3a384f4b2319fbe441f5da30407f`;
      fetch(url)
        .then(response => response.json())
        .then(json => json.results)
        .then((data) => {
          const results = data.filter(item => item.media_type !== 'person').map((mediaItem) => {
            const temp = {};
            temp.id = mediaItem.id;
            if (mediaItem.title) { temp.title = mediaItem.title; }
            if (mediaItem.name) { temp.title = mediaItem.name; }
            temp.img = mediaItem.poster_path;
            temp.media_type = mediaItem.media_type;
            if (mediaItem.media_type === 'tv') { temp.media_type = 'show'; }
            const date = mediaItem.release_date ?
              mediaItem.release_date : mediaItem.first_air_date;
            temp.year = new Date(date).getFullYear();
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

  handleSelectOnAutoCompleteDropdown = (value) => {
    this.setState({
      suggestions: [],
      searchBarValue: '',
    });
    this.props.history.push(value);
  }

  hideAutoCompleteDropdown = () => {
    this.setState({
      suggestions: [],
      searchBarValue: '',
    });
  }

  handleOnChangeForAutoComplete = (value) => {
    this.setState({
      searchBarValue: value,
    });
  }

  render() {
    const { suggestions, searchBarValue } = this.state;

    const dropdownOptions = _.map(suggestions, option => (
      <AutoComplete.Option key={`option-${option.id}`} value={`/${option.media_type}/${option.id}`} className="Topnav__search-autocomplete">
        <img alt="result" width="45px" src={option.img == null ? noImageFound : `https://image.tmdb.org/t/p/w45/${option.img}`} />
        {option.title} ({option.year})
      </AutoComplete.Option>
    ));

    return (
      <Layout.Header style={{ position: 'fixed', width: '100%', zIndex: 1050 }}>
        <div className="Topnav">
          <div className="topnav-layout">
            <div className="left">
              <Link className="Topnav__logo" to="/">
                  Review
              </Link>
              <span className="Topnav__version">0.0.1</span>
            </div>
            <div className="center">
              <div className="Topnav__input-container">
                <AutoComplete
                  dropdownClassName="Topnav__search-dropdown-container"
                  dataSource={dropdownOptions}
                  onSearch={this.handleAutoCompleteSearch}
                  onChange={this.handleOnChangeForAutoComplete}
                  onSelect={this.handleSelectOnAutoCompleteDropdown}
                  defaultActiveFirstOption={false}
                  dropdownMatchSelectWidth={false}
                  optionLabelProp="value"
                  value={searchBarValue}
                >
                  <Input
                    ref={(ref) => {
                    this.searchInputRef = ref;
                  }}
                    onPressEnter={this.handleSearchForInput}
                    placeholder="What are you looking for?"
                    autoCapitalize="off"
                    autoCorrect="off"
                    suffix={<Icon type="search" className="certain-category-icon" />}
                  />
                </AutoComplete>
                <i className="iconfont icon-search" />
              </div>
            </div>
            <div className="right">
              <div className="Topnav__menu-container">
                <Menu className="Topnav__menu-container__menu" mode="horizontal">
                  <Menu.Item key="signup">
                    <a target="_blank" rel="noopener noreferrer" href="https://signup.steemit.com/">
                          Sign up
                    </a>
                  </Menu.Item>
                  <Menu.Item key="divider" disabled>
                      |
                  </Menu.Item>
                  <Menu.Item key="login">
                    <a href={SteemConnect.getLoginURL()}>
                        Log in
                    </a>
                  </Menu.Item>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </Layout.Header>
    );
  }
}

export default Topnav;
