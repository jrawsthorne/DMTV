import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Button } from 'antd';
import * as actions from '../../actions/mediaActions';

class SubscribeButton extends React.Component {
    handleSubscribeChange = () => {
      let type;
      const { mediaType } = this.props;
      if (mediaType === 'movie') {
        type = 'movie';
      } else if (mediaType === 'show' || mediaType === 'episode' || mediaType === 'season') {
        type = 'show';
      }
      this.props.subscribeChange(type, this.props.tmdbid, !this.props.isSubscribed);
    }
    render() {
      const {
        loaded, fetching, isSubscribed,
      } = this.props;
      return (
        <Button loading={fetching || !loaded} onClick={this.handleSubscribeChange}>
          {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </Button>
      );
    }
}

SubscribeButton.propTypes = {
  mediaType: PropTypes.string.isRequired,
  tmdbid: PropTypes.string.isRequired,
  fetching: PropTypes.bool.isRequired,
  loaded: PropTypes.bool.isRequired,
  isSubscribed: PropTypes.bool.isRequired,
  subscribeChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const {
    mediaType, tmdbid,
  } = ownProps;
  let type;
  if (mediaType === 'movie') {
    type = 'movie';
  } else if (mediaType === 'show' || mediaType === 'episode' || mediaType === 'season') {
    type = 'show';
  }
  return {
    fetching: _.get(state, 'auth.user.subscriptions.fetching', false),
    loaded: _.get(state, 'auth.user.subscriptions.loaded', false),
    isSubscribed: !!_.find(_.get(state, 'auth.user.subscriptions.items', []), { type, tmdbid: parseInt(tmdbid, 10) }),
  };
};

export default connect(mapStateToProps, {
  subscribeChange: actions.subscribeChange,
})(SubscribeButton);
