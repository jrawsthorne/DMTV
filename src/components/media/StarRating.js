import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Rate } from 'antd';
import { userRateChange } from '../../actions/mediaActions';

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
    return (
      <Rate
        value={loaded ? userRating : rating}
        onChange={this.handleRateChange}
        disabled={fetching}
      />
    );
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
  const query = { tmdbid: parseInt(tmdbid, 10), mediaType };
  if (seasonNum) query.seasonNum = parseInt(seasonNum, 10);
  if (episodeNum) query.episodeNum = parseInt(episodeNum, 10);
  if (!_.isEmpty(state.ratings.items)) {
    userRating = _.get(_.find(state.ratings.items, query), 'score');
  }
  return {
    fetching: _.get(state, 'ratings.fetching', false),
    loaded: _.get(state, 'ratings.loaded', false),
    userRating,
  };
};

export default connect(mapStateToProps, { userRateChange })(StarRating);
