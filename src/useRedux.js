import React, { useContext, useEffect, useState } from 'react';
import { ReactReduxContext } from 'react-redux';

export const useRedux = (selectors, actionCreators) => {
  const { store } = useContext(ReactReduxContext);
  const { getState, dispatch, subscribe } = store;
  const [reduxState, setReduxState] = useState(getState());

  useEffect(() => {
    const unsubscribe = subscribe(() => setReduxState(getState()));
    return () => unsubscribe();
  }, []);

  let values;
  let actions;

  if (selectors && selectors.length) {
    values = selectors.map(selector => selector(reduxState));
  }

  if (actionCreators && actionCreators.length) {
    actions = actionCreators.map(actionCreator => params =>
      dispatch(actionCreator(params))
    );
  }

  return [].concat(values || reduxState, actions || dispatch);
};
