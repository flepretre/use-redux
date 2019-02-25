import { useActionCreators } from '../useActionCreators';
import { useRedux } from '../useRedux';

jest.mock('../useRedux', () => ({
  useRedux: jest.fn((seletors, creators) => [
    'state',
    ...creators.map(creator => `action ${creator}`)
  ])
}));

jest.unmock('../useActionCreators');

describe('useActionCreators', () => {
  it('should return actions', () => {
    const actions = useActionCreators(1, 2);

    expect(actions).toEqual(['action 1', 'action 2']);
    expect(useRedux).toHaveBeenCalledWith(undefined, [1, 2]);
  });
});
