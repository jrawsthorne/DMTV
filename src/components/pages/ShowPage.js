import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchShow } from '../../actions/mediaActions';
import Show from '../Media/Media';
import SeasonList from '../Media/SeasonList';
import { getMediaItem, getMediaItemState } from '../../reducers';
import { getMediaItemDetails } from '../../helpers/mediaHelpers';
import Error404Page from '../pages/Error404Page';
import Loading from '../misc/Loading';

class ShowPage extends React.Component {
  state = {
    showSeasons: false,
  }
  componentDidMount() {
    const { mediaItem: show, fetchShow: fetch, match: { params: { id } } } = this.props;
    if (!show) {
      fetch(id);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { mediaItem: show, fetchShow: fetch, match: { url, params: { id } } } = nextProps;
    const { url: currentURL } = this.props.match;
    if (!show && url !== currentURL) {
      fetch(id);
      this.setState({
        showSeasons: false,
      });
    }
  }
  handleSeasonSwitcherClick = () =>
    this.setState({
      showSeasons: !this.state.showSeasons,
    })
  handleSeasonClick = seasonNum =>
    this.props.history.push(`/show/${this.props.match.params.id}/${seasonNum}`)
  render() {
    const {
      mediaItem: show, loaded, failed, fetching,
    } = this.props;

    if (failed) return <Error404Page />;
    if (fetching || !loaded) return <Loading />;
    const showDetails = getMediaItemDetails(show, 'show');
    return (
      <Layout>
        <Show
          poster={showDetails.posterPath}
          overview={showDetails.overview}
          title={showDetails.title}
          backdropPath={showDetails.backdropPath}
        />
        <SeasonList
          showSeasons={this.state.showSeasons}
          handleSeasonSwitcherClick={this.handleSeasonSwitcherClick}
          seasons={show.seasons}
          handleSeasonClick={this.handleSeasonClick}
          show={show}
        />
      </Layout>
    );
  }
}

ShowPage.propTypes = {
  match: PropTypes.shape().isRequired,
  fetchShow: PropTypes.func.isRequired,
  mediaItem: PropTypes.shape(),
  fetching: PropTypes.bool,
  failed: PropTypes.bool,
  loaded: PropTypes.bool,
  history: PropTypes.shape().isRequired,
};

ShowPage.defaultProps = {
  mediaItem: undefined,
  fetching: false,
  failed: false,
  loaded: false,
};

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { id } } } = ownProps;
  return {
    mediaItem: getMediaItem(state, 'show', id),
    fetching: _.get(getMediaItemState(state, 'show', id), 'fetching'),
    failed: _.get(getMediaItemState(state, 'show', id), 'failed'),
    loaded: _.get(getMediaItemState(state, 'show', id), 'loaded'),
  };
};

export default connect(mapStateToProps, { fetchShow })(ShowPage);
