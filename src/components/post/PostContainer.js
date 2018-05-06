import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchPost } from '../../actions/postActions';

import Loading from '../misc/Loading';

import Post from '../post/Post';

class PostContainer extends React.Component {
    static propTypes = {
      fetchPost: PropTypes.func.isRequired,
      post: PropTypes.shape(),
      loaded: PropTypes.bool,
      fetching: PropTypes.bool,
      failed: PropTypes.bool,
      author: PropTypes.string.isRequired,
      permlink: PropTypes.string.isRequired,
    };
    componentDidMount() {
      if (!this.props.loaded) {
        this.props.fetchPost(
          this.props.author,
          this.props.permlink,
        );
      }
    }
    componentWillReceiveProps(nextProps) {
      if (!nextProps.loaded && !nextProps.fetching) {
        this.props.fetchPost(
          nextProps.author,
          nextProps.permlink,
        );
      }
    }
    render() {
      const {
        loaded, failed, fetching, post,
      } = this.props;
      if (failed) return 'Error loading metadata';
      if (fetching || !loaded) return <Loading />;
      return <Post body={post.body} title={post.title} />;
    }
}

PostContainer.defaultProps = {
  post: undefined,
  fetching: false,
  failed: false,
  loaded: false,
};

const mapStateToProps = (state, ownProps) => {
  const { author, permlink } = ownProps;
  return {
    post: _.get(state.posts.items, `@${author}/${permlink}`),
    fetching: _.get(state.posts.itemStates, `@${author}/${permlink}.fetching`),
    failed: _.get(state.posts.itemStates, `@${author}/${permlink}.failed`),
    loaded: _.get(state.posts.itemStates, `@${author}/${permlink}.loaded`),
  };
};

export default connect(mapStateToProps, { fetchPost })(PostContainer);
