import Wrapper from './components/misc/Wrapper';
import HomePage from './components/pages/HomePage';
import Error404Page from './components/pages/Error404Page';
import ShowPage from './components/pages/ShowPage';
import MoviePage from './components/pages/MoviePage';
import EpisodePage from './components/pages/EpisodePage';
import SeasonPage from './components/pages/SeasonPage';

const routes = [
  {
    component: Wrapper,
    routes: [
      {
        path: '/',
        exact: true,
        component: HomePage,
      },
      {
        path: '/show/:id',
        exact: true,
        component: ShowPage,
      },
      {
        path: '/movie/:id/',
        exact: true,
        component: MoviePage,
      },
      {
        path: '/show/:id/season/:seasonNum/episode/:episodeNum',
        exact: true,
        component: EpisodePage,
      },
      {
        path: '/show/:id/season/:seasonNum',
        exact: true,
        component: SeasonPage,
      },
      {
        path: '*',
        component: Error404Page,
      },
    ],
  },
];

export default routes;
