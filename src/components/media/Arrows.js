import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { newPostInfo } from '../../actions/postActions';

class Arrows extends React.Component {
  handleClick = () => {
    const isNewPostPage = this.props.match.path === '/new';
    /* hide popover when clicked */
    const {
      seasonNum,
      episodeNum,
      direction,
      link,
      history: {
        push,
      },
    } = this.props;
    if (isNewPostPage) {
      const oldEpisodeNum = parseInt(episodeNum, 10);
      const oldSeasonNum = parseInt(seasonNum, 10);
      let newEpisodeNum;
      let newSeasonNum;
      let mediaType;
      if (direction === 'left') {
        if (oldEpisodeNum) {
          newEpisodeNum = oldEpisodeNum - 1;
          newSeasonNum = oldSeasonNum;
          mediaType = 'episode';
        } else {
          newEpisodeNum = null;
          newSeasonNum = oldSeasonNum - 1;
          mediaType = 'season';
        }
      }
      if (direction === 'right') {
        if (oldEpisodeNum) {
          newEpisodeNum = oldEpisodeNum + 1;
          newSeasonNum = oldSeasonNum;
          mediaType = 'episode';
        } else {
          newEpisodeNum = null;
          newSeasonNum = oldSeasonNum + 1;
          mediaType = 'season';
        }
      }
      /* else update the new post info */
      this.props.newPostInfo({
        seasonNum: newSeasonNum.toString(),
        episodeNum: newEpisodeNum ? newEpisodeNum.toString() : null,
        mediaType,
      });
    } else {
      push(link);
    }
  }
  render() {
    const { link, direction } = this.props;
    if (!link) return null;
    return (
      /* Go to the next or previous episode or season */
      <span className="prev-next" role="presentation" onClick={this.handleClick} >
        <Icon
          type={direction === 'left' ? 'left' : 'right'}
          className={`${direction === 'left' ? 'prev' : 'next'}-icon`}
        />
      </span>
    );
  }
}

Arrows.propTypes = {
  link: PropTypes.string,
  direction: PropTypes.string.isRequired,
  newPostInfo: PropTypes.func.isRequired,
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  seasonNum: PropTypes.string,
  episodeNum: PropTypes.string,
};

Arrows.defaultProps = {
  link: null,
  seasonNum: null,
  episodeNum: null,
};

export default withRouter(connect(null, { newPostInfo })(Arrows));
