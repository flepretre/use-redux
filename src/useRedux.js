import React, { useContext, useEffect, useState } from 'react';
import { ReactReduxContext } from 'react-redux';

export const useRedux = () => {
  const { store } = useContext(ReactReduxContext);
  const [reduxState, setReduxState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setReduxState(store.getState()));
    return () => unsubscribe();
  }, []);

  return [reduxState, store.dispatch];
};
