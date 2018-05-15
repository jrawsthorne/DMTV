import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Popover, Icon } from 'antd';
import PostsContainer from '../post/PostsContainer';

class HomePage extends React.Component {
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
  componentWillReceiveProps(nextProps) {
    const { filter } = nextProps.match.params;
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
  handleFilterClick = (key) => {
    const filter = key.toLowerCase();
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
    const { isAuthenticated, loaded } = this.props;
    const { visible, currentFilter } = this.state;
    const filters = ['All', 'Movies', 'Shows', 'Episodes'];
    if (isAuthenticated) filters.push('Subscriptions');
    const content = (
      /* eslint-disable
      jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */
      <div>{filters.map(f => <p onClick={() => this.handleFilterClick(f)} className="Filter__option" key={f.toLowerCase()}>{f}</p>)}</div>
      /* eslint-enable
        jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */
    );
    let props;
    if (filter === 'movies' || filter === 'episodes' || filter === 'shows') {
      props = { mediaType: filter.slice(0, -1) };
    } else if (filter === 'subscriptions') {
      if (isAuthenticated) {
        props = { subscriptions: true };
      } else if (loaded) {
        this.props.history.push('/');
      }
    }
    return (
      <Layout className="main-content">
        <h2>
          Latest
          <Popover onVisibleChange={this.handleVisibleChange} visible={visible} placement="bottom" content={content} trigger="click">
            <span className="Filter__dropdown">{currentFilter && currentFilter} <Icon type="down" style={{ fontSize: 15 }} /></span>
          </Popover>
        </h2>
        <p>These posts are real but just for testing.</p>
        {loaded && <PostsContainer {...props} />}
      </Layout>
    );
  }
}

HomePage.propTypes = {
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loaded: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loaded: state.auth.loaded,
});

export default withRouter(connect(mapStateToProps, {})(HomePage));
