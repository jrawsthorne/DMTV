import React from 'react';

import './PostPreview.less';
import './PostPreviewLoading.less';

const PostPreviewLoading = () => (
  <React.Fragment>
    {/* coloured background if doesn't exist */}
    <div className="ant-card-loading-block" style={{ height: 200 }} />
    <div className="PostPreview__body">
      <span className="ant-card-loading-block" style={{ height: 30, width: '100%' }} />
      <p>
        <span className="ant-card-loading-block" style={{ width: '28%' }} />
        <span className="ant-card-loading-block" style={{ width: '62%' }} />
      </p>
      <p>
        <span className="ant-card-loading-block" style={{ width: '22%' }} />
        <span className="ant-card-loading-block" style={{ width: '66%' }} />
      </p>
      <p>
        <span className="ant-card-loading-block" style={{ width: '56%' }} />
        <span className="ant-card-loading-block" style={{ width: '39%' }} />
      </p>
      <p>
        <span className="ant-card-loading-block" style={{ width: '21%' }} />
        <span className="ant-card-loading-block" style={{ width: '15%' }} />
        <span className="ant-card-loading-block" style={{ width: '40%' }} />
      </p>
    </div>
  </React.Fragment>
);

export default PostPreviewLoading;
