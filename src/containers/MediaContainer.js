import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions/mediaActions';
import { getMediaItemDetails, getNextPrev } from '../helpers/mediaHelpers';
import { getMediaStatusFromState } from '../helpers/stateHelpers';
import { getMediaItem } from '../reducers';

import MediaLoading from '../components/media/MediaLoading';

import Media from '../components/media/Media';

class MediaContainer extends React.Component {
  componentDidMount() {
    const {
      mediaType,
      tmdbid,
      seasonNum,
      episodeNum,
      fetchMedia,
      mediaItem,
      fetching,
      loaded,
    } = this.props;
    /* Fetch metadata based on mediaType */
    if (!mediaItem || (!fetching && !loaded)) {
      fetchMedia({
        mediaType,
        tmdbid,
        seasonNum,
        episodeNum,
      });
    }
  }
  componentDidUpdate() {
    const {
      mediaType,
      tmdbid,
      seasonNum,
      episodeNum,
      fetchMedia,
      mediaItem,
      fetching,
      loaded,
    } = this.props;
    /* Fetch metadata based on mediaType */
    if ((!mediaItem && !loaded && !fetching) || (!loaded && !fetching)) {
      fetchMedia({
        mediaType,
        tmdbid,
        seasonNum,
        episodeNum,
      });
    }
  }
  render() {
    const {
      loaded,
      failed,
      fetching,
      mediaItem,
      tmdbid,
      mediaType,
      seasonNum,
      episodeNum,
      isAuthenticated,
      match: {
        path,
      },
    } = this.props;
    if (failed) return <div className="main-content"><p>Sorry, there was an error loading the metadata</p></div>;
    if (fetching || !loaded) {
      return (
        <MediaLoading
          isAuthenticated={isAuthenticated}
          isPostPage={path === '/@:author/:permlink'}
          isNewPostPage={path === '/new'}
        />
      );
    }
    /* get details based on type */
    const {
      backdropPath, posterPath, title, overview,
    } = getMediaItemDetails(mediaItem, mediaType, seasonNum, episodeNum);
    let prev;
    let next;
    /* add next and previous buttons if episode or season */
    if (seasonNum) {
      const nextPrev = getNextPrev(mediaItem, seasonNum, episodeNum);
      prev = _.get(nextPrev, 'prev');
      next = _.get(nextPrev, 'next');
    }
    return (
      <Media
        backdropPath={backdropPath}
        poster={posterPath}
        title={title}
        overview={overview}
        prev={prev}
        next={next}
        seasons={_.get(mediaItem, 'seasons')}
        episodes={_.get(mediaItem, `seasons[${seasonNum}].episodes`)}
        isAuthenticated={isAuthenticated}
        tmdbid={tmdbid}
        mediaType={mediaType}
        seasonNum={seasonNum}
        episodeNum={episodeNum}
        actors={mediaItem.actors}
        genres={mediaItem.genres}
        company={mediaItem.company}
        mediaItem={mediaItem}
        isPostPage={path === '/@:author/:permlink'}
        isNewPostPage={path === '/new'}
      />
    );
  }
}

MediaContainer.propTypes = {
  mediaItem: PropTypes.shape(),
  mediaType: PropTypes.string,
  tmdbid: PropTypes.string,
  seasonNum: PropTypes.string,
  episodeNum: PropTypes.string,
  fetchMedia: PropTypes.func.isRequired,
  fetching: PropTypes.bool,
  failed: PropTypes.bool,
  loaded: PropTypes.bool,
  match: PropTypes.shape().isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

MediaContainer.defaultProps = {
  mediaType: null,
  tmdbid: null,
  episodeNum: undefined,
  seasonNum: undefined,
  mediaItem: undefined,
  fetching: false,
  loaded: false,
  failed: false,
};

const mapStateToProps = (state, ownProps) => {
  const {
    mediaType, tmdbid, seasonNum, episodeNum,
  } = ownProps;
  return {
    mediaItem: getMediaItem(state, mediaType, tmdbid),
    ...getMediaStatusFromState({
      id: tmdbid, mediaType, seasonNum, episodeNum,
    }, state.media.itemStates),
    isAuthenticated: _.get(state, 'auth.isAuthenticated', false),
  };
};

const mapDispatchToProps = {
  fetchMedia: actions.fetchMedia,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MediaContainer));
