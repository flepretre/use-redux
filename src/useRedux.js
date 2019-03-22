import React, { useContext, useEffect, useState } from 'react';
import { ReactReduxContext } from 'react-redux';

export const useRedux = (selectors, actionCreators) => {
  const { store } = useContext(ReactReduxContext);
  const { getState, dispatch, subscribe } = store;
  const withSelectors = selectors && selectors.length;
  const reduxState = getState();

  let values;
  let actions;

  if (withSelectors) {
    values = selectors.map(selector => selector(reduxState));
  }

  if (actionCreators && actionCreators.length) {
    actions = actionCreators.map(actionCreator => params =>
      dispatch(actionCreator(params))
    );
  }

  const [state, setState] = useState(values || reduxState);

  const updateState = () => {
    const newReduxState = getState();

    if (withSelectors) {
      let hasChanged = false;
      const newValues = [];

      for (let i = 0; i < selectors.length; i++) {
        newValues.push(selectors[i](newReduxState));
        hasChanged |= newValues[i] !== values[i];
      }

      if (hasChanged) {
        // Only rerender if selected values have changed
        setState(newValues);
      }
    } else {
      setState(newReduxState);
    }
  };

  useEffect(() => subscribe(updateState), []);

  return [].concat(state, actions || dispatch);
};
