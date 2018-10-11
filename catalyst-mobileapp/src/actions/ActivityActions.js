import { app, api } from '../config'

export function findOwn() {
	return {
		type: 'ACTIVITY_GET_OWN',
		request: {
			url: api.baseURL + '/Apps/' + app.id + '/Me/Activities?sort=createdAt+DESC&populate=' + encodeURIComponent('[{"attributeName":"feedItem"},{"attributeName":"type"}]'),
		}
	}
}
