import React from 'react';
import './ProfileHeader.less';

const ProfileHeaderLoading = () => (
  <div className="ProfileHeader">
    {/* change background colour if there isn't a cover image */}
    <div
      className="ProfileHeader__background"
      style={{ background: '#f5f5f5' }}
    >
      <div className="ProfileHeader__main" style={{ position: 'relative' }}>
        <div className="ProfileHeader__main__avatar ant-card-loading-block" />
        <div className="ProfileHeader__main__info noCoverImage" style={{ width: '30%' }}>
          <div className="ProfileHeader__main__info__name">
            <p className="ant-card-loading-block" style={{ height: 30, width: '50%', margin: '10px auto' }} />
          </div>
          <div className="ProfileHeader__main__info__about">
            <p className="ant-card-loading-block" style={{ width: '30%', margin: '0 auto 10px auto' }} />
            <p className="ant-card-loading-block" style={{ width: '20%', margin: '0 auto 10px auto' }} />
            <p className="ant-card-loading-block" style={{ width: '40%', margin: '0 auto 10px auto' }} />
            <p className="ant-card-loading-block" style={{ width: '100%', margin: '0 auto 10px auto' }} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHeaderLoading;
