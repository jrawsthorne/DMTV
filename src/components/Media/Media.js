import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Card, Icon, Avatar, Spin } from 'antd';
import Dotdotdot from 'react-dotdotdot';
import { fetchMediaItem, fetchMediaItemStart } from '../../actions/postActions';

import noImageFound from '../../images/no-image-found.jpg';

const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const { Meta } = Card;

class Media extends React.Component {
  static propTypes = {
    fetchMediaItem: PropTypes.func.isRequired,
    fetchMediaItemStart: PropTypes.func.isRequired,
    mediaItems: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    mediaLoading: PropTypes.bool.isRequired,
    mediaError: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
  };
  state = {
    mediaItem: {},
    avatarImageLoaded: false,
    mediaImageLoaded: false,
  }
  componentDidMount() {
    if (!this.props.mediaItems.find(mediaItem =>
      mediaItem.id === parseInt(this.props.match.params.id, 10))) {
      this.props.fetchMediaItemStart();
      this.props.fetchMediaItem(this.props.match.params.id, this.props.match.params.reviewType);
    } else {
      this.setState({
        mediaItem: this.props.mediaItems.find(mediaItem =>
          mediaItem.id === parseInt(this.props.match.params.id, 10)),
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      mediaItem: nextProps.mediaItems.find(mediaItem =>
        mediaItem.id === parseInt(this.props.match.params.id, 10)),
    });
  }
  handleMediaImageLoaded = () => {
    this.setState({
      mediaImageLoaded: true,
    });
  }
  handleAvatarImageLoaded = () => {
    this.setState({
      avatarImageLoaded: true,
    });
  }
  render() {
    const {
      mediaError, mediaLoading,
    } = this.props;
    const { mediaItem, mediaImageLoaded, avatarImageLoaded } = this.state;
    return (
      <div>
        {!_.isEmpty(mediaError.FETCH_MEDIA_ERROR) && <p>{mediaError.FETCH_MEDIA_ERROR}</p>}
        {_.isEmpty(mediaError.FETCH_MEDIA_ERROR)
          && !mediaLoading
          && !_.isEmpty(mediaItem)
          &&
          <div id={mediaItem.id}>
            <Card
              style={{ width: '100%' }}
              cover={<img onLoad={this.handleMediaImageLoaded} alt="example" src={(mediaItem.poster_path && `https://image.tmdb.org/t/p/w300${mediaItem.poster_path}`) || (mediaItem.still_path && `https://image.tmdb.org/t/p/w300${mediaItem.still_path}`) || noImageFound} />}
              actions={mediaImageLoaded && ([<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />])}
              onClick={this.handleClick}
            >
              <Meta
                avatar={mediaImageLoaded && <Avatar onLoad={this.handleAvatarImageLoaded} src="https://steemitimages.com/u/jrawsthorne/avatar" />}
                title={!avatarImageLoaded ? <Spin indicator={loadingIcon} />
                  : (mediaItem.title || mediaItem.name)}
                description={avatarImageLoaded &&
                  <Dotdotdot clamp={6}>{mediaItem.overview}</Dotdotdot>}
                style={{ height: '170px', textOverflow: 'ellipsis', overflow: 'hidden' }}
              />
            </Card>
          </div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  mediaItems: state.media.items,
  mediaLoading: state.media.itemLoading,
  mediaError: state.media.error,
});

export default connect(mapStateToProps, { fetchMediaItem, fetchMediaItemStart })(Media);
