import { app, api } from '../config'

export function getMenus() {
	return {
		type: 'TOUR_GET_MENUS',
		request: {
			url: api.baseURL + '/Apps/' + app.id + '/Menus'
		}
	}
}