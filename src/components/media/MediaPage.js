import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Divider } from 'antd';
import { getMediaType } from '../../helpers/mediaHelpers';
import MediaContainer from '../../containers/MediaContainer';
import MediaPostsContainer from '../../containers/MediaPostsContainer';
import Similar from '../media/Similar';
import ScrollToTop from '../misc/ScrollToTop';
import ReloadFeedButton from '../misc/ReloadFeedButton';

import './MediaPage.less';

const MediaPage = ({ match }) => {
  const {
    id, mediaType, seasonNum, episodeNum,
  } = match.params;
  const type = getMediaType({ mediaType, seasonNum, episodeNum });
  return (
    <Layout>
      <ScrollToTop />
      <MediaContainer
        mediaType={type}
        tmdbid={id}
        seasonNum={seasonNum}
        episodeNum={episodeNum}
      />
      <Layout className="main-content MediaPage">
        <Divider type="horizontal" />
        <h2>Latest Posts
          <ReloadFeedButton
            sortBy="created"
            category={{
              type: mediaType,
              tmdbid: id,
              seasonNum,
              episodeNum,
            }}
          />
        </h2>
        <MediaPostsContainer />
        <Divider type="horizontal" />
        <Similar mediaType={mediaType} tmdbid={id} />
      </Layout>
    </Layout>
  );
};

MediaPage.propTypes = {
  match: PropTypes.shape().isRequired,
};

export default MediaPage;
