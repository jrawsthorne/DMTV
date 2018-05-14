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
      url, posterPath, overview, title, mediaTitle, author, mediaUrl,
    } = this.props;
    return (
      <Card
        hoverable
        style={{ width: '100%' }}
        cover={<Link to={url}><img onError={() => this.handleImageError()} alt="poster" height="auto" src={(this.state.imageError && noImageFound) || (posterPath && `https://image.tmdb.org/t/p/w780${posterPath}`) || noImageFound} /></Link>}
        title={<Link to={mediaUrl}>{mediaTitle}</Link>}
      >
        <Link to={url}>
          <Meta
            title={title}
            description={<BodyShort body={overview} />}
          />
        </Link>
        <Link to={`/@${author}`}><p style={{ marginTop: 15, marginBottom: 0 }}>By {author}</p></Link>
      </Card>

    );
  }
}

PostPreview.propTypes = {
  overview: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  posterPath: PropTypes.string,
  url: PropTypes.string.isRequired,
  mediaTitle: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  mediaUrl: PropTypes.string.isRequired,
};

PostPreview.defaultProps = {
  posterPath: undefined,
};

export default PostPreview;
