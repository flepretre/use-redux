import { useRedux } from '../useRedux';
import { useState, useEffect, useContext } from 'react';
import { ReactReduxContext } from 'react-redux';

jest.mock('react');
jest.mock('react-redux');

describe('useRedux', () => {
  // Hooks mocks
  let hookState;

  const setState = jest.fn(value => {
    hookState = value;
  });

  const useStateMock = defaultValue => {
    if (!hookState && hookState !== 0) {
      hookState = defaultValue;
    }

    return [hookState, setState];
  };

  const useEffectMock = callback => {
    const cleanUp = callback();

    if (typeof cleanUp === 'function') {
      cleanUp();
    }
  };

  // React-redux mocks
  let reduxState;
  let reduxStoreListeners;
  const getState = jest.fn();
  const dispatch = jest.fn(x => x);
  const unSubscribe = jest.fn();
  const runStoreListeners = () =>
    reduxStoreListeners.forEach(listener => listener());
  const subscribeMock = listener => {
    reduxStoreListeners.push(listener);

    return unSubscribe;
  };
  const subscribe = jest.fn(subscribeMock);

  const reactReduxContext = {
    store: { getState, dispatch, subscribe }
  };

  const reduxInitialState = {
    foo: 'bar',
    bar: 'foo bar'
  };

  beforeEach(() => {
    hookState = undefined;
    reduxState = reduxInitialState;
    reduxStoreListeners = [];
    useState.mockImplementation(useStateMock);
    useEffect.mockImplementation(useEffectMock);
    useContext.mockReturnValue(reactReduxContext);
    getState.mockImplementation(() => reduxState);
  });

  [
    { desc: 'without options' },
    { desc: 'with empty options', options: {} }
  ].forEach(({ desc, options }) => {
    describe(desc, () => {
      it('should return the current state and dispatch function', () => {
        const [state, dispatch] = useRedux(undefined, undefined, options);

        expect(useContext).toHaveBeenCalledWith(ReactReduxContext);
        expect(getState).toHaveBeenCalled();
        expect(useState).toHaveBeenCalledWith(reduxInitialState);

        expect(state).toEqual(reduxInitialState);
        expect(dispatch).toBe(dispatch);
      });

      it('should subscribe to the store', () => {
        useRedux(undefined, undefined, options);

        expect(useEffect).toHaveBeenCalled();
        expect(subscribe).toHaveBeenCalled();
        expect(setState).not.toHaveBeenCalled();
      });

      it('should unsubscribe to the store', () => {
        useRedux(undefined, undefined, options);

        expect(useEffect).toHaveBeenCalled();
        expect(unSubscribe).toHaveBeenCalled();
        expect(setState).not.toHaveBeenCalled();
      });

      it('should use selectors', () => {
        const getFoo = ({ foo }) => foo;
        const getBar = ({ bar }) => bar;

        const [foo, bar, dispatch] = useRedux(
          [getFoo, getBar],
          undefined,
          options
        );

        expect(useContext).toHaveBeenCalledWith(ReactReduxContext);
        expect(getState).toHaveBeenCalled();
        expect(useState).toHaveBeenCalledWith(['bar', 'foo bar']);

        expect(foo).toBe('bar');
        expect(bar).toBe('foo bar');

        expect(dispatch).toBe(dispatch);
      });

      it('should use action creators', () => {
        const fooActionCreator = jest.fn(x => x);
        const barActionCreator = jest.fn(x => x);

        const [state, fooAction, barAction] = useRedux(
          undefined,
          [fooActionCreator, barActionCreator],
          options
        );

        expect(useContext).toHaveBeenCalledWith(ReactReduxContext);
        expect(getState).toHaveBeenCalled();
        expect(useState).toHaveBeenCalledWith(reduxInitialState);

        expect(state).toEqual(reduxInitialState);

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
          [fooActionCreator, barActionCreator],
          options
        );

        expect(useContext).toHaveBeenCalledWith(ReactReduxContext);
        expect(getState).toHaveBeenCalled();
        expect(useState).toHaveBeenCalledWith(['bar', 'foo bar']);
        expect(foo).toBe('bar');
        expect(bar).toBe('foo bar');

        expect(fooAction('yolo')).toBe('yolo');
        expect(fooActionCreator).toHaveBeenCalledWith('yolo');
        expect(dispatch).toHaveBeenCalledWith('yolo');

        expect(barAction(2)).toBe(2);
        expect(barActionCreator).toHaveBeenCalledWith(2);
        expect(dispatch).toHaveBeenCalledWith(2);
      });

      it('should not call setState if selected values stay the same', () => {
        const getFoo = ({ foo }) => foo;
        const getBar = ({ bar }) => bar;

        const [foo, bar, dispatch] = useRedux(
          [getFoo, getBar],
          undefined,
          options
        );

        expect(setState).not.toHaveBeenCalled();

        reduxState = { ...reduxState, a: 'b' };
        runStoreListeners();

        expect(setState).not.toHaveBeenCalled();
        expect(foo).toBe('bar');
        expect(bar).toBe('foo bar');

        expect(dispatch).toBe(dispatch);
      });

      it('should call setState if selected values changed', () => {
        const getFoo = ({ foo }) => foo;
        const getBar = ({ bar }) => bar;

        const [foo, bar, dispatch] = useRedux(
          [getFoo, getBar],
          undefined,
          options
        );

        expect(setState).not.toHaveBeenCalled();

        reduxState = { ...reduxState, foo: 'foo' };
        runStoreListeners();

        expect(setState).toHaveBeenCalledWith(['foo', 'foo bar']);
        expect(foo).toBe('bar');
        expect(bar).toBe('foo bar');

        expect(dispatch).toBe(dispatch);
      });
    });
  });

  describe('with areStateEqual implementation in option', () => {
    const options = { };

    beforeEach(() => {
      options.areStatesEqual = jest.fn();
    });

    it('should not call setState if areStateEqual function return true', () => {
      const getFoo = ({ foo }) => foo;
      const getBar = ({ bar }) => bar;
      options.areStatesEqual.mockReturnValue(true);

      const [foo, bar, dispatch] = useRedux([getFoo, getBar], undefined, options);

      expect(setState).not.toHaveBeenCalled();

      reduxState = { ...reduxState, foo: 'foo' };
      runStoreListeners();

      expect(setState).not.toHaveBeenCalled();
      expect(foo).toBe('bar');
      expect(bar).toBe('foo bar');

      expect(dispatch).toBe(dispatch);
    });

    it('should not call setState if selected values stay the same', () => {
      const getFoo = ({ foo }) => foo;
      const getBar = ({ bar }) => bar;
      options.areStatesEqual.mockReturnValue(false);

      const [foo, bar, dispatch] = useRedux(
        [getFoo, getBar],
        undefined,
        options
      );

      expect(setState).not.toHaveBeenCalled();

      reduxState = { ...reduxState, a: 'b' };
      runStoreListeners();

      expect(setState).not.toHaveBeenCalled();
      expect(foo).toBe('bar');
      expect(bar).toBe('foo bar');

      expect(dispatch).toBe(dispatch);
    });

    it('should call setState if selected values changed', () => {
      const getFoo = ({ foo }) => foo;
      const getBar = ({ bar }) => bar;
      options.areStatesEqual.mockReturnValue(false);

      const [foo, bar, dispatch] = useRedux(
        [getFoo, getBar],
        undefined,
        options
      );

      expect(setState).not.toHaveBeenCalled();

      reduxState = { ...reduxState, foo: 'foo' };
      runStoreListeners();

      expect(setState).toHaveBeenCalledWith(['foo', 'foo bar']);
      expect(foo).toBe('bar');
      expect(bar).toBe('foo bar');

      expect(dispatch).toBe(dispatch);
    });
  });
});
