import React from 'react';
import { Layout } from 'antd';
import PostsContainer from '../../containers/PostsContainer';

const HomePage = () => (
  <Layout>
    <div style={{ padding: 24 }}>
      <PostsContainer category="review" />
    </div>
  </Layout>
);

export default HomePage;
