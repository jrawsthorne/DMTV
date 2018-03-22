import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Avatar, Modal } from 'antd';
import Dotdotdot from 'react-dotdotdot';
import { Link } from 'react-router-dom';
import { getReviewTypeFromPost } from '../../helpers/apiHelpers';

import noImageFound from '../../images/no-image-found.jpg';

const { Meta } = Card;

class Post extends React.Component {
  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({
      visible: false,
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  render() {
    const reviewType = getReviewTypeFromPost(this.props.post);
    const { media } = this.props;
    return (
      <div id={this.props.post.id}>
        <Link to={`/${reviewType}/${media.id}`}>
          <Card
            style={{ width: '100%' }}
            cover={<img alt="example" src={(this.props.media.poster_path && `https://image.tmdb.org/t/p/w300${this.props.media.poster_path}`) || (this.props.media.still_path && `https://image.tmdb.org/t/p/w300${this.props.media.still_path}`) || noImageFound} />}
            actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
          >
            <Meta
              avatar={<Avatar src={`https://steemitimages.com/u/${this.props.post.author}/avatar`} />}
              title={this.props.media.title || this.props.media.name}
              description={<Dotdotdot clamp={6}>{this.props.media.overview}</Dotdotdot>}
              style={{ height: '170px', textOverflow: 'ellipsis', overflow: 'hidden' }}
            />
          </Card>
        </Link>
        <Modal
          title={this.props.post.title}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          afterClose={this.handleClose}
          onOpen={this.handleOpen}
        >
          <Card
            style={{ width: '100%' }}
            actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
          >
            <Meta
              avatar={<Avatar src={`https://steemitimages.com/u/${this.props.post.author}/avatar`} />}
              description={this.props.post.body}
            />
          </Card>
        </Modal>
      </div>
    );
  }
}

Post.propTypes = {
  post: PropTypes.shape().isRequired,
  media: PropTypes.shape().isRequired,
};

export default Post;
