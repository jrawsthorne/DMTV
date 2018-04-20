import React from 'react';
import { Layout, Icon, Spin } from 'antd';

const LoadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const Loading = () => (
  <Layout>
    <div style={{ textAlign: 'center', padding: 24 }}>
      <Spin indicator={LoadingIcon} />
    </div>
  </Layout>
);

export default Loading;
