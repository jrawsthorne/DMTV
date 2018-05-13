import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import './ProfileHeader.less';

const ProfileHeader = props => (
  <div className="ProfileHeader">
    <div
      className="ProfileHeader__background"
      style={props.coverImage ? { background: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url(https://steemitimages.com/2048x512/${props.coverImage})` } : { background: 'linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8))' }}
    >
      <div className="ProfileHeader__main" style={{ position: 'relative' }}>
        <div className="ProfileHeader__main__avatar">
          <Avatar src={`https://steemitimages.com/u/${props.username}/avatar/large`} />
        </div>
        <div className="ProfileHeader__main__info">
          <div className="ProfileHeader__main__info__name">
            {props.name && props.name}
          </div>
          <div className="ProfileHeader__main__info__about">
            <p>{`@${props.username}`}</p>
            <p>{props.location}</p>
            <p>{props.website}</p>
            <p>{props.about}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

ProfileHeader.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string.isRequired,
  coverImage: PropTypes.string,
  about: PropTypes.string,
  location: PropTypes.string,
  website: PropTypes.string,
};

ProfileHeader.defaultProps = {
  coverImage: undefined,
  about: undefined,
  name: undefined,
  website: undefined,
  location: undefined,
};

export default ProfileHeader;
