import Loadable from 'react-loadable';
import Wrapper from './components/misc/Wrapper';

const HomePage = Loadable({
  loader: () => import('./components/pages/HomePage'),
  loading: (() => null),
});

const Error404Page = Loadable({
  loader: () => import('./components/pages/Error404Page'),
  loading: (() => null),
});

const MediaPage = Loadable({
  loader: () => import('./components/pages/MediaPage'),
  loading: (() => null),
});

const PostPage = Loadable({
  loader: () => import('./components/pages/PostPage'),
  loading: (() => null),
});

const ProfilePage = Loadable({
  loader: () => import('./components/pages/ProfilePage'),
  loading: (() => null),
});

const NewPostPage = Loadable({
  loader: () => import('./components/pages/NewPostPage'),
  loading: (() => null),
});

const PersonPage = Loadable({
  loader: () => import('./components/pages/PersonPage'),
  loading: (() => null),
});

const routes = [
  {
    component: Wrapper,
    routes: [
      {
        path: '/:sortBy(trending|created|active|hot|promoted)?/:category(movie|show|episode)?',
        component: HomePage,
        exact: true,
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
        path: '/new',
        exact: true,
        component: NewPostPage,
      },
      {
        path: '/person/:id',
        exact: true,
        component: PersonPage,
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
