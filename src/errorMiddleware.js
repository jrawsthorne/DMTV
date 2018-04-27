import { message } from 'antd';

export default () => next => (action) => {
  if (action.payload !== null && typeof action.payload === 'object' && typeof action.payload.then === 'function' && action.meta.globalError) {
    return next(action).catch(() => {
      // show antd message with global error in action meta
      message.error(action.meta.globalError);
    });
  }
  return next(action);
};
