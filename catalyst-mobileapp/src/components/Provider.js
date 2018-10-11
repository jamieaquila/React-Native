import React from 'react'

import { Provider } from 'react-redux';
import createStore from '../store/createStore';

import Loading from './Loading';

const store = createStore();

export default class extends React.Component {

  render() {
    return (
      <Provider store={store}>
          <Loading />
      </Provider>
    );
  }

}
