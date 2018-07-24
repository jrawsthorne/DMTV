import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPosts, fetchSubscriptions } from '../../actions/postActions';
import { Button } from '../../styles/theme';
import { getFeedStatusFromState } from '../../helpers/stateHelpers';

class ReloadFeedButton extends React.Component {
  handleClick = () => {
    const { sortBy, category, type } = this.props;
    if (type === 'subscriptions') {
      this.props.fetchSubscriptions({}, true);
    } else {
      this.props.fetchPosts({
        sortBy, category,
      }, true);
    }
  }
  render() {
    const {
      sortBy, category, feed, type,
    } = this.props;
    const {
      fetching,
    } = getFeedStatusFromState(type === 'subscriptions' ? 'created' : sortBy, type || category, feed);
    return (
      <Button margin="0 0 0 10px" shape="circle" loading={fetching} icon="reload" onClick={this.handleClick} />
    );
  }
}

ReloadFeedButton.propTypes = {
  sortBy: PropTypes.string,
  category: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  fetchPosts: PropTypes.func.isRequired,
  fetchSubscriptions: PropTypes.func.isRequired,
  type: PropTypes.string,
  feed: PropTypes.shape().isRequired,
};

ReloadFeedButton.defaultProps = {
  category: undefined,
  sortBy: 'trending',
  type: null,
};

const mapStateToProps = state => ({
  feed: state.feed,
});

export default connect(mapStateToProps, { fetchPosts, fetchSubscriptions })(ReloadFeedButton);
