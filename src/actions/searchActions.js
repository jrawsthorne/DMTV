import _ from 'lodash';
import theMovieDBAPI from '../apis/theMovieDBAPI';
import noImageFound from '../images/no-image-found.jpg';
import { SEARCH } from './types';

/*
search using query, q
return array of objects containing id, title, img, year and url
*/
export const search = q => ({
  type: SEARCH,
  payload: q ? theMovieDBAPI.searchMulti({ query: q })
    .then(response => response.results)
    .then(data =>
      // filter out people
      data.filter(item => item.media_type !== 'person').map(mediaItem => ({
        id: mediaItem.id,
        title: _.get(mediaItem, 'title') || _.get(mediaItem, 'name') || 'No title',
        img: (mediaItem.poster_path && `https://image.tmdb.org/t/p/w45${mediaItem.poster_path}`) || noImageFound,
        year: (mediaItem.release_date && new Date(mediaItem.release_date).getFullYear()) ||
          (mediaItem.first_air_date && new Date(mediaItem.first_air_date).getFullYear()),
        url: `/${mediaItem.media_type === 'tv' ? 'show' : 'movie'}/${mediaItem.id}`,
      }))) : new Promise(resolve => resolve([])), // return empty array if q empty
  meta: {
    globalError: 'Sorry, search failed',
  },
});

export default search;
