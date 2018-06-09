import React from 'react';
import PropTypes from 'prop-types';

import Body from '../../helpers/bodyHelpers';

const Post = ({ title, body }) => (
  <React.Fragment>
    <h1>{title}</h1>
    <Body body={body} returnType="Object" />
  </React.Fragment>
);

Post.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default Post;
