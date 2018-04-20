import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import './List.less';
import noImageFound from '../../images/no-image-found.jpg';

const EpisodeTitle = props => `${props.name} S${props.seasonNum} E${props.episodeNum}`;

const EpisodeList = props => (
  <div className="List">
    <Button onClick={props.handleEpisodeListClick} type="primary" className="List__open__items">
      {props.showEpisodes ? 'Hide' : 'Show'} episodes
    </Button>
    {props.showEpisodes && <List
      itemLayout="horizontal"
      className="List__item__list"
      dataSource={Object.values(props.episodes)}
      renderItem={episode => <EpisodeListItem episode={episode} {...props} />}
    />}
  </div>
);

const EpisodeListItem = props => (
  <List.Item className="List__item__list__item">
    <List.Item.Meta
      avatar={<img alt="episode" width="92px" src={(props.episode.still_path && `https://image.tmdb.org/t/p/w92${props.episode.still_path}`) || (props.show.backdrop_path && `https://image.tmdb.org/t/p/w92${props.show.backdrop_path}`) || noImageFound} />}
      title={<EpisodeTitle
        name={props.episode.name}
        episodeCount={props.episode.episode_count}
        airDate={props.episode.air_date}
        episodeNum={props.episode.episode_number}
        seasonNum={props.episode.season_number}
      />}
      description={props.episode.overview || 'No overview'}
    />
  </List.Item>
);

EpisodeListItem.propTypes = {
  episode: PropTypes.shape().isRequired,
  show: PropTypes.shape().isRequired,
};

EpisodeList.propTypes = {
  episodes: PropTypes.shape().isRequired,
  handleEpisodeListClick: PropTypes.func.isRequired,
  showEpisodes: PropTypes.bool.isRequired,
};

export default EpisodeList;
