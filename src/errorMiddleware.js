import { message } from 'antd';

export default () => next => (action) => {
  if (action.payload !== null && typeof action.payload === 'object' && typeof action.payload.then === 'function' && action.meta.globalError) {
    return next(action).catch((err) => {
      // show antd message with global error in action meta
      message.destroy();
      message.error(action.meta.globalError);
      if (process.env.NODE_ENV === 'development') {
        console.log(err); /* eslint-disable-line no-console */
      }
    });
  }
  return next(action);
};
