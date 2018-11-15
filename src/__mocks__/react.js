export const memo = jest.fn(x => x);
export const useContext = jest.fn(x => x);

const states = [];
export const useState = jest.fn(defaultValue => {
  states.push(defaultValue);
  const index = states.length -1;

  return [defaultValue, jest.fn(value => states[index] = value)];
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
