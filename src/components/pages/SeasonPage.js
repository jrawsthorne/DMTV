import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchSeason, fetchSeasonAndShow } from '../../actions/mediaActions';
import Show from '../Media/Media';
import EpisodeList from '../Media/EpisodeList';
import { getMediaItem, getMediaItemState } from '../../reducers';
import { getSeasonDetails } from '../../helpers/mediaHelpers';
import Error404Page from '../pages/Error404Page';
import Loading from '../misc/Loading';

class SeasonPage extends React.Component {
  state = {
    showEpisodes: false,
  }
  componentDidMount() {
    const {
      mediaItem: show,
      fetchSeason: fetch,
      fetchSeasonAndShow: fetchS,
      match: {
        params: {
          id,
          seasonNum,
        },
      },
    } = this.props;
    const episodesLoaded = _.get(show, `seasons[${seasonNum}].episodes`);
    if (!show) {
      fetchS(id, seasonNum, show);
    } else if (!episodesLoaded) {
      fetch(id, seasonNum);
    }
  }
  componentWillReceiveProps(nextProps) {
    const {
      mediaItem: show,
      fetchSeason: fetch,
      match: {
        url,
        params: {
          id, seasonNum,
        },
      },
    } = nextProps;
    const episodesLoaded = _.get(show, `seasons[${seasonNum}].episodes`);
    const { url: currentURL } = this.props.match;
    if (!episodesLoaded && url !== currentURL) {
      fetch(id, seasonNum, show);
    }
    if (url !== currentURL) {
      this.setState({
        showEpisodes: false,
      });
    }
  }
  handleEpisodeListClick = () =>
    this.setState({
      showEpisodes: !this.state.showEpisodes,
    })

  render() {
    const {
      match: { params: { seasonNum } }, mediaItem: show, loaded, failed, fetching,
    } = this.props;

    if (failed) return <Error404Page />;
    if (fetching || !loaded) return <Loading />;
    const showDetails = getSeasonDetails(show, seasonNum);
    const episodes = _.get(show, `seasons[${seasonNum}].episodes`);
    return (
      <Layout>
        <Show
          poster={showDetails.posterPath}
          overview={showDetails.overview}
          title={showDetails.title}
          backdropPath={showDetails.backdropPath}
        />
        {!_.isEmpty(episodes) ? <EpisodeList
          showEpisodes={this.state.showEpisodes}
          handleEpisodeListClick={this.handleEpisodeListClick}
          episodes={episodes}
          show={show}
        /> : (
          'Sorry, no episodes were found for this season'
        )}
      </Layout>
    );
  }
}

SeasonPage.propTypes = {
  match: PropTypes.shape().isRequired,
  fetchSeason: PropTypes.func.isRequired,
  fetchSeasonAndShow: PropTypes.func.isRequired,
  mediaItem: PropTypes.shape(),
  fetching: PropTypes.bool,
  failed: PropTypes.bool,
  loaded: PropTypes.bool,
};

SeasonPage.defaultProps = {
  mediaItem: undefined,
  fetching: false,
  failed: false,
  loaded: false,
};

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { id, seasonNum } } } = ownProps;
  return {
    mediaItem: getMediaItem(state, 'show', id),
    fetching: _.get(getMediaItemState(state, 'show', id), `seasons[${seasonNum}].fetching`),
    failed: _.get(getMediaItemState(state, 'show', id), `seasons[${seasonNum}].failed`),
    loaded: _.get(getMediaItemState(state, 'show', id), `seasons[${seasonNum}].loaded`),
  };
};

export default connect(mapStateToProps, { fetchSeason, fetchSeasonAndShow })(SeasonPage);
