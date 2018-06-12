import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Layout, Divider } from 'antd';
import classNames from 'classnames';
import Loading from '../misc/Loading';
import MediaContainer from '../../containers/MediaContainer';
import PostContainer from '../../containers/PostContainer';
import { getPostState, getPost } from '../../reducers';
import { getMediaStatusFromState } from '../../helpers/stateHelpers';
import Similar from '../media/Similar';
import './PostPage.less';
import ScrollToTop from '../misc/ScrollToTop';

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
      <ScrollToTop />
      {/* show loading while media and post loading */}
      {(!postLoaded || (!mediaLoaded && !postFailed)) && <Loading />}
      <Layout style={mediaContainerStyles} >
        {mediaType && tmdbid && <MediaContainer
          mediaType={mediaType}
          tmdbid={`${tmdbid}`}
          seasonNum={seasonNum && seasonNum.toString()}
          episodeNum={episodeNum && episodeNum.toString()}
        />}
      </Layout>
      {/* hide main content until media loaded */}
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
  const { match: { params: { author, permlink } } } = ownProps;
  const {
    mediaType, tmdbid, seasonNum, episodeNum,
  } = _.get(getPost(state, `@${author}/${permlink}`), 'media', {});
  return {
    postLoaded: getPostState(state, `@${author}/${permlink}`).loaded,
    postFailed: getPostState(state, `@${author}/${permlink}`).failed,
    mediaLoaded: getMediaStatusFromState({
      id: tmdbid, mediaType, seasonNum, episodeNum,
    }, state.media.itemStates).loaded,
    mediaType,
    tmdbid,
    seasonNum,
    episodeNum,
  };
};

export default connect(mapStateToProps, {})(PostPage);
