import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Divider } from 'antd';
import { getMediaType } from '../../helpers/mediaHelpers';
import MediaContainer from '../media/MediaContainer';
import PostsContainer from '../post/PostsContainer';

class MediaPage extends React.Component {
  state = {
    mediaStatus: { failed: false, fetching: false, loaded: false },
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onMediaLoad = mediaStatus =>
    this.setState({
      mediaStatus,
    })
  render() {
    const {
      match: {
        params: {
          id, mediaType, seasonNum, episodeNum,
        },
      },
    } = this.props;
    const { mediaStatus } = this.state;
    const type = getMediaType({ mediaType, seasonNum, episodeNum });
    return (
      <Layout>
        <MediaContainer
          mediaType={type}
          tmdbid={id}
          seasonNum={seasonNum}
          episodeNum={episodeNum}
          onLoad={this.onMediaLoad}
        />
        {mediaStatus.loaded && !mediaStatus.failed &&
          <Layout className="main-content">
            <Divider type="horizontal" />
            <h2 style={{ marginBottom: 0 }}>Latest Posts</h2>
            <PostsContainer
              tmdbid={id}
              type={mediaType}
              seasonNum={seasonNum}
              episodeNum={episodeNum}
            />
          </Layout>}
      </Layout>
    );
  }
}

MediaPage.propTypes = {
  match: PropTypes.shape().isRequired,
};

export default MediaPage;
