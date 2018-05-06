// Simplified version of https://github.com/beijaflor-io/react-responsive-utils
import matchMediaModule from 'matchmedia';
import {
  MEDIA_CHANGED,
  MEDIA_MOUNTED,
  reducer as responsiveReducer,
  mediaQueryTracker,
} from './redux-mediaquery';

export { MEDIA_CHANGED };
export { MEDIA_MOUNTED };

export { responsiveReducer };

export const large = '(min-width: 992px)';
export const medium = '(min-width: 768px)';
export const small = '(min-width: 576px)';
export const xSmall = '(max-width: 576px)';

export function isXSmall() {
  return matchMedia(xSmall).matches && !matchMedia(small).matches;
}

export function isSmall() {
  return matchMedia(small).matches && !matchMedia(medium).matches;
}

export function isMedium() {
  return matchMedia(medium).matches && !matchMedia(large).matches;
}

export function isLarge() {
  return matchMedia(large).matches;
}

export function mountResponsive(store) {
    const tracker = mediaQueryTracker({
      isXSmall: xSmall,
      isSmall: small,
      isMedium: medium,
      isLarge: large
    });

    const dispatch = store.dispatch.bind(store);
    store.dispatch(() => tracker(dispatch));
}
