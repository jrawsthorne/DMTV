/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu, Spin, Icon } from 'antd';
import SteemConnect from '../../steemConnectAPI';

import './Topnav.less';

class Topnav extends React.Component {
  menuForLoggedOut = () => {
    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
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
          <Menu.Item key="loading" className="Topnav__item-user">
            <a className="Topnav__user" role="presentation">
              <Spin indicator={loadingIcon} />
            </a>
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  render() {
    return (
      <div className="Topnav">
        <div className="topnav-layout">
          <div className="left">
            Review
            <span className="Topnav__version">0.0.1</span>
          </div>
          <div className="right">
            {this.menuForLoggedOut()}
          </div>
        </div>
      </div>
    );
  }
}

export default Topnav;
