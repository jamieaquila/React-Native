import request from './requestMiddleware';
import socketRequest from './socketRequestMiddleware';
import thunk from 'redux-thunk';

export default [ request, socketRequest, thunk ];