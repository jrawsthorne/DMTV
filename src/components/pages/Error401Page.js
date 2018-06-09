import React from 'react';
import { Layout } from 'antd';
import LoginLink from '../misc/LoginLink';

const Error401Page = () => (
  <Layout className="main-content">
    <p>Sorry, you must be logged in. <LoginLink /></p>
  </Layout>
);

export default Error401Page;
