import { api } from '../config'

export function getApp(appId) {
	return {
		type: 'APP_GET_APP',
		request: {
			url: api.baseURL + '/Apps/' + appId,
		}
	}
}

export function getGeoFilters(appId) {
	return {
		type: 'GET_GEOFILTERS',
		request: {
			url: api.baseURL + '/Apps/' + appId + '/GeoFilter',
		}
	}
}