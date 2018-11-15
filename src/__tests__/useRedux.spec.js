import React, { memo, useContext, useEffect, useState } from 'react';
import Context from '../context';
import { useRedux, connect } from '../useRedux';

jest.mock('../context');
jest.mock('react');

describe('useRedux', () => {

  describe('useRedux function', () => {
    let state;
    let dispatch;
    beforeEach(() => {
      [state, dispatch] = useRedux();
    });

    it('should provide state and dispatch', () => {
      expect(useState).toHaveBeenCalledWith('reduxState');
      expect(state).toBe('reduxState');
      expect(dispatch).toBe(Context.dispatch);
    });

    it('should subscribe to the store', () => {
      expect(Context.subscribe).not.toBeCalled();

      const effectCleanUps = useEffect.runEffects();

      expect(Context.subscribe).toBeCalled();
    });

    it('should subscribe to the store', () => {
      expect(Context.unsubscribe).not.toBeCalled();

      const effectCleanUps = useEffect.runEffects();
      effectCleanUps.forEach(cleanUp => cleanUp());

      expect(Context.unsubscribe).toBeCalled();
    });
  });
});
