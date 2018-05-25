import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Layout, Divider } from 'antd';
import classNames from 'classnames';
import Loading from '../misc/Loading';
import MediaContainer from '../media/MediaContainer';
import PostContainer from '../post/PostContainer';
import Similar from '../media/Similar';
import './PostPage.less';

const PostPage = ({
  mediaType,
  tmdbid,
  seasonNum,
  episodeNum,
  postLoaded,
  postFailed,
  mediaLoaded,
  match: {
    params: { author, permlink },
  },
}) => {
  const mediaContainerStyles = {
    display: !mediaLoaded && 'none',
  };
  const postConatinerStyles = {
    display: (!mediaLoaded && !postFailed) && 'none',
  };
  return (
    <Layout>
      {(!postLoaded || (!mediaLoaded && !postFailed)) && <Loading />}
      <Layout style={mediaContainerStyles} >
        {mediaType && tmdbid && <MediaContainer
          mediaType={mediaType}
          tmdbid={`${tmdbid}`}
          seasonNum={seasonNum && seasonNum.toString()}
          episodeNum={episodeNum && episodeNum.toString()}
        />}
      </Layout>
      <Layout className={classNames('main-content', 'PostPage__post', { PostPage__post__failed: postFailed })} style={postConatinerStyles}>
        {!postFailed && <Divider />}
        <PostContainer
          author={author}
          permlink={permlink}
        />
        {!postFailed &&
          <React.Fragment>
            <Divider type="horizontal" className="ShowMobile" />
            <Similar author={author} permlink={permlink} />
          </React.Fragment>
          }
      </Layout>
    </Layout>
  );
};

PostPage.propTypes = {
  mediaType: PropTypes.string,
  tmdbid: PropTypes.number,
  seasonNum: PropTypes.number,
  episodeNum: PropTypes.number,
  postFailed: PropTypes.bool.isRequired,
  postLoaded: PropTypes.bool.isRequired,
  mediaLoaded: PropTypes.bool.isRequired,
  match: PropTypes.shape().isRequired,
};

PostPage.defaultProps = {
  mediaType: undefined,
  tmdbid: undefined,
  seasonNum: undefined,
  episodeNum: undefined,
};

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { author, permlink },
    },
  } = ownProps;
  const {
    mediaType, type, tmdbid, seasonNum, episodeNum,
  } = _.get(state, `posts.items[@${author}/${permlink}].media`, {});
  let query = '';
  query += `[${type}s].${tmdbid}`;
  if (seasonNum) query += `.seasons.${seasonNum}`;
  if (episodeNum) query += `.episodes.${episodeNum}`;
  return {
    postLoaded: _.get(state, `posts.itemStates[@${author}/${permlink}].loaded`, false),
    postFailed: _.get(state, `posts.itemStates[@${author}/${permlink}].failed`, false),
    mediaLoaded: _.get(state.media.itemStates, `${query}.loaded`, false),
    mediaType,
    tmdbid,
    seasonNum,
    episodeNum,
  };
};

export default connect(mapStateToProps, {})(PostPage);
