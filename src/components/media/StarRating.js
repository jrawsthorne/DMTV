import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Rate } from 'antd';
import { userRateChange } from '../../actions/mediaActions';

class StarRating extends React.Component {
  handleRateChange = (value) => {
    const {
      mediaType, tmdbid, seasonNum, episodeNum,
    } = this.props;
    /* change the rating for the specified item */
    this.props.userRateChange({
      mediaType, tmdbid, seasonNum, episodeNum, value,
    });
  }
  render() {
    const {
      fetching, userRating, pendingRating,
    } = this.props;

    let rating = userRating;
    if (pendingRating) {
      rating = pendingRating.score;
    }

    return (
      <Rate
        value={rating}
        onChange={this.handleRateChange}
        disabled={fetching} /* disable while changing */
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
  userRating: PropTypes.number,
  userRateChange: PropTypes.func.isRequired,
  pendingRating: PropTypes.shape(),
};

StarRating.defaultProps = {
  episodeNum: undefined,
  seasonNum: undefined,
  fetching: false,
  userRating: 0,
  pendingRating: null,
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
    userRating,
    pendingRating: _.find(state.ratings.pendingRatings, query),
  };
};

export default connect(mapStateToProps, { userRateChange })(StarRating);
