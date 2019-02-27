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
  const dispatch = jest.fn(x => x);
  const unSubscribe = jest.fn();
  const subscribeMock = callback => callback() || unSubscribe;
  const subscribe = jest.fn(subscribeMock);

  const contextMock = {
    store: { getState, dispatch, subscribe }
  };

  const expectedState = {
    foo: 'bar',
    bar: 'foo bar'
  };

  beforeEach(() => {
    useState.mockImplementation(useStateMock);
    useEffect.mockImplementation(useEffectMock);
    useContext.mockReturnValue(contextMock);
    getState.mockReturnValue({ ...expectedState });
  });

  it('should return the current state and dispatch function', () => {
    const [state, dispatch] = useRedux();

    expect(useContext).toHaveBeenCalledWith(ReactReduxContext);
    expect(getState).toHaveBeenCalled();
    expect(useState).toHaveBeenCalledWith(expectedState);

    expect(state).toEqual(expectedState);
    expect(dispatch).toBe(dispatch);
  });

  it('should subscribe to the store', () => {
    useRedux();

    expect(useEffect).toHaveBeenCalled();
    expect(subscribe).toHaveBeenCalled();
    expect(setState).toHaveBeenCalledWith(expectedState);
  });

  it('should unsubscribe to the store', () => {
    useRedux();

    expect(useEffect).toHaveBeenCalled();
    expect(unSubscribe).toHaveBeenCalled();
  });

  it('should use selectors', () => {
    const getFoo = ({ foo }) => foo;
    const getBar = ({ bar }) => bar;

    const [foo, bar, dispatch] = useRedux([getFoo, getBar]);

    expect(useContext).toHaveBeenCalledWith(ReactReduxContext);
    expect(getState).toHaveBeenCalled();
    expect(useState).toHaveBeenCalledWith(expectedState);

    expect(foo).toBe('bar');
    expect(bar).toBe('foo bar');

    expect(dispatch).toBe(dispatch);
  });

  it('should use action creators', () => {
    const fooActionCreator = jest.fn(x => x);
    const barActionCreator = jest.fn(x => x);

    const [state, fooAction, barAction] = useRedux(undefined, [
      fooActionCreator,
      barActionCreator
    ]);

    expect(useContext).toHaveBeenCalledWith(ReactReduxContext);
    expect(getState).toHaveBeenCalled();
    expect(useState).toHaveBeenCalledWith(expectedState);

    expect(state).toEqual(expectedState);

    expect(fooAction('yolo')).toBe('yolo');
    expect(fooActionCreator).toHaveBeenCalledWith('yolo');
    expect(dispatch).toHaveBeenCalledWith('yolo');

    expect(barAction(2)).toBe(2);
    expect(barActionCreator).toHaveBeenCalledWith(2);
    expect(dispatch).toHaveBeenCalledWith(2);
  });

  it('should use selectors and action creators', () => {
    const getFoo = ({ foo }) => foo;
    const getBar = ({ bar }) => bar;

    const fooActionCreator = jest.fn(x => x);
    const barActionCreator = jest.fn(x => x);

    const [foo, bar, fooAction, barAction] = useRedux(
      [getFoo, getBar],
      [fooActionCreator, barActionCreator]
    );

    expect(useContext).toHaveBeenCalledWith(ReactReduxContext);
    expect(getState).toHaveBeenCalled();
    expect(useState).toHaveBeenCalledWith(expectedState);
    expect(foo).toBe('bar');
    expect(bar).toBe('foo bar');

    expect(fooAction('yolo')).toBe('yolo');
    expect(fooActionCreator).toHaveBeenCalledWith('yolo');
    expect(dispatch).toHaveBeenCalledWith('yolo');

    expect(barAction(2)).toBe(2);
    expect(barActionCreator).toHaveBeenCalledWith(2);
    expect(dispatch).toHaveBeenCalledWith(2);
  });
});
