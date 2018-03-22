import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import PostsContainer from '../../containers/PostsContainer';
import Topnav from '../Navigation/Topnav';

const { Content } = Layout;

const HomePage = props => (
  <Layout>
    <Topnav history={props.history} />
    <Content style={{
        margin: '24px 16px',
        padding: 24,
        background: '#fff',
        minHeight: 280,
      }}
    >
      <PostsContainer />
    </Content>
  </Layout>
);

HomePage.propTypes = {
  history: PropTypes.shape().isRequired,
};

export default HomePage;
