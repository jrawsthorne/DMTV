import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as actions from '../../actions/mediaActions';
import Show from '../media/Media';
import SeasonList from '../media/list/SeasonList';
import { getMediaItemDetails } from '../../helpers/mediaHelpers';
import Error404Page from '../pages/Error404Page';
import Loading from '../misc/Loading';

class ShowPage extends React.Component {
  state = {
    showSeasons: false,
  }
  componentDidMount() {
    const { show, fetchShow, match: { params: { id } } } = this.props;
    if (!show) {
      fetchShow(id);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { show, fetchShow, match: { url, params: { id } } } = nextProps;
    const { url: currentURL } = this.props.match;
    if (!show && url !== currentURL) {
      fetchShow(id);
      this.setState({
        showSeasons: false,
      });
    }
  }
  handleSeasonListClick = () =>
    this.setState({
      showSeasons: !this.state.showSeasons,
    })
  render() {
    const {
      show, loaded, failed, fetching,
    } = this.props;

    if (failed) return <Error404Page />;
    if (fetching || !loaded) return <Loading />;
    const showDetails = getMediaItemDetails(show, 'show');
    const seasons = _.get(show, 'seasons');
    return (
      <Layout>
        <Show
          poster={showDetails.posterPath}
          overview={showDetails.overview}
          title={showDetails.title}
          backdropPath={showDetails.backdropPath}
        />
        {!_.isEmpty(seasons) ? <SeasonList
          showSeasons={this.state.showSeasons}
          handleSeasonListClick={this.handleSeasonListClick}
          seasons={show.seasons}
          show={show}
        /> : (
          'Sorry, no seasons were found for this show'
        )}

      </Layout>
    );
  }
}

ShowPage.propTypes = {
  match: PropTypes.shape().isRequired,
  fetchShow: PropTypes.func.isRequired,
  show: PropTypes.shape(),
  fetching: PropTypes.bool,
  failed: PropTypes.bool,
  loaded: PropTypes.bool,
};

ShowPage.defaultProps = {
  show: undefined,
  fetching: false,
  failed: false,
  loaded: false,
};

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { id } } } = ownProps;
  return {
    show: _.get(state.media.items, `shows[${id}]`),
    fetching: _.get(state.media.itemStates, `shows[${id}].fetching`),
    failed: _.get(state.media.itemStates, `shows[${id}].failed`),
    loaded: _.get(state.media.itemStates, `shows[${id}].loaded`),
  };
};

export default connect(mapStateToProps, { fetchShow: actions.fetchShow })(ShowPage);
