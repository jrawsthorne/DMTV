import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import classNames from 'classnames';
import MediaContainer from '../../containers/MediaContainer';
import PostContainer from '../../containers/PostContainer';
import { getPostState, getPost } from '../../reducers';
import Similar from '../media/Similar';
import './PostPage.less';
import ScrollToTop from '../misc/ScrollToTop';

const PostPage = ({
  mediaType,
  tmdbid,
  type,
  seasonNum,
  episodeNum,
  postFailed,
  match: {
    params: { author, permlink },
  },
}) => (
  <Layout>
    <ScrollToTop />
    {/* don't show if post fails */}
    {!postFailed &&
    <Layout>
      <MediaContainer
        mediaType={mediaType}
        tmdbid={`${tmdbid}`}
        seasonNum={seasonNum && seasonNum.toString()}
        episodeNum={episodeNum && episodeNum.toString()}
      />
    </Layout>
    }
    <Layout className={classNames('main-content', 'PostPage__post', { PostPage__post__failed: postFailed })}>
      <PostContainer
        author={author}
        permlink={permlink}
      />
      {!postFailed &&
      <React.Fragment>
        <Similar mediaType={type} tmdbid={tmdbid} />
      </React.Fragment>
          }
    </Layout>
  </Layout>
);

PostPage.propTypes = {
  mediaType: PropTypes.string,
  type: PropTypes.string,
  tmdbid: PropTypes.number,
  seasonNum: PropTypes.number,
  episodeNum: PropTypes.number,
  postFailed: PropTypes.bool.isRequired,
  match: PropTypes.shape().isRequired,
};

PostPage.defaultProps = {
  mediaType: null,
  type: null,
  tmdbid: null,
  seasonNum: null,
  episodeNum: null,
};

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { author, permlink } } } = ownProps;
  /* get necessary data from the media part of the post */
  const {
    mediaType, tmdbid, seasonNum, episodeNum, type,
  } = _.get(getPost(state, `@${author}/${permlink}`), 'media', {});
  return {
    postFailed: getPostState(state, `@${author}/${permlink}`).failed,
    mediaType,
    type,
    tmdbid,
    seasonNum,
    episodeNum,
  };
};

export default connect(mapStateToProps, {})(PostPage);
