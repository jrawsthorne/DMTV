import { message } from 'antd';
import _ from 'lodash';
import * as types from '../actions/types';

const initialState = {
  loaded: false,
  failed: false,
  fetching: false,
  items: [],
  pendingSubscriptions: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_USER_SUBSCRIPTIONS_FULFILLED:
      return {
        ...state,
        fetching: false,
        loaded: true,
        failed: false,
        items: [
          ...state.items,
          ...action.payload,
        ],
      };
    case types.FETCH_USER_SUBSCRIPTIONS_PENDING:
      return {
        ...state,
        fetching: true,
        loaded: false,
        failed: false,
      };
    case types.FETCH_USER_SUBSCRIPTIONS_REJECTED:
      return {
        ...state,
        fetching: false,
        loaded: true,
        failed: true,
      };
    case types.SUBSCRIBE_CHANGE_PENDING: {
      const { type, tmdbid, subscribed } = action.meta;
      return {
        ...state,
        fetching: true,
        loaded: false,
        failed: false,
        pendingSubscriptions: [
          ...state.pendingSubscriptions,
          {
            type,
            tmdbid: parseInt(tmdbid, 10),
            subscribed: !!subscribed,
          },
        ],
      };
    }
    case types.SUBSCRIBE_CHANGE_FULFILLED: {
      const { type, tmdbid, subscribed } = action.meta;
      message.destroy();
      /* remove subscription from pending */
      const pendingSubscriptions = _.filter(
        state.pendingSubscriptions,
        (subscription => subscription.type !== type && subscription.tmdbid !== tmdbid),
      );
      /* if unsubscribing */
      if (JSON.parse(subscribed) === false) {
        message.success('Unubscribed successfully', 0.5);
        const currentSubscription = _.find(
          state.items,
          { type, tmdbid: parseInt(tmdbid, 10) },
        );
        /* remove subscription from list */
        const subscriptions = _.filter(
          state.items,
          (subscription => subscription !== currentSubscription),
        );
        return {
          ...state,
          fetching: false,
          loaded: true,
          failed: false,
          items: subscriptions,
          pendingSubscriptions,
        };
      }
      /* if subscribing */
      message.success('Subscribed successfully', 0.5);
      return {
        ...state,
        fetching: false,
        loaded: true,
        failed: false,
        items: [
          ...state.items,
          action.payload,
        ],
        pendingSubscriptions,
      };
    }
    case types.SUBSCRIBE_CHANGE_REJECTED:
      return {
        ...state,
        fetching: false,
        loaded: true,
        failed: true,
      };
    default:
      return state;
  }
};
