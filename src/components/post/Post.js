import React from 'react';
import PropTypes from 'prop-types';

import Body from '../../helpers/bodyHelpers';

const Post = props => (
  <React.Fragment>
    <h1>{props.title}</h1>
    <Body body={props.body} returnType="Object" />
  </React.Fragment>
);

Post.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default Post;
