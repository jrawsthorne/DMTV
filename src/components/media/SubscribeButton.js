import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { subscribeChange } from '../../actions/mediaActions';

class SubscribeButton extends React.Component {
  handleSubscribeChange = () => {
    const { mediaType } = this.props;
    let type = 'show';
    if (mediaType === 'movie') type = 'movie';
    this.props.subscribeChange(type, this.props.tmdbid, !this.props.isSubscribed);
  }
  render() {
    const {
      loaded, fetching, isSubscribed,
    } = this.props;
    const buttonText = isSubscribed ? 'Unsubscribe' : 'Subscribe';
    return (
      <Button disabled={fetching || !loaded} onClick={this.handleSubscribeChange}>
        {buttonText}
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
  let type = 'show';
  if (mediaType === 'movie') type = 'movie';
  return {
    fetching: _.get(state, 'subscriptions.fetching', false),
    loaded: _.get(state, 'subscriptions.loaded', false),
    isSubscribed: !!_.find(_.get(state, 'subscriptions.items', []), { type, tmdbid: parseInt(tmdbid, 10) }),
  };
};

export default connect(mapStateToProps, { subscribeChange })(SubscribeButton);
