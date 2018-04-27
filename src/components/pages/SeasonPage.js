import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../actions/mediaActions';
import Season from '../media/Media';
import EpisodeList from '../media/list/EpisodeList';
import { getSeasonDetails } from '../../helpers/mediaHelpers';
import Error404Page from '../pages/Error404Page';
import Loading from '../misc/Loading';

class SeasonPage extends React.Component {
  state = {
    showEpisodes: false,
  }
  componentDidMount() {
    const {
      show,
      fetchSeason,
      fetchSeasonAndShow,
      match: { params: { id, seasonNum } },
    } = this.props;
    const episodesLoaded = _.get(show, `seasons[${seasonNum}].episodes`);
    // fetch season and show if show not found
    if (!show) {
      fetchSeasonAndShow(id, seasonNum, show);
    } else if (!episodesLoaded) {
      // just fetch season if show found but not season
      fetchSeason(id, seasonNum);
    }
  }
  componentWillReceiveProps(nextProps) {
    const {
      show,
      fetchSeason,
      match: { url, params: { id, seasonNum } },
    } = nextProps;
    const episodesLoaded = _.get(show, `seasons[${seasonNum}].episodes`);
    const { url: currentURL } = this.props.match;
    // just fetch season if show found but not season and changing pages
    if (!episodesLoaded && url !== currentURL) {
      fetchSeason(id, seasonNum, show);
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
      match: { params: { seasonNum } }, show, loaded, failed, fetching,
    } = this.props;

    if (failed) return <Error404Page />;
    if (fetching || !loaded) return <Loading />;
    const seasonDetails = getSeasonDetails(show, seasonNum);
    const episodes = _.get(show, `seasons[${seasonNum}].episodes`);
    const prevSeason = _.get(show, `seasons[${seasonNum - 1}]`) && `/show/${show.id}/season/${seasonNum - 1}`;
    const nextSeason = _.get(show, `seasons[${parseInt(seasonNum, 10) + 1}]`) && `/show/${show.id}/season/${parseInt(seasonNum, 10) + 1}`;
    return (
      <Layout>
        <Season
          poster={seasonDetails.posterPath}
          overview={seasonDetails.overview}
          title={seasonDetails.title}
          backdropPath={seasonDetails.backdropPath}
          prev={prevSeason}
          next={nextSeason}
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
  show: PropTypes.shape(),
  fetching: PropTypes.bool,
  failed: PropTypes.bool,
  loaded: PropTypes.bool,
};

SeasonPage.defaultProps = {
  show: undefined,
  fetching: false,
  failed: false,
  loaded: false,
};

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { id, seasonNum } } } = ownProps;
  return {
    show: _.get(state.media.items, `shows[${id}]`),
    fetching: _.get(state.media.itemStates, `shows[${id}].seasons[${seasonNum}].fetching`),
    failed: _.get(state.media.itemStates, `shows[${id}].seasons[${seasonNum}].failed`),
    loaded: _.get(state.media.itemStates, `shows[${id}].seasons[${seasonNum}].loaded`),
  };
};

export default connect(mapStateToProps, {
  fetchSeason: actions.fetchSeason,
  fetchSeasonAndShow: actions.fetchSeasonAndShow,
})(SeasonPage);
