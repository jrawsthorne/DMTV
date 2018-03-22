import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Topnav from '../Navigation/Topnav';
// import Media from '../Media/Media';

const { Content } = Layout;

const MediaPage = props => (
  <Layout>
    <Topnav history={props.history} />
    <Content style={{
        margin: '24px 16px',
        padding: 24,
        background: '#fff',
        minHeight: 280,
      }}
    >
      {(props.history.location.pathname)}
      {(props.match.params.id)}
    </Content>
  </Layout>
);

MediaPage.propTypes = {
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default MediaPage;
