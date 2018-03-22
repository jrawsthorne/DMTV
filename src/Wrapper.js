import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { Layout } from 'antd';
import Topnav from './components/Navigation/Topnav';

const Wrapper = props => (
  <Layout>
    <Layout.Header style={{ position: 'fixed', width: '100%', zIndex: 1050 }}>
      <Topnav />
    </Layout.Header>
    <Layout.Content style={{
     margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280,
   }}
    >
      {renderRoutes(props.route.routes)}
    </Layout.Content>
  </Layout>);

Wrapper.propTypes = {
  route: PropTypes.shape().isRequired,
};

export default Wrapper;
