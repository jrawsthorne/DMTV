import React from 'react';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import { Layout } from 'antd';
import ScrollToTop from '../misc/ScrollToTop';
import ReloadFeedButton from '../misc/ReloadFeedButton';

const PostsContainer = Loadable({
  loader: () => import('../../containers/PostsContainer'),
  loading: (() => null),
});

const FilterSelector = Loadable({
  loader: () => import('../FilterSelector'),
  loading: (() => null),
});

const SortBySelector = Loadable({
  loader: () => import('../SortBySelector'),
  loading: (() => null),
});

class HomePage extends React.Component {
  handleSortChange = (key) => {
    const { history: { push }, match: { params: { category } } } = this.props;
    if (category) {
      push(`/${key}/${category}`);
    } else {
      push(`/${key}`);
    }
  }
  handleFilterChange = (key) => {
    const { history: { push }, match: { params: { sortBy } } } = this.props;
    if (sortBy) {
      push(`/${sortBy}/${key}`);
    } else {
      push(`/trending/${key}`);
    }
  }
  render() {
    const { sortBy, category } = this.props.match.params;
    return (
      <Layout className="main-content">
        <ScrollToTop />
        <h2>
          <SortBySelector sortBy={sortBy} onSortChange={this.handleSortChange} />
          { } <FilterSelector category={category} onFilterChange={this.handleFilterChange} />
          { } <ReloadFeedButton sortBy={sortBy} category={category} />
        </h2>
        <PostsContainer />
      </Layout>
    );
  }
}

HomePage.propTypes = {
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default HomePage;
