import { app, api } from '../config'

export function findOwn() {
	return (dispatch, getState) => {
		var { currentUser } = getState().user;

		dispatch({
			type: 'MESSAGE_THREAD_FIND_OWN',
			request: {
				url: api.baseURL + '/Apps/' + app.id + '/Me/MessageThreads'
			}
		});
	}
}

export function findOneOwn(messageThreadId) {
	return {
		type: 'MESSAGE_THREAD_FIND_ONE_OWN',
		request: {
			url: api.baseURL + '/Apps/' + app.id + '/Me/MessageThreads/' + messageThreadId
		}
	}
}

export function startRefreshing() {
	return {
		type: 'MESSAGE_THREAD_START_REFRESHING'
	}
}