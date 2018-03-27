import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchMediaItem, fetchMediaItemStart } from '../../actions/postActions';
import Media from '../Media/Media';

class MediaPage extends React.Component {
  componentDidMount() {
    if (!this.props.mediaItems.find(mediaItem =>
      mediaItem.id === parseInt(this.props.match.params.id, 10)
      && mediaItem.mediaType === this.props.match.params.reviewType)) {
      this.props.fetchMediaItemStart();
      this.props.fetchMediaItem(
        this.props.match.params.id,
        this.props.match.params.reviewType,
        this.props.match.params.seasonNum,
        this.props.match.params.episodeNum,
      );
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.mediaItems.find(item =>
      item.id === parseInt(nextProps.match.params.id, 10))
       && (this.props.match.params !== nextProps.match.params)) {
      this.props.fetchMediaItemStart();
      this.props.fetchMediaItem(
        nextProps.match.params.id,
        nextProps.match.params.reviewType,
        nextProps.match.params.seasonNum,
        nextProps.match.params.episodeNum,
      );
    }
  }
  render() {
    const { mediaError, match, mediaLoading } = this.props;
    const mediaItem = this.props.mediaItems.find(item =>
      item.id === parseInt(match.params.id, 10)
      && item.mediaType === match.params.reviewType);
    return (
      <Layout>
        {!_.isEmpty(mediaError.FETCH_MEDIA_ITEM_ERROR)
          &&
          <div style={{ padding: 24 }}>
            <p>{mediaError.FETCH_MEDIA_ITEM_ERROR}. <Link to="/">Go home</Link></p>
          </div>}
        {_.isEmpty(mediaError.FETCH_MEDIA_ITEM_ERROR) && !mediaLoading
            && !_.isEmpty(mediaItem) &&
            <Media mediaItem={mediaItem} />
          }
      </Layout>
    );
  }
}

MediaPage.propTypes = {
  match: PropTypes.shape().isRequired,
  fetchMediaItem: PropTypes.func.isRequired,
  fetchMediaItemStart: PropTypes.func.isRequired,
  mediaItems: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  mediaLoading: PropTypes.bool.isRequired,
  mediaError: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  mediaItems: state.media.items,
  mediaLoading: state.media.itemLoading,
  mediaError: state.media.error,
});

export default connect(mapStateToProps, { fetchMediaItem, fetchMediaItemStart })(MediaPage);
