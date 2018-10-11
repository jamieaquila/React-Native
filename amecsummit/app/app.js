import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducers from './reducers';

import firebase from 'firebase';
import { FIREBASE_CONFIG } from './config';
import Routes from './routes';

import SplashScreen from 'react-native-smart-splash-screen'

let store = createStore(reducers);

class App extends Component {
  componentWillMount() {

    firebase.initializeApp(FIREBASE_CONFIG);

    SplashScreen.close({
      animationType: SplashScreen.animationType.scale,
      duration: 850,
      delay: 2000,
    })
  }

  render() {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    )
  }
}

export default App;
