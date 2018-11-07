# use-redux

React-redux with new react hooks

## install

```sh
yarn add use-redux
```

## usage

You can use `use-redux` the same way you use `react-redux`.

First, surround your top component with the `ReduxProvider` and provide a redux store through the `store` prop.
```jsx
import { createStore } from 'redux';
import { ReduxProvider } from 'use-redux';

// redux store
const store = createStore(reducers)

ReactDOM.render(
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>,
  document.getElementById('root')
);
```

Then you can connect any of you component.

```jsx
import { connect } from 'use-redux';

const Count = ({ value, onClick }) => (
  <div>
    {value}
    <button onClick={onClick}>
      +1
    </button>
  </div>
);

const mapStateToProps = state => ({ value: state.value });
const mapDispatchToProps = dispatch => ({ onClick: () => dispatch({ type: 'INCREMENT' }) });

export default connect(mapStateToProps, mapDispatchToProps)(Count);
```
