import { message } from 'antd';

export default () => next => (action) => {
  if (action.payload !== null && typeof action.payload === 'object' && typeof action.payload.then === 'function' && action.meta.globalError) {
    return next(action).catch(() => {
      message.error(action.meta.globalError);
    });
  }
  return next(action);
};
