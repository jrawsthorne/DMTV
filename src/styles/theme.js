import styled, { css } from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button as AntdButton,
  Tooltip as AntdTooltip,
  Input,
  Form,
} from 'antd';

const colours = {
  primary: '#f5f8fd',
  secondary: '#246ee9',
  accent: '#7276a2',
  darkBlue: '#bebedb',
};

const theme = {
  containerWidth: '1010px',
  leftWidth: '180px',
  rightWidth: '270px',
  margin: '20px',
  navBackground: colours.primary,
  navBoxShadow: '0 0 4px rgba(0, 0, 0, 0.05)',
  logoColour: colours.secondary,
  logoHoverColour: colours.secondary,
  notification: {
    background: {
      error: '#efc6c2',
      info: '#babdce',
      default: '#e1ecfe',
      attention: colours.secondary,
      success: '#cbfae0',
    },
    color: {
      error: '#e1574c',
      info: '#51577e',
      default: '#266fe9',
      attention: '#e1ecfe',
      success: '#50ca87',
    },
  },
  button: {
    border: {
      error: '#e1574c',
      info: '#51577e',
      default: '#266fe9',
      attention: colours.secondary,
      success: '#50ca87',
    },
    background: {
      error: '#efc6c2',
      info: '#babdce',
      default: '#e1ecfe',
      attention: colours.secondary,
      success: '#cbfae0',
    },
    color: {
      error: '#c32a25',
      info: '#51577e',
      default: '#266fe9',
      attention: '#e1ecfe',
      success: '#50ca87',
    },
  },
};

export const TextArea = styled(Input.TextArea)`
  border-radius: 2px;
  border: none;
  color: ${colours.darkBlue};
  ::placeholder {
    color: ${colours.darkBlue};
  }
  box-shadow: none;
  margin: ${props => props.margin || '0'};
  padding: ${props => props.padding || '0'};
  &:hover, &:focus {
    border: none;
    box-shadow: none!important;
  }
`;

export const Notification = styled.div`
  background: ${props => theme.notification.background[props.type || 'default']};
  padding: 20px;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 10px;
  p {
    color: ${props => theme.notification.color[props.type || 'default']};
    margin-bottom: 0;
    font-weight: bold;
  }
`;

const PropsButton = ({ padding, margin, ...restProps }) => <AntdButton {...restProps} />;

PropsButton.propTypes = {
  padding: PropTypes.string,
  margin: PropTypes.string,
};

PropsButton.defaultProps = {
  padding: null,
  margin: null,
};

export const Button = styled(PropsButton)`
  border-radius: ${props => (props.shape === 'circle' ? '50%' : '2px')};
  text-transform: uppercase;
  padding: ${(props) => {
    if (props.padding) return props.padding;
    if (props.shape === 'circle') return '0';
    return '5px 30px';
  }};
  font-size: ${props => props.fontSize || '16px'};
  margin: ${props => props.margin || '0'};
  font-weight: bold;
  height: ${props => (props.shape === 'circle' ? '32px' : 'auto')};
  color: ${props => (props.type ? theme.button.color[props.type] : theme.button.color.default)};
  border-color: ${props => (props.type ? theme.button.border[props.type] : theme.button.border.default)};
  background: ${props => (props.type ? theme.button.background[props.type] : theme.button.background.default)};
  &:focus {
    color: ${props => (props.type ? theme.button.color[props.type] : theme.button.color.default)};
    border-color: ${props => (props.type ? theme.button.border[props.type] : theme.button.border.default)};
    background: ${props => (props.type ? theme.button.background[props.type] : theme.button.background.default)};
  }
  &:hover {
    background: ${props => (props.type ? theme.button.border[props.type] : theme.button.border.default)};
    border-color: ${props => (props.type ? theme.button.border[props.type] : theme.button.border.default)};
    color: #fff;
  }
  ${props => props.size && props.size.small && css`
    padding: 5px 15px;
    font-size: 12px;
  `}
  ${props => props.loading && css`
    > i {
      margin-left: 0!important;
    }
  `}
`;

export const FormItem = styled(Form.Item)`
  margin: ${props => props.margin || '0'};
  padding: ${props => props.padding || '0'};
  .ant-form-explain {
    display: none;
  }
`;

const StyledTooltip = ({ className, children, ...restProps }) =>
  <AntdTooltip overlayClassName={className} {...restProps}>{children}</AntdTooltip>;

StyledTooltip.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

StyledTooltip.defaultProps = {
  className: null,
};

export const Tooltip = styled(StyledTooltip)`
  .ant-tooltip-inner {
    font-weight: bold;
    color: ${props => (props.type ? theme.button.color[props.type] : theme.button.color.default)};
    background-color: ${props => (props.type ? theme.button.background[props.type] : theme.button.background.default)};
  }
  .ant-tooltip-arrow {
    border-right-color: ${props => (props.type ? theme.button.background[props.type] : theme.button.background.default)};
  }
`;

export default {
  ...theme,
  ...colours,
};
