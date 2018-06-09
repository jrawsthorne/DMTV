import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Icon } from 'antd';

class SortBySelector extends React.Component {
  state = {
    visible: false,
  }
  handleVisibleChange = () => {
    this.setState(prevState => ({ visible: !prevState.visible }));
  }
  handleSelect = (current) => {
    this.setState({ visible: false }, () => this.props.onSortChange(current.key));
  }
  render() {
    const { sortBy } = this.props;
    const { visible } = this.state;

    const sorts = (
      <React.Fragment>
        <span key="trending">Trending</span>
        <span key="created">Created</span>
        <span key="active">Active</span>
        <span key="hot">Hot</span>
      </React.Fragment>
    );

    const currentSort = sorts.props.children.map(c => c).find(c => c.key === sortBy);

    return (
      <Popover
        onVisibleChange={this.handleVisibleChange}
        visible={visible}
        placement="bottomRight"
        trigger="click"
        content={(
          sorts.props.children.map(c => (
            <p role="presentation" onClick={() => this.handleSelect(c)} className="Selector__option" key={c.key}>
              {c.props.children}
            </p>
          ))
        )}
      >
        <span className="Selector Selector__sort-by">
          {currentSort.props.children} <Icon type="down" style={{ fontSize: 15 }} />
        </span>
      </Popover>
    );
  }
}

SortBySelector.propTypes = {
  sortBy: PropTypes.string,
  onSortChange: PropTypes.func,
};

SortBySelector.defaultProps = {
  sortBy: 'trending',
  onSortChange: () => {},
};

export default SortBySelector;
