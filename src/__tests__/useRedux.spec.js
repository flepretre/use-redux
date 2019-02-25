import { useRedux } from '../useRedux';
import { useState, useEffect, useContext } from 'react';
import { ReactReduxContext } from 'react-redux';

jest.mock('react');
jest.mock('react-redux');

describe('useRedux', () => {
  let state;

  const setState = jest.fn(value => {
    state = value;
  });

  const useStateMock = defaultValue => {
    if (!state && state !== 0) {
      state = defaultValue;
    }

    return [state, setState];
  };

  const useEffectMock = callback => {
    const cleanUp = callback();

    if (typeof cleanUp === 'function') {
      cleanUp();
    }
  };

  const getState = jest.fn();
  const dispatch = jest.fn();
  const unSubscribe = jest.fn();
  const subscribeMock = callback => callback() || unSubscribe;
  const subscribe = jest.fn(subscribeMock);

  const contextMock = {
    store: { getState, dispatch, subscribe }
  };

  beforeEach(() => {
    state = undefined;
    useState.mockImplementation(useStateMock);
    useEffect.mockImplementation(useEffectMock);
    useContext.mockReturnValue(contextMock);
    getState.mockReturnValue('redux state');
  });

  it('should return the current state and dispatch function', () => {
    const [state, dispatch] = useRedux();

    expect(useContext).toHaveBeenCalledWith(ReactReduxContext);
    expect(getState).toHaveBeenCalled();
    expect(useState).toHaveBeenCalledWith('redux state');

    expect(state).toBe('redux state');
    expect(dispatch).toBe(dispatch);
  });

  it('should subscribe to the store', () => {
    useRedux();

    expect(useEffect).toHaveBeenCalled();
    expect(subscribe).toHaveBeenCalled();
    expect(setState).toHaveBeenCalledWith('redux state');
  });

  it('should unsubscribe to the store', () => {
    useRedux();

    expect(useEffect).toHaveBeenCalled();
    expect(unSubscribe).toHaveBeenCalled();
  });
});
