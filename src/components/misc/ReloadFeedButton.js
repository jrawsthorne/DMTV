import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { fetchPosts, fetchSubscriptions } from '../../actions/postActions';

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
    return (
      <Icon style={{ marginLeft: 10 }} type="reload" onClick={this.handleClick} />
    );
  }
}

ReloadFeedButton.propTypes = {
  sortBy: PropTypes.string,
  category: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  fetchPosts: PropTypes.func.isRequired,
  fetchSubscriptions: PropTypes.func.isRequired,
  type: PropTypes.string,
};

ReloadFeedButton.defaultProps = {
  category: null,
  sortBy: 'trending',
  type: null,
};

export default connect(null, { fetchPosts, fetchSubscriptions })(ReloadFeedButton);
