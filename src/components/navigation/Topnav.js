import React from 'react';
import PropTypes from 'prop-types';
import { Menu, AutoComplete, Input, Icon, Layout, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { search } from '../../actions/searchActions';
import { logout } from '../../actions/authActions';
import steemConnectAPI from '../../apis/steemConnectAPI';
import './Topnav.less';

class Topnav extends React.Component {
  static propTypes = {
    history: PropTypes.shape().isRequired,
    search: PropTypes.func.isRequired,
    searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
    fetching: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    loggingIn: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      searchBarValue: '',
    };
  }

  debouncedSearch = _.debounce(q => this.props.search(q), 300);

  handleAutoCompleteSearch = (value) => {
    this.debouncedSearch(value.trim());
  }

  handleSelectOnAutoCompleteDropdown = (value, option) => {
    this.props.history.push(option.props.url);
  }

  handleOnChangeForAutoComplete = (value) => {
    this.setState({
      searchBarValue: value,
    });
  }

  handleLoginClick = () => {
    const next = window.location.pathname.length > 1 ? window.location.pathname : '';
    window.location.href = steemConnectAPI.getLoginURL(next);
  }

  menuLoggedOut = () => {
    if (this.props.loggingIn) {
      return (
        <Menu className="Topnav__menu-container__menu" mode="horizontal">
          <Menu.Item className="logging-in" key="loggingIn"><Icon type="loading" style={{ fontSize: 24 }} spin /></Menu.Item>
        </Menu>
      );
    }
    return (
      <Menu className="Topnav__menu-container__menu" mode="horizontal">
        <Menu.Item key="signup">
          <a target="_blank" rel="noopener noreferrer" href="https://signup.steemit.com/">Sign up</a>
        </Menu.Item>
        <Menu.Item key="divider" disabled>|</Menu.Item>
        <Menu.Item key="login">
          {/* eslint-disable-next-line */}
          <a onClick={() => this.handleLoginClick()}>Log in</a>
        </Menu.Item>
      </Menu>
    );
  };

  menuLoggedIn = () =>
    (
      <Menu className="Topnav__menu-container__menu" mode="horizontal">
        <Menu.Item key="username">
          {this.props.username}
        </Menu.Item>
        <Menu.Item key="divider" disabled>|</Menu.Item>
        <Menu.Item key="logout">
          {/* eslint-disable-next-line */}
          <a onClick={() => this.props.logout()}>Logout</a>
        </Menu.Item>
      </Menu>
    )

    menuRight = () => (
      _.isEmpty(this.props.username) ? this.menuLoggedOut() : this.menuLoggedIn()
    );

    render() {
      const { searchBarValue } = this.state;
      const {
        searchResults, fetching,
      } = this.props;

      const dropdownOptions = _.map(searchResults, option => (
        <AutoComplete.Option key={`${option.id}`} title={option.title} url={option.url} className="Topnav__search-autocomplete">
          <img alt="result" width="45px" src={option.img} />
          {option.title} {option.year && `(${option.year})`}
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
                <span className="Topnav__version">0.1.0</span>
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
                    value={searchBarValue}
                    autoFocus
                    optionLabelProp="title"
                  >
                    <Input
                      placeholder="What are you looking for?"
                      autoCapitalize="off"
                      spellCheck="false"
                      autoCorrect="off"
                      suffix={fetching ? <Spin indicator={<Icon type="loading" style={{ fontSize: 16, color: '#cccccc' }} spin />} /> : <Icon type="search" />}
                    />
                  </AutoComplete>
                </div>
              </div>
              <div className="right">
                <div className="Topnav__menu-container">
                  {this.menuRight()}
                </div>
              </div>
            </div>
          </div>
        </Layout.Header>
      );
    }
}

const mapStateToProps = state => ({
  searchResults: state.search.results,
  fetching: state.search.fetching,
  loaded: state.search.loaded,
  failed: state.search.failed,
  loggingIn: state.auth.fetching,
});

export default connect(mapStateToProps, { search, logout })(Topnav);
