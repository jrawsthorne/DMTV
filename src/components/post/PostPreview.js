import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import BodyShort from './BodyShort';

import noImageFound from '../../images/no-image-found.jpg';
import './PostPreview.less';

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
      url,
      posterPath,
      overview,
      title,
      mediaTitle,
      mediaUrl,
      post,
    } = this.props;
    let imageSource;
    if (this.state.imageError || !posterPath) {
      imageSource = noImageFound;
    } else {
      imageSource = `https://image.tmdb.org/t/p/w780${posterPath}`;
    }
    const options = {
      year: 'numeric', month: 'long', day: 'numeric',
    };
    let created = new Date(post.created);
    created = created.toLocaleDateString('en-GB', options);
    return (
      <React.Fragment>
        <Link to={url}>
          <div className="PostPreviewBackdrop" style={{ backgroundImage: `url(${imageSource})` }} />
        </Link>
        <div className="PostPreviewBody">
          <h2 style={{ marginBottom: 0 }}>
            <Link to={mediaUrl}>{mediaTitle}</Link>
          </h2>
          <p style={{ marginBottom: '1em' }}>
            <Icon style={{ fontSize: 12, marginRight: 5 }} type="clock-circle-o" /> {created}
          </p>
          <h3><Link to={url}>{title}</Link></h3>
          <BodyShort body={overview} />
        </div>
      </React.Fragment>
    );
  }
}

PostPreview.propTypes = {
  overview: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  posterPath: PropTypes.string,
  url: PropTypes.string.isRequired,
  mediaTitle: PropTypes.string.isRequired,
  mediaUrl: PropTypes.string.isRequired,
  post: PropTypes.shape().isRequired,
};

PostPreview.defaultProps = {
  posterPath: undefined,
};

export default PostPreview;
