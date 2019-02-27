import { useRedux } from './useRedux';

export const useSelectors = (...selectors) =>
  useRedux(selectors).slice(0, selectors.length);
