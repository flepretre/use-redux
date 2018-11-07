import React, { memo, useContext, useEffect, useState } from 'react';
import Context from './context';

export const useRedux = () => {
  const store = useContext(Context);
  const [reduxState, setReduxState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setReduxState(store.getState()));
    return () => unsubscribe();
  });

  return [reduxState, store.dispatch];
};

const obj = () => ({});
const merge = (a = {}, b = {}, c = {}) => ({ ...c, ...a, ...b });

export const connect = (
  mapStateToProps = obj,
  mapDispatchToProps = obj,
  mergeProps = merge
) => Component =>
  memo(props => {
    const [reduxState, dispatch] = useRedux();

    const stateProps = mapStateToProps(reduxState, props);
    const dispatchProps = mapDispatchToProps(dispatch, props);
    const mergedProps = mergeProps(stateProps, dispatchProps, props);

    return <Component {...mergedProps} />;
  });
