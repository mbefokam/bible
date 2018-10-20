/** @format */
import React from 'react';
import {AppRegistry} from 'react-native';

import {Provider} from 'react-redux';
import {createStore, compose, applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise';;
import promise from 'redux-promise-middleware';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import App from './App';
import rootReducer from './reducers';
import {name as appName} from './app.json';

//const createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(createStore)




const store = createStore(rootReducer,applyMiddleware(promise(),thunk,logger));
//const store = createStore(rootReducer);
const appRedux = () =>(
  <Provider store={store}>
    <App/>
  </Provider>
)

AppRegistry.registerComponent(appName, () => appRedux);
