import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Rate } from 'antd';
import * as actions from '../../actions/mediaActions';

class StarRating extends React.Component {
  state = {
    rating: 0,
  }
  handleRateChange = (value) => {
    this.setState({ rating: value });
    const {
      mediaType, tmdbid, seasonNum, episodeNum,
    } = this.props;
    this.props.userRateChange(mediaType, tmdbid, seasonNum, episodeNum, value);
  }
  render() {
    const {
      loaded, fetching, userRating,
    } = this.props;
    const { rating } = this.state;
    return (<Rate
      value={(loaded && userRating) || rating}
      onChange={this.handleRateChange}
      disabled={fetching}
    />);
  }
}

StarRating.propTypes = {
  mediaType: PropTypes.string.isRequired,
  tmdbid: PropTypes.string.isRequired,
  seasonNum: PropTypes.string,
  episodeNum: PropTypes.string,
  fetching: PropTypes.bool,
  loaded: PropTypes.bool,
  userRating: PropTypes.number,
  userRateChange: PropTypes.func.isRequired,
};

StarRating.defaultProps = {
  episodeNum: undefined,
  seasonNum: undefined,
  fetching: false,
  loaded: false,
  userRating: 0,
};

const mapStateToProps = (state, ownProps) => {
  const {
    mediaType, tmdbid, seasonNum, episodeNum,
  } = ownProps;
  let userRating;
  if (!_.isEmpty(_.get(state.auth, 'user.ratings.scores', []))) {
    userRating = _.get(state.auth.user.ratings.scores.find((rating) => {
      if (seasonNum) {
        if (episodeNum) {
          return (
            rating.tmdbid === parseInt(tmdbid, 10) &&
            rating.mediaType === mediaType &&
            rating.seasonNum === parseInt(seasonNum, 10) &&
            rating.episodeNum === parseInt(episodeNum, 10));
        }
        return (
          rating.tmdbid === parseInt(tmdbid, 10) &&
          rating.mediaType === mediaType &&
          rating.seasonNum === parseInt(seasonNum, 10));
      }
      return (rating.tmdbid === parseInt(tmdbid, 10) && rating.mediaType === mediaType);
    }), 'score');
  }
  return {
    fetching: _.get(state, 'auth.user.ratings.fetching', false),
    loaded: _.get(state, 'auth.user.ratings.loaded', false),
    userRating,
  };
};

export default connect(mapStateToProps, {
  userRateChange: actions.userRateChange,
})(StarRating);