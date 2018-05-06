import React from 'react';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import './List.less';
import noImageFound from '../../../images/no-image-found.jpg';

const SeasonTitle = (props) => {
  const year = (props.seasonNumber !== 0 && props.airDate && `(${new Date(props.airDate).getFullYear()})`) || '';
  return `${props.name} ${year} | ${props.episodeCount} Episodes`;
};

const SeasonList = props => (
  <div className="List">
    <Button onClick={props.handleSeasonListClick} type="primary" className="List__open__items">
      {props.showSeasons ? 'Hide' : 'Show'} seasons
    </Button>
    {props.seasons && <List
      itemLayout="horizontal"
      className={classNames('List__item__list', { showList: props.showSeasons })}
      dataSource={Object.values(props.seasons)}
      renderItem={season => <SeasonListItem season={season} {...props} />}
    />}
  </div>
);

const SeasonListItem = props => (
  <List.Item className="List__item__list__item">
    <Link to={`/show/${props.show.id}/season/${props.season.season_number}`}>
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
    </Link>
  </List.Item>
);

SeasonListItem.propTypes = {
  season: PropTypes.shape().isRequired,
  show: PropTypes.shape().isRequired,
};

SeasonList.propTypes = {
  seasons: PropTypes.shape().isRequired,
  handleSeasonListClick: PropTypes.func.isRequired,
  showSeasons: PropTypes.bool.isRequired,
};

export default SeasonList;
