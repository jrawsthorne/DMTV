import { getMediaItem } from '../helpers/apiHelpers';

export const search = q => ({
  type: 'SEARCH',
  payload: getMediaItem('search', { q })
    .then(response => response.results)
    .then(data =>
      data.filter(item => item.media_type !== 'person').map((mediaItem) => {
        const temp = {};
        temp.id = mediaItem.id;
        if (mediaItem.title) { temp.title = mediaItem.title; }
        if (mediaItem.name) { temp.title = mediaItem.name; }
        temp.img = mediaItem.poster_path;
        temp.media_type = mediaItem.media_type;
        if (mediaItem.media_type === 'tv') { temp.media_type = 'show'; }
        const date = mediaItem.release_date ?
          mediaItem.release_date : mediaItem.first_air_date;
        temp.year = date && new Date(date).getFullYear();
        return temp;
      })),
  meta: {
    globalError: 'Sorry, search failed',
  },
});

export const clearResults = () => ({
  type: 'CLEAR_RESULTS',
});

export const setSearchBar = value => ({
  type: 'SET_SEARCH_BAR',
  payload: value,
});

export default search;