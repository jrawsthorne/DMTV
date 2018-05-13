import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Layout, Popover, Icon } from 'antd';
import PostsContainer from '../post/PostsContainer';
import './HomePage.less';

class HomePage extends React.Component {
  state = {
    visible: false,
    currentFilter: undefined,
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    const { mediaType } = this.props.match.params;
    if (mediaType) {
      this.setState({
        currentFilter: mediaType[0].toUpperCase() + mediaType.substr(1),
      });
    } else {
      this.setState({
        currentFilter: undefined,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { mediaType } = nextProps.match.params;
    if (mediaType) {
      this.setState({
        currentFilter: mediaType[0].toUpperCase() + mediaType.substr(1),
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
    const { mediaType } = this.props.match.params;
    const { visible, currentFilter } = this.state;
    const filters = ['All', 'Movies', 'Shows', 'Episodes'];
    const content = (
      /* eslint-disable
      jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */
      <div>{filters.map(filter => <p onClick={() => this.handleFilterClick(filter)} className="Filter__option" key={filter.toLowerCase()}>{filter}</p>)}</div>
      /* eslint-enable
        jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */
    );
    return (
      <Layout className="main-content">
        <h2>
          Latest
          <Popover onVisibleChange={this.handleVisibleChange} visible={visible} placement="bottom" content={content} trigger="click">
            <span className="Filter__dropdown">{currentFilter && currentFilter} <Icon type="down" style={{ fontSize: 15 }} /></span>
          </Popover>
        </h2>
        <p>These posts are real but just for testing.</p>
        <PostsContainer mediaType={mediaType && mediaType.slice(0, -1)} />
      </Layout>
    );
  }
}

HomePage.propTypes = {
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default withRouter(HomePage);
