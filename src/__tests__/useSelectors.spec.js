import { useRedux } from '../useRedux';
import { useSelectors } from '../useSelectors';

jest.mock('../useRedux', () => ({
  useRedux: jest.fn(selectors => [
    ...selectors.map(select => select({ foo: 'bar', bar: 'foo bar' })),
    'dispatch'
  ])
}));
jest.unmock('../useSelectors');

describe('useSelectors', () => {
  it('should return selected values', () => {
    const s1 = ({ foo }) => foo;
    const s2 = ({ bar }) => bar;

    const selectedValues = useSelectors(s1, s2);
    expect(selectedValues).toEqual(['bar', 'foo bar']);
    expect(useRedux).toHaveBeenCalledWith([s1, s2]);
  });
});
