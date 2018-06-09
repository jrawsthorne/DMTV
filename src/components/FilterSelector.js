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
    this.setState({ visible: false }, () => this.props.onFilterChange(current.key));
  }
  render() {
    const { category } = this.props;
    const { visible } = this.state;

    const sorts = (
      <React.Fragment>
        <span key="">All</span>
        <span key="movie">Movies</span>
        <span key="show">Shows</span>
        <span key="episode">Episodes</span>
      </React.Fragment>
    );

    const currentFilter = sorts.props.children.map(c => c).find(c => c.key === category);

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
        <span className="Selector Selector__filter">
          {currentFilter.props.children} <Icon type="down" style={{ fontSize: 15 }} />
        </span>
      </Popover>
    );
  }
}

SortBySelector.propTypes = {
  category: PropTypes.string,
  onFilterChange: PropTypes.func,
};

SortBySelector.defaultProps = {
  category: '',
  onFilterChange: () => {},
};

export default SortBySelector;
