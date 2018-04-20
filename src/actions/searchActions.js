import _ from 'lodash';
import theMovieDBAPI from '../apis/theMovieDBAPI';

export const search = q => ({
  type: 'SEARCH',
  payload: q ? theMovieDBAPI.searchMulti({ query: q })
    .then(response => response.results)
    .then(data =>
      data.filter(item => item.media_type !== 'person').map((mediaItem) => {
        const date = mediaItem.release_date ?
          mediaItem.release_date : mediaItem.first_air_date;
        return {
          id: mediaItem.id,
          title: _.get(mediaItem, 'title') || _.get(mediaItem, 'name') || 'No title',
          img: mediaItem.poster_path,
          media_type: mediaItem.media_type === 'tv' ? 'show' : 'movie',
          year: date && new Date(date).getFullYear(),
        };
      })) : new Promise(resolve => resolve([])),
  meta: {
    globalError: 'Sorry, search failed',
  },
});

export default search;
