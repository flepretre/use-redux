# use-redux

Hook to access redux

## Getting started

### Install

```sh
yarn add use-redux
```

### use-redux
You can get the redux state and the dispatch function with `useRedux` custom hooks.

```jsx
import { useEffect } from 'react';
import { useRedux } from 'use-redux';

export const Clock = props => {
  const [ state, dispatch ] = useRedux();
  
  useEffect(() => {
    const timeout = setTimeout(
      () => dispatch({ type: 'SET', count: state.count + 1 }),
      1000,
    );
    
    return () => clearTimeout(timeout);
  }, []);

  return state.count;
};
```

This way you can read the redux state in the `state` variable, and dispatch redux action with the `dispatch` function.

If you don't have a Provider from `react-redux` in your app see the [Provider section](#provider-react-redux) below.

### with selectors and action creators

Because your component should not access to the whole state and and the dispatch function, you can pass selectors and action creators to useRedux like that:

```jsx
import { useRedux } from 'use-redux';

// Some selectors
const v1Selector = state => state.value1;
const v2Selector = state => state.value2;

// Some action creators
const a1Creator = () => ({ type: 'FOO' });
const a2Creator = payload => ({ type: 'BAR', payload });

export const MyComponent = props => {
  const [ v1, v2, a1, a2 ] = useRedux([v1Selector, v2Selector], [a1Creator, a2Creator]);
  // v1 and v2 contains values selected in the redux state
  // a1 et a2 are function that dispatch redux actions define in creators
  
  // render stuff
};
```

See documentation for redux [action creators](https://redux.js.org/glossary#action-creator) and [selectors](https://react-redux.js.org/using-react-redux/connect-mapstate#use-selector-functions-to-extract-and-transform-data).

### useSelectors

If you don't need to fire actions, you can just use useSelectors hook:

```jsx
import { useSelectors } from 'use-redux';

// Some selectors
const v1Selector = state => state.value1;
const v2Selector = state => state.value2;

export const MyComponent = props => {
  const [ v1, v2 ] = useSelectors(v1Selector, v2Selector);
  // v1 and v2 contains values selected in the redux state
  
  return <div>v1: {v1} and v2: {v2}</div>;
};
```

### useActionCreators

If you don't need to read the state, you can just use useActionCreators hook:
```jsx
import { useEffect } from 'react';
import { useActionCreators } from 'use-redux';

// Some action creators
const setCreator = (payload) => ({ type: 'SET', payload });
const resetCreator = () => ({ type: 'RESET' });

// Hook that set things on mount and clear them when unmount
export const MyCustomHook = (payload) => {
  const [ set, reset ] = useActionCreators(setCreator, resetCreator);
  
  useEffect(() => {
    set(payload);
    
    return () => reset();
  }, []);
};
```

## Dependencies
### react-redux
If you're already use [redux](https://redux.js.org/) in your app, you probably use [react-redux](https://react-redux.js.org/) to bind redux to your react app.

`use-redux` uses the context of `react-redux` to access the same redux store. 

If you don't have `react-redux` you need to install it.

```sh
yarn add react-redux
```

:warning: Due to the new react context API, use-redux is only compatible with `react-redux` v6.0.0 or higher.

### Provider (react-redux)

`use-redux` exports the Provider from `react-redux`

First, surround your top component with the `Provider` and provide a [redux](https://redux.js.org/) store through the `store` prop.

```jsx
import { createStore } from 'redux';
// The provider has a slightly different name so you can easily know where it came from
import { ReduxProvider } from 'use-redux';
// Or directly from react-redux 
// import { Provider } from 'react-redux';

// redux store
const store = createStore(reducers)

ReactDOM.render(
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>,
  document.getElementById('root')
);
```

See https://react-redux.js.org/api/provider for more

### connect (react-redux)

`use-redux` exports the connect function from `react-redux`

See https://react-redux.js.org/api/connect for


