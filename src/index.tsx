import * as React from "react";
import ReactDOM from "react-dom";
import Main from './components/containers/Main/index';

// redux:
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import reducer from './reducers';

import CSSapp from './components/CSSanimus/index';

const store = createStore(reducer, composeWithDevTools());

ReactDOM.render(
  <Provider store={store}>
    <CSSapp />
  </Provider>, 
  document.getElementById("root")
);
