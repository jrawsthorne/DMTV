import React from 'react';
import PropTypes from 'prop-types';
import steemConnectAPI from '../../apis/steemConnectAPI';

class LoginLink extends React.Component {
  handleLoginClick = () => {
    const next = window.location.pathname.length > 1 ? window.location.pathname : '';
    window.location.href = steemConnectAPI.getLoginURL(next);
  }
  render() {
    return (
      <a role="button" tabIndex={0} onClick={() => this.handleLoginClick()} onKeyPress={() => this.handleLoginClick()}>{this.props.linkText}</a>
    );
  }
}

LoginLink.propTypes = {
  linkText: PropTypes.string,
};

LoginLink.defaultProps = {
  linkText: 'Log in',
};

export default LoginLink;
