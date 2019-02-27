import { useRedux } from './useRedux';

export const useActionCreators = (...actionCreators) =>
  useRedux(undefined, actionCreators).slice(1);
