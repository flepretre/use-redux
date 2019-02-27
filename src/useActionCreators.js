import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';

export const useActionCreators = (...actionCreators) => {
  const { store } = useContext(ReactReduxContext);
  const { dispatch } = store;

  return actionCreators.map(actionCreator => params =>
    dispatch(actionCreator(params))
  );
};
