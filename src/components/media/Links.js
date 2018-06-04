import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import * as actions from '../../actions/postActions';

/* Links to go back to the main item or the season page */
const Links = ({
  mediaType, tmdbid, seasonNum, mediaItem, isPostPage, isNewPostPage, newPostInfo,
}) => {
  if (mediaType === 'season' || mediaType === 'episode') {
    if (!isNewPostPage) {
      return (
        /* Link to the main show page */
        <div className="MediaHeader__info__links">
          <Link to={`/show/${tmdbid}`} >
            <Icon type="arrow-left" /> {mediaItem.title}
          </Link>
          {mediaType === 'episode' && (
            /* Link to the season page */
            <Link to={`/show/${tmdbid}/season/${seasonNum}`} >
              <Icon type="arrow-left" /> {mediaItem.seasons[seasonNum].name}
            </Link>
          )}
        </div>
      );
    }
    return (
      <div className="MediaHeader__info__links">
        {/* Change the new post info to the main show */}
        <p onClick={() => newPostInfo({ seasonNum: null, episodeNum: null, mediaType: 'show' })} role="presentation" >
          <Icon type="arrow-left" /> {mediaItem.title}
        </p>
        {mediaType === 'episode' && (
        <p onClick={() => newPostInfo({ episodeNum: null, mediaType: 'season' })} role="presentation" > {/* Change the new post info to the season */}
          <Icon type="arrow-left" /> {mediaItem.seasons[seasonNum].name}
        </p>
          )}
      </div>
    );
  } else if (isPostPage) {
    return (
      <div className="MediaHeader__info__links">
        {/* Link to the movie or show page from a post */}
        <Link to={`/${mediaType}/${tmdbid}`} >
          <Icon type="arrow-left" /> {mediaItem.title}
        </Link>
      </div>
    );
  }
  return null;
};

Links.propTypes = {
  tmdbid: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  seasonNum: PropTypes.string,
  mediaItem: PropTypes.shape().isRequired,
  isPostPage: PropTypes.bool.isRequired,
  isNewPostPage: PropTypes.bool.isRequired,
  newPostInfo: PropTypes.func.isRequired,
};

Links.defaultProps = {
  seasonNum: undefined,
};

export default connect(null, { newPostInfo: actions.newPostInfo })(Links);
