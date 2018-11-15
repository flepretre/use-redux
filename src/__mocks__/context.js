const getState = jest.fn(() => 'reduxState');
const dispatch = jest.fn();
const subscribe = jest.fn(() => unsubscribe)
const unsubscribe = jest.fn()

export default { getState, dispatch, subscribe, unsubscribe };
