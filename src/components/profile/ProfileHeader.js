import React from 'react';
import PropTypes from 'prop-types';
import urlParse from 'url-parse';
import classNames from 'classnames';
import './ProfileHeader.less';

const ProfileHeader = (props) => {
  let { website } = props;
  if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
    website = `http://${website}`;
  }
  const url = urlParse(website);
  let hostWithoutWWW = url.host;

  if (hostWithoutWWW.indexOf('www.') === 0) {
    hostWithoutWWW = hostWithoutWWW.slice(4);
  }
  return (
    <div className="ProfileHeader">
      {/* change background colour if there isn't a cover image */}
      <div
        className="ProfileHeader__background"
        style={props.coverImage ? { background: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url(https://steemitimages.com/2048x512/${props.coverImage})` } : { background: '#f5f5f5' }}
      >
        <div className="ProfileHeader__main" style={{ position: 'relative' }}>
          <div className="ProfileHeader__main__avatar" style={{ backgroundImage: `url(https://steemitimages.com/u/${props.username}/avatar/large)` }} />
          <div className={classNames('ProfileHeader__main__info', { noCoverImage: !props.coverImage })}>
            <div className="ProfileHeader__main__info__name">
              {props.name ? props.name : props.username}
            </div>
            <div className="ProfileHeader__main__info__about">
              <p>{`@${props.username}`}</p>
              {props.location && <p>{props.location}</p>}
              {props.website && <p className="ProfileHeader__main__info__about__website"><a href={website}>{`${hostWithoutWWW}${url.pathname.replace(/\/$/, '')}`}</a></p>}
              {props.about && <p>{props.about}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
