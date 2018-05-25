import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions/mediaActions';
import { getMediaItemDetails, getNextPrev } from '../../helpers/mediaHelpers';

import Loading from '../misc/Loading';

import Media from './Media';

class MediaContainer extends React.Component {
  componentDidMount() {
    const {
      mediaType,
      tmdbid,
      seasonNum,
      episodeNum,
      fetchMovie,
      fetchSimilarMovies,
      fetchShow,
      fetchSimilarShows,
      fetchSeason,
      fetchEpisode,
      mediaItem,
      fetching,
      loaded,
      failed,
      onLoad,
    } = this.props;
    if (!mediaItem || (!fetching && !loaded)) {
      if (mediaType === 'movie') fetchMovie(tmdbid).then(() => fetchSimilarMovies(tmdbid));
      if (mediaType === 'show') fetchShow(tmdbid).then(() => fetchSimilarShows(tmdbid));
      if (mediaType === 'season') fetchSeason(tmdbid, seasonNum).then(() => fetchSimilarShows(tmdbid));
      if (mediaType === 'episode') fetchEpisode(tmdbid, seasonNum, episodeNum).then(() => fetchSimilarShows(tmdbid));
    }
    onLoad({ fetching, loaded, failed });
  }
  componentWillReceiveProps(nextProps) {
    const {
      mediaType,
      tmdbid,
      seasonNum,
      episodeNum,
      fetchMovie,
      fetchSimilarMovies,
      fetchShow,
      fetchSimilarShows,
      fetchSeason,
      fetchEpisode,
      mediaItem,
      fetching,
      loaded,
      onLoad,
      failed,
    } = nextProps;
    if ((!mediaItem && !loaded && !fetching) || (!loaded && !fetching)) {
      if (mediaType === 'movie') fetchMovie(tmdbid).then(() => fetchSimilarMovies(tmdbid));
      if (mediaType === 'show') fetchShow(tmdbid).then(() => fetchSimilarShows(tmdbid));
      if (mediaType === 'season') fetchSeason(tmdbid, seasonNum).then(() => fetchSimilarShows(tmdbid));
      if (mediaType === 'episode') fetchEpisode(tmdbid, seasonNum, episodeNum).then(() => fetchSimilarShows(tmdbid));
    }
    onLoad({ fetching, loaded, failed }, mediaItem);
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
      noLoading,
      isAuthenticated,
      match: {
        path,
      },
    } = this.props;
    if (failed) return <div className="main-content"><p>Sorry, there was an error loading the metadata</p></div>;
    if (fetching || !loaded) return noLoading ? '' : <Loading />;
    const {
      backdropPath, posterPath, title, overview,
    } = getMediaItemDetails(mediaItem, mediaType, seasonNum, episodeNum);
    let prev;
    let next;
    if (seasonNum) {
      const nextPrev = getNextPrev(mediaItem, seasonNum, episodeNum);
      prev = _.get(nextPrev, 'prev');
      next = _.get(nextPrev, 'next');
    }
    return (
      <React.Fragment>
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
        />
      </React.Fragment>
    );
  }
}

MediaContainer.propTypes = {
  mediaItem: PropTypes.shape(),
  mediaType: PropTypes.string.isRequired,
  tmdbid: PropTypes.string.isRequired,
  seasonNum: PropTypes.string,
  episodeNum: PropTypes.string,
  fetchMovie: PropTypes.func.isRequired,
  fetchSimilarMovies: PropTypes.func.isRequired,
  fetchShow: PropTypes.func.isRequired,
  fetchSimilarShows: PropTypes.func.isRequired,
  fetchSeason: PropTypes.func.isRequired,
  fetchEpisode: PropTypes.func.isRequired,
  fetching: PropTypes.bool,
  failed: PropTypes.bool,
  loaded: PropTypes.bool,
  noLoading: PropTypes.bool,
  match: PropTypes.shape().isRequired,
  onLoad: PropTypes.func,
  isAuthenticated: PropTypes.bool.isRequired,
};

MediaContainer.defaultProps = {
  episodeNum: undefined,
  seasonNum: undefined,
  mediaItem: undefined,
  fetching: false,
  loaded: false,
  failed: false,
  noLoading: false,
  onLoad: () => { },
};

const mapStateToProps = (state, ownProps) => {
  const {
    mediaType, tmdbid, seasonNum, episodeNum,
  } = ownProps;
  let query = '';
  let type;
  if (mediaType === 'movie') {
    type = 'movies';
  } else if (mediaType === 'show' || mediaType === 'episode' || mediaType === 'season') {
    type = 'shows';
  }
  query += `${type}.${tmdbid}`;
  const mediaItem = _.get(state.media.items, query);
  if (seasonNum) query += `.seasons.${seasonNum}`;
  const fetching = _.get(state.media.itemStates, `${query}.fetching`);
  if (episodeNum) query += `.episodes.${episodeNum}`;
  const failed = _.get(state.media.itemStates, `${query}.failed`);
  const loaded = _.get(state.media.itemStates, `${query}.loaded`);
  return {
    mediaItem,
    fetching,
    loaded,
    failed,
    isAuthenticated: _.get(state, 'auth.isAuthenticated', false),
  };
};

export default withRouter(connect(mapStateToProps, {
  fetchMovie: actions.fetchMovie,
  fetchShow: actions.fetchShow,
  fetchEpisode: actions.fetchEpisode,
  fetchSeason: actions.fetchSeason,
  fetchSimilarMovies: actions.fetchSimilarMovies,
  fetchSimilarShows: actions.fetchSimilarShows,
})(MediaContainer));
