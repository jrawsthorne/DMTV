import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Avatar } from 'antd';
import Dotdotdot from 'react-dotdotdot';

const { Meta } = Card;

const Post = props => (
  <div id={props.post.id}>

    <Card
      style={{ width: '100%' }}
      cover={<img alt="example" src={(props.media.poster_path && `https://image.tmdb.org/t/p/w300${props.media.poster_path}`) || (props.media.still_path && `https://image.tmdb.org/t/p/w300${props.media.still_path}`)} />}
      actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
    >
      <Meta
        avatar={<Avatar src="https://steemitimages.com/u/jrawsthorne/avatar" />}
        title={props.media.title || props.media.name}
        description={<Dotdotdot clamp={6}>{props.media.overview}</Dotdotdot>}
        style={{ height: '170px', textOverflow: 'ellipsis', overflow: 'hidden' }}
      />
    </Card>
  </div>
);

Post.propTypes = {
  post: PropTypes.shape().isRequired,
  media: PropTypes.shape().isRequired,
};

export default Post;
