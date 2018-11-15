export const memo = jest.fn(x => x);
export const useContext = jest.fn(x => x);

const states = [];
export const useState = jest.fn(defaultValue => {
  states.push(defaultValue);
  return [defaultValue, jest.fn(value => states[states.length -1] = value)];
});

const effects = [];
export const useEffect = jest.fn(effect => {
  effects.push(effect);
});
useEffect.runEffects = () =>
  effects.map(effect => effect());


export default {
  createContext: jest.fn(),
}
