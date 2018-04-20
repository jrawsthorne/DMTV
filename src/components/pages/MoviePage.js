import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchMovie } from '../../actions/mediaActions';
import Movie from '../Media/Media';
import { getMediaItem, getMediaItemState } from '../../reducers';
import { getMediaItemDetails } from '../../helpers/mediaHelpers';
import Error404Page from '../pages/Error404Page';
import Loading from '../misc/Loading';

class MoviePage extends React.Component {
  componentDidMount() {
    const { mediaItem: movie, fetchMovie: fetch, match: { params: { id } } } = this.props;
    if (!movie) {
      fetch(id);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { mediaItem: movie, fetchMovie: fetch, match: { url, params: { id } } } = nextProps;
    const { url: currentURL } = this.props.match;
    if (!movie && url !== currentURL) {
      fetch(id);
    }
  }

  render() {
    const {
      mediaItem: movie, loaded, failed, fetching,
    } = this.props;

    if (failed) return <Error404Page />;
    if (fetching || !loaded) return <Loading />;
    const movieDetails = getMediaItemDetails(movie, 'movie');
    return (
      <Layout>
        <Movie
          poster={movieDetails.posterPath}
          overview={movieDetails.overview}
          title={movieDetails.title}
          backdropPath={movieDetails.backdropPath}
        />
      </Layout>
    );
  }
}

MoviePage.propTypes = {
  match: PropTypes.shape().isRequired,
  fetchMovie: PropTypes.func.isRequired,
  mediaItem: PropTypes.shape(),
  fetching: PropTypes.bool,
  failed: PropTypes.bool,
  loaded: PropTypes.bool,
};

MoviePage.defaultProps = {
  mediaItem: undefined,
  fetching: false,
  failed: false,
  loaded: false,
};

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { id } } } = ownProps;
  return {
    mediaItem: getMediaItem(state, 'movie', id),
    fetching: _.get(getMediaItemState(state, 'movie', id), 'fetching'),
    failed: _.get(getMediaItemState(state, 'movie', id), 'failed'),
    loaded: _.get(getMediaItemState(state, 'movie', id), 'loaded'),
  };
};

export default connect(mapStateToProps, { fetchMovie })(MoviePage);
