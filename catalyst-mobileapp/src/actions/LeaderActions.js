import { app, api } from '../config'

export function find() {
	return {
		type: 'LEADER_FIND',
		request: {
			url: api.baseURL + '/Apps/' + app.id + '/Leaders'
		}
	}
}

export function findMe(userId) {
	return {
		type: 'LEADER_FIND_ME',
		request: {
			url: api.baseURL + '/Apps/' + app.id + '/Leaders/' + userId
		}
	}
}