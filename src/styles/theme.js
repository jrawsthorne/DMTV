import styled, { css } from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button as AntdButton,
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
export default {
  ...theme,
  ...colours,
};
