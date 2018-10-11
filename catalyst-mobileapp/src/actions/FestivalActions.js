import { AsyncStorage, Alert } from 'react-native';
import { app, api } from '../config'

export function getFestivalArtist() {
	return {
		type: 'GET_FESTIVAL_ARTISTS',
		request: {
			url: api.baseURL + '/Apps/' + app.id + '/FestivalArtist'
		}
	}
}

export function createFestivalArtistFavorite(body){
	return {
		type: 'CREATE_FESTIVAL_ARTIST_FAVORITE',
		request: {
			url: api.baseURL + '/FestivalArtistFavorite',
			method: 'put',
			body: JSON.stringify(body)
		}
	}
}

export function updateFestivalArtistFavorite(id, body){
	return {
		type: 'UPDATE_FESTIVAL_ARTIST_FAVORITE',
		request: {
			url: api.baseURL + '/FestivalArtistFavorite/' + id,
			method: 'post',
			body: JSON.stringify(body)
		}
	}
}

export function getFestivalArtistSetTime(id){
	return {
		type: 'GET_FESTIVAL_ARTIST_SETTIME',
		request: {
			url: api.baseURL + '/FestivalArtistSetTime?where={"festivalArtistId":' + id + '}'
		}
	}
}

export function createFestivalArtistSetTime(body){
	return {
		type: 'CREATE_FESTIVAL_ARTIST_SETTIME',
		request: {
			url: api.baseURL + '/FestivalArtistSetTime',
			method: 'put',
			body: JSON.stringify(body)
		}
	}
}

export function updateFestivalArtistSetTime(id, body){
	return {
		type: 'UPDATE_FESTIVAL_ARTIST_SETTIME',
		request: {
			url: api.baseURL + '/FestivalArtistSetTime/' + id,
			method: 'post',
			body: JSON.stringify(body)
		}
	}
}

export function createFestivalUserSchedule(body){
	return {
		type: 'CREATE_FESTIVAL_USER_SCHEDULE',
		request: {
			url: api.baseURL + '/FestivalUserSchedule',
			method: 'put',
			body: JSON.stringify(body)
		}
	}
}

export function updateFestivalUserSchedule(id, body){
	return {
		type: 'UPDATE_FESTIVAL_USER_SCHEDULE',
		request: {
			url: api.baseURL + '/FestivalUserSchedule/' + id,
			method: 'post',
			body: JSON.stringify(body)
		}
	}
}
