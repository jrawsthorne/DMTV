import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { newPostInfo } from '../../actions/postActions';

class NewPostButton extends React.Component {
  handleNewPostClick = () => {
    const {
      mediaType, tmdbid, title, seasonNum, episodeNum,
    } = this.props;
    this.props.newPostInfo({
      mediaType,
      tmdbid,
      seasonNum: seasonNum && seasonNum.toString(),
      episodeNum: episodeNum && episodeNum.toString(),
      search: {
        value: title,
      },
      mediaTitle: title,
      searchResults: [],
      searchFetching: false,
    });
    this.props.history.push('/new');
  }
  render() {
    return (
      <Button className="NewPostButton" onClick={this.handleNewPostClick}>
        New Post
      </Button>
    );
  }
}

NewPostButton.propTypes = {
  mediaType: PropTypes.string.isRequired,
  tmdbid: PropTypes.string.isRequired,
  seasonNum: PropTypes.string,
  episodeNum: PropTypes.string,
  title: PropTypes.string.isRequired,
  newPostInfo: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
};

NewPostButton.defaultProps = {
  seasonNum: undefined,
  episodeNum: undefined,
};

export default withRouter(connect(null, { newPostInfo })(NewPostButton));
