import { api, app } from '../config'

export function findMe() {
	return {
		type: 'USER_GET_ME',
		request: {
			url: api.baseURL + '/Apps/' + app.id + '/Me?populate=' + encodeURIComponent('[{"attributeName":"authStrategies","params":{"where":{"app":"' + app.id + '"}}},{"attributeName":"trackLikes"},{"attributeName":"feedItemLikes"},{"attributeName":"feedItemReshares"}]'),
		}
	}
}

export function deleteAuthStrategy() {
	
}

export function disconnectTwitter() {
	return {
		type: 'USER_DISCONNECT_TWITTER',
		request: {
			url: api.baseURL + '/User'
		}
	}
}