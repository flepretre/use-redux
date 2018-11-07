import React from 'react';
import Context from './context';

export const ReduxProvider = ({ store, children }) => (
  <Context.Provider value={store}>{children}</Context.Provider>
);
