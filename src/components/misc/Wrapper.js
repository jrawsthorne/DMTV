import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { Layout } from 'antd';
import Topnav from '../navigation/Topnav';

const Wrapper = props => (
  <Layout>
    <Topnav history={props.history} />
    <Layout.Content>
      {renderRoutes(props.route.routes)}
    </Layout.Content>
  </Layout>);

Wrapper.propTypes = {
  route: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default Wrapper;
