import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Popover, Icon } from 'antd';
import PostsContainer from '../post/PostsContainer';

class HomePage extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    const { filter } = nextProps.match.params;
    /* set filter state based on param */
    return {
      currentFilter: filter ? filter[0].toUpperCase() + filter.substr(1) : undefined,
    };
  }
  state = {
    visible: false,
    currentFilter: undefined,
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    const { filter } = this.props.match.params;
    if (filter) {
      this.setState({
        currentFilter: filter[0].toUpperCase() + filter.substr(1),
      });
    } else {
      this.setState({
        currentFilter: undefined,
      });
    }
  }
  componentDidUpdate(prevProps) {
    const { isAuthenticated, history: { push } } = this.props;
    const { isAuthenticated: wasAuthenticated } = prevProps;
    const { currentFilter } = this.state;
    /* redirect to home if logout on subscription page */
    if (wasAuthenticated && !isAuthenticated && currentFilter === 'Subscriptions') {
      push('/');
    }
  }
  handleFilterClick = (key) => {
    const filter = key.toLowerCase();
    /* change url based on filter click */
    if (filter === 'all') {
      this.props.history.push('/');
      this.setState({ currentFilter: undefined });
    } else {
      this.props.history.push(`/${filter}`);
      this.setState({ currentFilter: key });
    }
    this.setState({ visible: false });
  }
  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }

  render() {
    const { filter } = this.props.match.params;
    const { isAuthenticated } = this.props;
    const { visible, currentFilter } = this.state;
    const filters = ['All', 'Movies', 'Shows', 'Episodes'];
    /* add subscriptions dropdown if authenticated */
    if (isAuthenticated) filters.push('Subscriptions');
    const content = (
      <div>
        {filters.map(f => (
          <p role="presentation" onClick={() => this.handleFilterClick(f)} onKeyPress={() => this.handleFilterClick(f)} className="Filter__option" key={f.toLowerCase()}>
            {f}
          </p>
        ))}
      </div>
    );
    let props;
    if (filter === 'movies' || filter === 'episodes' || filter === 'shows') {
      props = { mediaType: filter.slice(0, -1) };
    } else if (filter === 'subscriptions') {
      if (isAuthenticated) {
        props = { subscriptions: true };
      }
    }
    return (
      <Layout className="main-content">
        <h2>
          Latest
          <Popover onVisibleChange={this.handleVisibleChange} visible={visible} placement="bottom" content={content} trigger="click">
            <span style={{ marginLeft: 5 }} className="Filter__dropdown"> {currentFilter && currentFilter} <Icon type="down" style={{ fontSize: 15 }} /></span>
          </Popover>
        </h2>
        {/* show auth error if on subscriptions page and not logged in */}
        {(isAuthenticated || filter !== 'subscriptions') ? <PostsContainer {...props} /> : 'Not authenticated'}
      </Layout>
    );
  }
}

HomePage.propTypes = {
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default withRouter(connect(mapStateToProps, {})(HomePage));
