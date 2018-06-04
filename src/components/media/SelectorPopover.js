import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Popover, Icon } from 'antd';
import { newPostInfo } from '../../actions/postActions';

class SelectorPopver extends React.Component {
  state = {
    visible: false,
  }
  handleClick = (num) => {
    const isNewPostPage = this.props.match.path === '/new';
    /* hide popover when clicked */
    this.setState({ visible: false });
    const {
      tmdbid,
      seasonNum,
      type,
      history: {
        push,
      },
    } = this.props;
    if (type === 'season') {
      if (!isNewPostPage) {
        /* go to the season page if not on the new post page */
        push(`/show/${tmdbid}/season/${num}`);
      } else {
        /* else update the new post info */
        this.props.newPostInfo({
          mediaType: type,
          seasonNum: num.toString(),
        });
      }
    } else if (!isNewPostPage) {
      /* go to the episode page if not on the new post page */
      push(`/show/${tmdbid}/season/${seasonNum}/episode/${num}`);
    } else {
      /* else update the new post info */
      this.props.newPostInfo({
        mediaType: type,
        seasonNum: seasonNum.toString(),
        episodeNum: num.toString(),
      });
    }
  }
  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }
  render() {
    const { list, type } = this.props;
    const { visible } = this.state;
    if (!list) return null;
    return (
      <div className={`MediaHeader__info__${type}s`}>
        <Popover
          placement="bottomLeft"
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
          content={Object.values(list).map(item =>
            (
              <p
                role="presentation"
                onClick={() => this.handleClick(item[`${type}_number`])}
                onKeyPress={() => this.handleClick(item[`${type}_number`])}
                className="Filter__option"
                key={item[`${type}_number`]}
              >{item.name}
              </p>
            ))}
          trigger="click"
        >
          <h4 className="Filter__dropdown">{`${type.charAt(0).toUpperCase() + type.slice(1)}s`} <Icon type="down" style={{ fontSize: 15 }} /></h4>
        </Popover>
      </div>
    );
  }
}

SelectorPopver.propTypes = {
  list: PropTypes.shape(),
  type: PropTypes.string.isRequired,
  tmdbid: PropTypes.string.isRequired,
  seasonNum: PropTypes.string,
  newPostInfo: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

SelectorPopver.defaultProps = {
  list: undefined,
  seasonNum: undefined,
};

export default withRouter(connect(null, { newPostInfo })(SelectorPopver));
