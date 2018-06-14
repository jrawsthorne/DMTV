import React from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import ScrollToTop from '../misc/ScrollToTop';
import Loading from '../misc/Loading';
import Error401Page from '../pages/Error401Page';

const SubscriptionPostsContainer = Loadable({
  loader: () => import('../../containers/SubscriptionPostsContainer'),
  loading: (() => null),
});

const SubscriptionPage = ({ authLoaded, isAuthenticated }) => {
  if (!authLoaded) return <Loading />;
  if (!isAuthenticated) return <Error401Page />;

  return (
    <Layout className="main-content">
      <ScrollToTop />
      <h2>Subscriptions</h2>
      <p>Posts from movies and shows you have subscribed to</p>
      <SubscriptionPostsContainer />
    </Layout>
  );
};

SubscriptionPage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  authLoaded: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  authLoaded: state.auth.loaded,
});

export default connect(mapStateToProps, null)(SubscriptionPage);
