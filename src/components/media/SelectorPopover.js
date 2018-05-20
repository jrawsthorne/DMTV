import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Popover, Icon } from 'antd';

class SelectorPopver extends React.Component {
  state = {
    visible: false,
  }
  handleClick = (num) => {
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
      push(`/show/${tmdbid}/season/${num}`);
    } else {
      push(`/show/${tmdbid}/season/${seasonNum}/episode/${num}`);
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
  history: PropTypes.shape().isRequired,
};

SelectorPopver.defaultProps = {
  list: undefined,
  seasonNum: undefined,
};

export default withRouter(SelectorPopver);
