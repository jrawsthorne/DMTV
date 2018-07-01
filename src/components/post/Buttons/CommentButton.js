import React from 'react';
import { Icon } from 'antd';
import './CommentButton.less';

const CommentButton = () => (
  <Icon
    className="CommentButton"
    style={{ fontSize: 20 }}
    type="message"
  />
);

export default CommentButton;
