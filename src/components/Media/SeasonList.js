import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import './List.less';
import noImageFound from '../../images/no-image-found.jpg';

const SeasonTitle = (props) => {
  const year = (props.seasonNumber !== 0 && props.airDate && `(${new Date(props.airDate).getFullYear()})`) || '';
  return `${props.name} ${year} | ${props.episodeCount} Episodes`;
};

const SeasonSwitcher = props => (
  <div className="List">
    <Button onClick={props.handleSeasonSwitcherClick} type="primary" className="List__open__items">
      {props.showSeasons ? 'Hide' : 'Show'} seasons
    </Button>
    {props.seasons && props.showSeasons && <List
      itemLayout="horizontal"
      className="List__item__list"
      dataSource={Object.values(props.seasons)}
      renderItem={season => <SeasonListItem season={season} {...props} />}
    />}
  </div>
);

const SeasonListItem = props => (
  <List.Item onClick={() => props.handleSeasonClick(props.season.season_number)} className="List__item__list__item">
    <List.Item.Meta
      avatar={<img alt="season" width="92px" src={(props.season.poster_path && `https://image.tmdb.org/t/p/w92${props.season.poster_path}`) || (props.show.poster_path && `https://image.tmdb.org/t/p/w92${props.show.poster_path}`) || noImageFound} />}
      title={<SeasonTitle
        name={props.season.name}
        episodeCount={props.season.episode_count}
        airDate={props.season.air_date}
        seasonNumber={props.season.season_number}
      />}
      description={props.season.overview || 'No overview'}
    />
  </List.Item>
);

SeasonListItem.propTypes = {
  season: PropTypes.shape().isRequired,
  handleSeasonClick: PropTypes.func.isRequired,
  show: PropTypes.shape().isRequired,
};

SeasonSwitcher.propTypes = {
  seasons: PropTypes.shape().isRequired,
  handleSeasonSwitcherClick: PropTypes.func.isRequired,
  showSeasons: PropTypes.bool.isRequired,
  handleSeasonClick: PropTypes.func.isRequired,
};

export default SeasonSwitcher;
