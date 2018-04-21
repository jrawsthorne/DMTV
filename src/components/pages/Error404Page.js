import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';

const Error404Page = () => (
  <Layout>
    <div style={{ padding: 24 }}>
      Error 404, page not found. <Link to="/">Go home</Link>
    </div>
  </Layout>
);

export default Error404Page;
