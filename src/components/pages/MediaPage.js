import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Layout, Divider } from 'antd';
import { getMediaType } from '../../helpers/mediaHelpers';
import MediaContainer from '../media/MediaContainer';
import PostsContainer from '../post/PostsContainer';
import Similar from '../media/Similar';

import './MediaPage.less';

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
      }, mediaLoaded,
    } = this.props;
    const type = getMediaType({ mediaType, seasonNum, episodeNum });
    const styles = {
      display: mediaLoaded ? 'initial' : 'none',
    };
    return (
      <Layout>
        <MediaContainer
          mediaType={type}
          tmdbid={id}
          seasonNum={seasonNum}
          episodeNum={episodeNum}
        />
        <Layout className="main-content MediaPage" style={styles}>
          <Divider type="horizontal" />
          <h2 style={{ marginBottom: 0 }}>Latest Posts</h2>
          <PostsContainer
            tmdbid={id}
            type={mediaType}
            seasonNum={seasonNum}
            episodeNum={episodeNum}
          />
          <Divider type="horizontal" />
          <Similar mediaType={mediaType} tmdbid={id} />
        </Layout>
      </Layout>
    );
  }
}

MediaPage.propTypes = {
  match: PropTypes.shape().isRequired,
  mediaLoaded: PropTypes.bool.isRequired,
};


const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: {
        id, mediaType, seasonNum, episodeNum,
      },
    },
  } = ownProps;
  let query = '';
  query += `[${mediaType}s].${id}`;
  if (seasonNum) query += `.seasons.${seasonNum}`;
  if (episodeNum) query += `.episodes.${episodeNum}`;
  return {
    mediaLoaded: _.get(state.media.itemStates, `${query}.loaded`, false),
  };
};

export default connect(mapStateToProps, {})(MediaPage);
