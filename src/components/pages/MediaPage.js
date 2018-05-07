import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { getMediaType } from '../../helpers/mediaHelpers';
import MediaContainer from '../media/MediaContainer';
import PostsContainer from '../post/PostsContainer';

class MediaPage extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    const {
      match: {
        params: {
          id, mediaType, seasonNum, episodeNum,
        },
      },
    } = this.props;
    const type = getMediaType({ mediaType, seasonNum, episodeNum });
    return (
      <Layout>
        <MediaContainer
          mediaType={type}
          tmdbid={id}
          seasonNum={seasonNum}
          episodeNum={episodeNum}
        />
        <Layout className="main-content">
          <h2>Latest Reviews</h2>
          <PostsContainer
            tmdbid={id}
            mediaType={type}
            seasonNum={seasonNum}
            episodeNum={episodeNum}
          />
        </Layout>
      </Layout>
    );
  }
}

MediaPage.propTypes = {
  match: PropTypes.shape().isRequired,
};

export default MediaPage;
