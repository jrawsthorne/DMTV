import Wrapper from '../Wrapper';
import HomePage from '../components/pages/HomePage';
import MediaPage from '../components/pages/MediaPage';
import Error404Page from '../components/pages/Error404Page';

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
        path: '/:reviewType/:id',
        exact: true,
        component: MediaPage,
      },
      {
        path: '/:reviewType/:id/:seasonNum/:episodeNum',
        exact: true,
        component: MediaPage,
      },
      {
        path: '*',
        component: Error404Page,
      },
    ],
  },
];

export default routes;
