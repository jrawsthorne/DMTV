import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Layout } from 'antd';
import PostsContainer from '../post/PostsContainer';

class HomePage extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    const { mediaType } = this.props.match.params;
    /* Output content for testing */
    const title = () => {
      switch (mediaType) {
        case 'movies': {
          return (<h2>Latest Movie Reviews <small> | <Link to="/">All</Link></small></h2>);
        }
        case 'shows': {
          return <h2>Latest TV Reviews <small> | <Link to="/">All</Link></small></h2>;
        }
        case 'episodes': {
          return <h2>Latest Episode Reviews <small> | <Link to="/">All</Link></small></h2>;
        }
        default: {
          return (
            <h2>
        Latest Reviews
              <small> | <Link to="/movies">Movies</Link></small>
              <small> | <Link to="/shows">Shows</Link></small>
              <small> | <Link to="/episodes">Episodes</Link></small>
            </h2>);
        }
      }
    };
    return (
      <Layout className="main-content">
        {title()}
        <p>These posts are real but just for testing.</p>
        <PostsContainer mediaType={mediaType && mediaType.slice(0, -1)} />
      </Layout>
    );
  }
}

HomePage.propTypes = {
  match: PropTypes.shape().isRequired,
};

export default withRouter(HomePage);
