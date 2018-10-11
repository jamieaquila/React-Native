import { app, api } from '../config'

export function announce() {
	console.log("MessageActions:", "announce");
	return {
		type: 'SIO_MESSAGE_ANNOUNCE',
		socketRequest: {
			url: '/Apps/' + app.id + '/SocketMessages/announce',
			body: {}
		}
	}
}

export function updateLocation(location) {
	return {
		type: 'SIO_MESSAGE_UPDATE_LOCATION',
		socketRequest: {
			url: '/Apps/'+ app.id + '/SocketMessages/updateLocation',
			body: {
				'latitude': location.lat ? location.lat : 0.000000,
				'longitude': location.long? location.long : 0.000000 
			}
		}
	}
}

export function startLightshow(lightshowdetailsId) {
	return {
		type: 'SIO_MESSAGE_START_LIGHTSHOW',
		socketRequest: {
			url: '/Apps/'+ app.id + '/SocketMessages/startLightshow',
			body: {
				'lightshowdetails': lightshowdetailsId
			}
		}
	}
}

export function stopLightshow(lightshowdetailsId) {
	return {
		type: 'SIO_MESSAGE_STOP_LIGHTSHOW',
		socketRequest: {
			url: '/Apps/'+ app.id + '/SocketMessages/stopLightshow',
			body: {
				'lightshowdetails': lightshowdetailsId
			}
		}
	}
}

export function initStopLightshow(){
	var action = (dispatch, getState) => {		
		dispatch({ 
			type: 'INIT_STOP_LIGHTSHOW', 
			data: undefined
		});		
	}
	return action;
}

export function initStartLightshow(){
	var action = (dispatch, getState) => {		
		dispatch({ 
			type: 'INIT_START_LIGHTSHOW', 
			data: undefined
		});		
	}
	return action;
}

export function stopLightshowWithoutCallApi(lightshowId){
	var action = (dispatch, getState) => {		
		dispatch({ 
			type: 'STOP_LIGHTSHOW_WITHOUT_CALL_API', 
			data: lightshowId
		});		
	}
	return action;
}

export function setCurrentPage(page){
	var action = (dispatch, getState) => {		
		dispatch({ 
			type: 'SET_CURRENT_PAGE', 
			data: page 
		});		
	}
	return action;
}


export function startedLightshowUser(){
	var action = (dispatch, getState) => {		
		dispatch({ 
			type: 'STARTED_USER_LIGHTSHOW', 
			data: null 
		});		
	}
	return action;
}

export function endedLightshowUser(){
	var action = (dispatch, getState) => {		
		dispatch({ 
			type: 'END_USER_LIGHTSHOW', 
			data: null 
		});		
	}
	return action;
}