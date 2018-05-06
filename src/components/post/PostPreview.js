import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import BodyShort from './BodyShort';

import noImageFound from '../../images/no-image-found.jpg';

const { Meta } = Card;

class PostPreview extends React.Component {
  state = {
    imageError: false,
  }
  handleImageError() {
    this.setState({
      imageError: true,
    });
  }
  render() {
    const {
      url, posterPath, overview, title, mediaTitle,
    } = this.props;
    return (
      <Link to={url}>
        <Card
          hoverable
          style={{ width: '100%' }}
          cover={<img onError={() => this.handleImageError()} alt="poster" height="auto" src={(this.state.imageError && noImageFound) || (posterPath && `https://image.tmdb.org/t/p/w780${posterPath}`) || noImageFound} />}
          title={mediaTitle}
        >
          <Meta
            title={title}
            description={<BodyShort body={overview} />}
          />
        </Card>
      </Link>
    );
  }
}

PostPreview.propTypes = {
  overview: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  posterPath: PropTypes.string,
  url: PropTypes.string.isRequired,
  mediaTitle: PropTypes.string.isRequired,
};

PostPreview.defaultProps = {
  posterPath: undefined,
};

export default PostPreview;
