import { combineReducers } from 'redux';

import speakers from './speakers';
import agenda from './agenda';

const appReducer = combineReducers({
  speakers,
  agenda
});

export default (state, action) => {
    return appReducer(state, action)
}
