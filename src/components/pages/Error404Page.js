import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';

const Error404Page = () => (
  <Layout className="main-content">
    <p>Error 404, page not found. <Link to="/">Go home</Link></p>
  </Layout>
);

export default Error404Page;
