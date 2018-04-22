import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../actions/mediaActions';
import Season from '../media/Media';
import EpisodeList from '../media/list/EpisodeList';
import { getEpisodeDetails } from '../../helpers/mediaHelpers';
import Error404Page from '../pages/Error404Page';
import Loading from '../misc/Loading';

class EpisodePage extends React.Component {
  state = {
    showEpisodes: false,
  }
  componentDidMount() {
    const {
      show,
      fetchEpisode,
      fetchEpisodeAndShow,
      match: { params: { id, seasonNum, episodeNum } },
    } = this.props;
    const episodeLoaded = _.get(show, `seasons[${seasonNum}].episodes[${episodeNum}]`);
    if (!show) {
      fetchEpisodeAndShow(id, seasonNum, episodeNum, show);
    } else if (!episodeLoaded) {
      fetchEpisode(id, seasonNum, episodeNum);
    }
  }
  componentWillReceiveProps(nextProps) {
    const {
      show,
      fetchEpisode,
      match: { url, params: { id, seasonNum, episodeNum } },
    } = nextProps;
    const episodeLoaded = _.get(show, `seasons[${seasonNum}].episodes[${episodeNum}]`);
    const { url: currentURL } = this.props.match;
    if (!episodeLoaded && url !== currentURL) {
      fetchEpisode(id, seasonNum, seasonNum);
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
  handleEpisodeClick = episodeNum =>
    this.props.history.push(`/show/${this.props.match.params.id}/${this.props.match.params.seasonNum}/${episodeNum}`)
  render() {
    const {
      match: { params: { seasonNum, episodeNum } }, show, loaded, failed, fetching,
    } = this.props;

    if (failed) return <Error404Page />;
    if (fetching || !loaded) return <Loading />;
    const episodeDetails = getEpisodeDetails(show, seasonNum, episodeNum);
    const episodes = _.get(show, `seasons[${seasonNum}].episodes`);
    return (
      <Layout>
        <Season
          poster={episodeDetails.posterPath}
          overview={episodeDetails.overview}
          title={episodeDetails.title}
          backdropPath={episodeDetails.backdropPath}
        />
        {!_.isEmpty(episodes) ? <EpisodeList
          showEpisodes={this.state.showEpisodes}
          handleEpisodeListClick={this.handleEpisodeListClick}
          episodes={episodes}
          show={show}
          handleEpisodeClick={this.handleEpisodeClick}
        /> : (
          'Sorry, no episodes were found for this season'
        )}
      </Layout>
    );
  }
}

EpisodePage.propTypes = {
  match: PropTypes.shape().isRequired,
  fetchEpisode: PropTypes.func.isRequired,
  fetchEpisodeAndShow: PropTypes.func.isRequired,
  show: PropTypes.shape(),
  fetching: PropTypes.bool,
  failed: PropTypes.bool,
  loaded: PropTypes.bool,
  history: PropTypes.shape().isRequired,
};

EpisodePage.defaultProps = {
  show: undefined,
  fetching: false,
  failed: false,
  loaded: false,
};

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { id, seasonNum, episodeNum } } } = ownProps;
  return {
    show: _.get(state.media.items, `shows[${id}]`),
    fetching: _.get(state.media.itemStates, `shows[${id}].seasons[${seasonNum}].fetching`),
    failed: _.get(state.media.itemStates, `shows[${id}].seasons[${seasonNum}].episodes[${episodeNum}].failed`),
    loaded: _.get(state.media.itemStates, `shows[${id}].seasons[${seasonNum}].episodes[${episodeNum}].loaded`),
  };
};

export default connect(mapStateToProps, {
  fetchEpisodeAndShow: actions.fetchEpisodeAndShow,
  fetchEpisode: actions.fetchEpisode,
})(EpisodePage);
