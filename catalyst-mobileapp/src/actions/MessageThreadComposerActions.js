import { AsyncStorage, Image } from 'react-native';
import { app, api } from '../config';

import { findOwn as findOwnMessageThreads } from './MessageThreadActions';

export function setMessage(message) {
	return {
		type: 'MESSAGE_THREAD_COMPOSER_SET_MESSAGE',
		payload: {
			message
		}
	}
}


export function created() {
	return { type: 'MESSAGE_THREAD_COMPOSER_CREATED' }
}

export function create() {
	var action = (dispatch, getState) => {
		var { messageThreadComposer } = getState();

		AsyncStorage.getItem('auth').then(authString => {
			var auth = JSON.parse(authString);

			const defaults = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'multipart/form-data',
					'Authorization': (auth) ? 'Bearer ' + auth.accessToken : ''
				}
			}

			var form = new FormData();
			form.append('data', JSON.stringify(messageThreadComposer.item));

			var request = { 
				url: api.baseURL + '/Apps/' + app.id + '/MessageThreads',
				method: 'post',
				body: form
			}

			dispatch({ type: 'MESSAGE_THREAD_COMPOSER_CREATE', isLoading: true });

			fetch(request.url, {...defaults, ...request })
			.then(res => {
				if (res.ok) {
					return res.json().then(payload => {
						dispatch({ type: 'MESSAGE_THREAD_COMPOSER_CREATE_SUCCESS', payload, isLoading: false })
						dispatch(findOwnMessageThreads());
					});
				} else if (res.status === 401) {
					dispatch({ type: 'MESSAGE_THREAD_COMPOSER_CREATE_FAILURE', lastAction: action, isLoading: false });          
					dispatch({ type: 'MESSAGE_THREAD_COMPOSER_CREATE_UNAUTHORIZED', lastAction: action, isLoading: false });          
				} else {
					dispatch({ type: 'MESSAGE_THREAD_COMPOSER_FAILURE', lastAction: action, isLoading: false });          
				}
			})
			.catch(error => {
				dispatch({ type: 'MESSAGE_THREAD_COMPOSER_CREATE_ERROR', isLoading: false });
				console.log(error);

				return false;
			});
		})
		.catch(err => console.log(err));
	}

	return action;
}

export function clear() {
	return { type: 'MESSAGE_COMPOSER_THREAD_CLEAR' }
}