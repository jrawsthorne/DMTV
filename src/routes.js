import Wrapper from './components/misc/Wrapper';
import HomePage from './components/pages/HomePage';
import Error404Page from './components/pages/Error404Page';
import MediaPage from './components/pages/MediaPage';
import PostPage from './components/pages/PostPage';
import ProfilePage from './components/pages/ProfilePage';

const routes = [
  {
    component: Wrapper,
    routes: [
      {
        path: '/:filter(movies|shows|episodes|all|subscriptions)?',
        exact: true,
        component: HomePage,
      },
      {
        path: '/:mediaType(movie|show)/:id',
        exact: true,
        component: MediaPage,
      },
      {
        path: '/:mediaType(show)/:id/season/:seasonNum',
        exact: true,
        component: MediaPage,
      },
      {
        path: '/:mediaType(show)/:id/season/:seasonNum/episode/:episodeNum',
        exact: true,
        component: MediaPage,
      },
      {
        path: '/@:author/:permlink',
        exact: true,
        component: PostPage,
      },
      {
        path: '/@:username',
        exact: true,
        component: ProfilePage,
      },
      {
        path: '*',
        component: Error404Page,
      },
    ],
  },
];

export default routes;
