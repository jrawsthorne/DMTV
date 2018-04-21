import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../actions/mediaActions';
import Movie from '../media/Media';
import { getMediaItemDetails } from '../../helpers/mediaHelpers';
import Error404Page from '../pages/Error404Page';
import Loading from '../misc/Loading';

class MoviePage extends React.Component {
  componentDidMount() {
    const { movie, fetchMovie, match: { params: { id } } } = this.props;
    if (!movie) {
      fetchMovie(id);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { movie, fetchMovie, match: { url, params: { id } } } = nextProps;
    const { url: currentURL } = this.props.match;
    if (!movie && url !== currentURL) {
      fetchMovie(id);
    }
  }

  render() {
    const {
      movie, loaded, failed, fetching,
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
  movie: PropTypes.shape(),
  fetching: PropTypes.bool,
  failed: PropTypes.bool,
  loaded: PropTypes.bool,
};

MoviePage.defaultProps = {
  movie: undefined,
  fetching: false,
  failed: false,
  loaded: false,
};

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { id } } } = ownProps;
  return {
    movie: _.get(state.media.items, `movies[${id}]`),
    fetching: _.get(state.media.itemStates, `movies[${id}].fetching`),
    failed: _.get(state.media.itemStates, `movies[${id}].failed`),
    loaded: _.get(state.media.itemStates, `movies[${id}].loaded`),
  };
};

export default connect(mapStateToProps, { fetchMovie: actions.fetchMovie })(MoviePage);
