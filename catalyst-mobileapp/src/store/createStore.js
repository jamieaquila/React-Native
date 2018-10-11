import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import reducers     from '../reducers';
import middlewares   from '../middlewares';

export default function createStore(initialState) {
	return applyMiddleware(...middlewares)(_createStore)(reducers, initialState);
}
