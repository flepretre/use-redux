import { useActionCreators } from '../useActionCreators';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';

jest.mock('react');
jest.mock('react-redux');

describe('useActionCreators', () => {
  const dispatch = jest.fn(x => x);
  const contextMock = {
    store: { dispatch }
  };

  beforeEach(() => {
    useContext.mockReturnValue(contextMock);
  });

  const a1Creator = () => ({ type: 'FOO' });
  const a2Creator = payload => ({ type: 'BAR', payload });
  const a3Creator = (name, id) => ({ type: 'NAMEID', name, id });

  it('should return actions', () => {
    const actions = useActionCreators(a1Creator, a2Creator);

    expect(actions.length).toBe(2);
    expect(useContext).toHaveBeenCalledWith(ReactReduxContext);

    const [a1, a2] = actions;

    a1();
    expect(dispatch).toHaveBeenCalledWith({ type: 'FOO' });

    a2('payload');
    expect(dispatch).toHaveBeenCalledWith({ type: 'BAR', payload: 'payload' });
  });

  it('shoud allow action creators with more than one parameter', () => {
    const actions = useActionCreators(a3Creator);

    const [a3] = actions;

    a3('skywalker', 1);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'NAMEID',
      name: 'skywalker',
      id: 1
    });
  });
});
