import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, Card } from 'antd';
import { Link } from 'react-router-dom';

const ReplyBox = ({ username }) => (
  <Card.Meta
    style={{ padding: '20px 0 10px 0' }}
    avatar={<div className="Comment__avatar" style={{ backgroundImage: `url(https://steemitimages.com/u/${username}/avatar/large)` }} />}
    title={<Link to={`/@${username}`}>{username}</Link>}
    description={<Input.TextArea />}
  />
);

ReplyBox.propTypes = {
  username: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  username: state.auth.user.name,
});

export default connect(mapStateToProps, null)(ReplyBox);
