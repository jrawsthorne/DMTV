import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { Body } from './PostPreview';

const LoadingBlock = styled.div`
  width: ${props => (props.width || '100%')};
  height: ${props => (props.height || '14px')};
  ${props => !props.header && css`
    display: inline-block;
    margin: 5px 1% 0;
  `}
`;

const CardLoading = ({ className }) => (
  <div className={className}>
    {/* coloured background if doesn't exist */}
    <LoadingBlock className="ant-card-loading-block" height="200px" header />
    <Body>
      <LoadingBlock className="ant-card-loading-block" height="30px" />
      <div>
        <LoadingBlock className="ant-card-loading-block" width="28%" />
        <LoadingBlock className="ant-card-loading-block" width="62%" />
      </div>
      <div>
        <LoadingBlock className="ant-card-loading-block" width="22%" />
        <LoadingBlock className="ant-card-loading-block" width="66%" />
      </div>
      <div>
        <LoadingBlock className="ant-card-loading-block" width="56%" />
        <LoadingBlock className="ant-card-loading-block" width="39%" />
      </div>
      <div>
        <LoadingBlock className="ant-card-loading-block" width="21%" />
        <LoadingBlock className="ant-card-loading-block" width="15%" />
        <LoadingBlock className="ant-card-loading-block" width="40%" />
      </div>
    </Body>
  </div>
);

CardLoading.propTypes = {
  className: PropTypes.string,
};

CardLoading.defaultProps = {
  className: null,
};

export const PostPreviewLoadingContainer = styled.div`
  width: 100%;
  padding: 10px;
  @media (min-width: 768px) {
    width: 50%;
  }
`;

export const PreviewLoading = styled(CardLoading)`
  background: #fff;
  box-shadow: 0 0 41px 0 #e0e0e3, 0 0 0 0 #babdce;
  border-radius: 4px;
  height: 100%;
`;

export const PostPreviewLoading = () => (
  <PostPreviewLoadingContainer>
    <PreviewLoading />
  </PostPreviewLoadingContainer>
);

export default CardLoading;
