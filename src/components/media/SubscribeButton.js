import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { subscribeChange } from '../../actions/mediaActions';

class SubscribeButton extends React.Component {
  handleSubscribeChange = () => {
    const { mediaType, tmdbid, isSubscribed } = this.props;
    let type = 'show';
    if (mediaType === 'movie') type = 'movie';
    /* toggle subscription based on current state */
    this.props.subscribeChange({ type, tmdbid, subscribed: !isSubscribed });
  }
  render() {
    const {
      isSubscribed, pendingSubscription, fetching,
    } = this.props;
    let subscribed = isSubscribed;
    if (pendingSubscription) {
      ({ subscribed } = pendingSubscription);
    }
    const buttonText = subscribed ? 'Unsubscribe' : 'Subscribe';
    return (
      <Button disabled={fetching} onClick={this.handleSubscribeChange}>
        {buttonText}
      </Button>
    );
  }
}

SubscribeButton.propTypes = {
  mediaType: PropTypes.string.isRequired,
  tmdbid: PropTypes.string.isRequired,
  isSubscribed: PropTypes.bool.isRequired,
  subscribeChange: PropTypes.func.isRequired,
  pendingSubscription: PropTypes.shape(),
  fetching: PropTypes.bool.isRequired,
};

SubscribeButton.defaultProps = {
  pendingSubscription: null,
};

const mapStateToProps = (state, ownProps) => {
  const {
    mediaType, tmdbid,
  } = ownProps;
  let type = 'show';
  if (mediaType === 'movie') type = 'movie';
  return {
    fetching: _.get(state, 'subscriptions.fetching', false),
    loaded: _.get(state, 'subscriptions.loaded', false),
    /* isSubscribed if subscription found with specified type and tmdbid */
    isSubscribed: !!_.find(_.get(state, 'subscriptions.items', []), { type, tmdbid: parseInt(tmdbid, 10) }),
    pendingSubscription: _.find(_.get(state, 'subscriptions.pendingSubscriptions', []), { type, tmdbid: parseInt(tmdbid, 10) }),
  };
};

export default connect(mapStateToProps, { subscribeChange })(SubscribeButton);
