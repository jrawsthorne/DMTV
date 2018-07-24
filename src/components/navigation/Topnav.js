import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon, Layout, Avatar, Popover } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { logout } from '../../actions/authActions';
import LoginLink from '../misc/LoginLink';
import './Topnav.less';
import Search from '../misc/Search';

class Topnav extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    loggingIn: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
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
          <LoginLink />
        </Menu.Item>
      </Menu>
    );
  };

  menuLoggedIn = () =>
    (
      <Menu className="Topnav__menu-container__menu" mode="horizontal">
        <Menu.Item key="username">
          <Popover
            content={
              <Link to="/subscriptions">Subscriptions</Link>
            }
          >
            <Link to={`/@${this.props.username}`}><Avatar size="large" src={`https://steemitimages.com/u/${this.props.username}/avatar/small`} /></Link>
          </Popover>
        </Menu.Item>
        <Menu.Item key="divider" disabled>|</Menu.Item>
        <Menu.Item key="logout">
          {/* eslint-disable-next-line */}
          <a onClick={() => this.props.logout()}>Logout</a>
        </Menu.Item>
      </Menu>
    )

  /* show different menu based on authentication state */
  menuRight = () => (
    _.isEmpty(this.props.username) ? this.menuLoggedOut() : this.menuLoggedIn()
  );

  render() {
    return (
      <Layout.Header style={{ position: 'fixed', width: '100%', zIndex: 1050 }}>
        <div className="Topnav">
          <div className="topnav-layout">
            <div className="left">
              <Link className="Topnav__logo" to="/">
                dmtv
              </Link>
              <span className="Topnav__version">0.1.0</span>
            </div>
            <div className="center">
              <div className="Topnav__input-container">
                <Search dropdownClassName="Topnav-search-dropdown-container" />
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
  loggingIn: state.auth.fetching,
});

export default connect(mapStateToProps, { logout })(Topnav);
