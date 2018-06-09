import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout, Divider } from 'antd';
import { getMediaType } from '../../helpers/mediaHelpers';
import { getMediaStatusFromState } from '../../helpers/stateHelpers';
import MediaContainer from '../media/MediaContainer';
import MediaPostsContainer from '../../containers/MediaPostsContainer';
import Similar from '../media/Similar';
import ScrollToTop from '../misc/ScrollToTop';

import './MediaPage.less';

const MediaPage = ({ match, mediaLoaded }) => {
  const {
    id, mediaType, seasonNum, episodeNum,
  } = match.params;
  const type = getMediaType({ mediaType, seasonNum, episodeNum });
  /* don't show posts until media loaded */
  const styles = {
    display: mediaLoaded ? 'initial' : 'none',
  };
  return (
    <Layout>
      <ScrollToTop />
      <MediaContainer
        mediaType={type}
        tmdbid={id}
        seasonNum={seasonNum}
        episodeNum={episodeNum}
      />
      <Layout className="main-content MediaPage" style={styles}>
        <Divider type="horizontal" />
        <h2>Latest Posts</h2>
        <MediaPostsContainer />
        <Divider type="horizontal" />
        <Similar mediaType={mediaType} tmdbid={id} />
      </Layout>
    </Layout>
  );
};

MediaPage.propTypes = {
  match: PropTypes.shape().isRequired,
  mediaLoaded: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  mediaLoaded: getMediaStatusFromState(ownProps.match.params, state.media.itemStates).loaded,
});

export default connect(mapStateToProps, {})(MediaPage);
