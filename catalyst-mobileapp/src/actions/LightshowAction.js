import { AsyncStorage, Alert } from 'react-native';
import { app, api } from '../config'

export function getLightshowDetailsList() {
	return {
		type: 'LIGHTSHOW_GET_DETAILS',
		request: {
			url: api.baseURL + '/Apps/' + app.id + '/LightshowDetails'
		}
	}
}

export function createLightshowLocation(body) {
	var action = (dispatch, getState) => {				
		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);	
			const 
				defaults = {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': auth ? 'Bearer ' + auth.accessToken : ''
					}
				},
				request = {
					url: api.baseURL + '/Apps/' + app.id + '/LightshowLocation',
					method: 'put',
					body: JSON.stringify(body)
				};			
			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {					
					 res.json()
					.then(data => {
						console.log(data)
						dispatch({type:'CREATE_LIGHTSHOW_LOCATION_SUCCESS', data})						
					}).catch(error => {
						// alert("first : " + JSON.stringify(error))
						dispatch({type:'CREATE_LIGHTSHOW_LOCATION_FAILURE', isLoading: false})	
						return false;
					});
				} else if (res.status === 400) {
					const err = JSON.parse(res._bodyText);
					// Alert.alert("Uh Oh", err.message)
					dispatch({type:'CREATE_LIGHTSHOW_LOCATION_FAILURE', isLoading: false})
				} else {
					alert(JSON.stringify(res))
					// Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					dispatch({type:'CREATE_LIGHTSHOW_LOCATION_FAILURE', isLoading: false})
				}
			})
			.catch(error => {
                // alert("last error :" + JSON.stringify(error))
				dispatch({type:'CREATE_LIGHTSHOW_LOCATION_FAILURE', isLoading: false})
				return false;
			});

		});
	}

	return action;
}

export function updateLightshowLocation(body) {
	var action = (dispatch, getState) => {				
		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);	
			const 
				defaults = {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': auth ? 'Bearer ' + auth.accessToken : ''
					}
				},
				request = {
					url: api.baseURL + '/LightshowLocation/' + body.id,
					method: 'post',
					body: JSON.stringify(body)
				};			
			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {					
					 res.json()
					.then(data => {
						// alert(JSON.stringify(data))
						// console.log(data)
						dispatch({type:'UPDATE_LIGHTSHOW_LOCATION_SUCCESS', data})						
					}).catch(error => {
						alert("first : " + JSON.stringify(error))
						dispatch({type:'UPDATE_LIGHTSHOW_LOCATION_FAILURE', isLoading: false})	
						return false;
					});
				} else if (res.status === 400) {
					const err = JSON.parse(res._bodyText);
					Alert.alert("Uh Oh", err.message)
					dispatch({type:'UPDATE_LIGHTSHOW_LOCATION_FAILURE', isLoading: false})
				} else {
					alert(JSON.stringify(res))
					Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					dispatch({type:'UPDATE_LIGHTSHOW_LOCATION_FAILURE', isLoading: false})
				}
			})
			.catch(error => {
                // alert("last error :" + JSON.stringify(error))
				dispatch({type:'UPDATE_LIGHTSHOW_LOCATION_FAILURE', isLoading: false})
				return false;
			});

		});
	}

	return action;
}

export function createLightshowDetail(body){
	var action = (dispatch, getState) => {				
		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);	
			const 
				defaults = {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': auth ? 'Bearer ' + auth.accessToken : ''
					}
				},
				request = {
					url: api.baseURL + '/LightshowDetails',
					method: 'put',
					body: JSON.stringify(body)
				};			
			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {	
					 res.json()
					.then(data => {
						dispatch({type:'CREATE_LIGHTSHOW_DETAIL_SUCCESS', data})						
					}).catch(error => {
						// alert("first : " + JSON.stringify(error))
						dispatch({type:'CREATE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})	
						return false;
					});
				} else if (res.status === 400) {
					const err = JSON.parse(res._bodyText);
					// Alert.alert("Uh Oh", err.message)
					dispatch({type:'CREATE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})
				} else {
					// alert(JSON.stringify(res))
					// Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					dispatch({type:'CREATE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})
				}
			})
			.catch(error => {
                // alert("last error :" + JSON.stringify(error))
				dispatch({type:'CREATE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})
				return false;
			});
	
		});
	}

	return action;
}

export function duplicateLightshowDetail(body){
	var action = (dispatch, getState) => {			
		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);	
			const 
				defaults = {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': auth ? 'Bearer ' + auth.accessToken : ''
					}
				},
				request = {
					url: api.baseURL + '/LightshowDetailsDuplicate/' + body.id,
					method: 'put',
					body: JSON.stringify(body)
				};			
			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {	
					 res.json()
					.then(data => {
						// alert(JSON.stringify(data))
						// console.log(data)
						dispatch({type:'DUPLICATE_LIGHTSHOW_DETAIL_SUCCESS', data})						
					}).catch(error => {
						// alert("first : " + JSON.stringify(error))
						dispatch({type:'DUPLICATE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})	
						return false;
					});
				} else if (res.status === 400) {
					const err = JSON.parse(res._bodyText);
					// Alert.alert("Uh Oh", err.message)
					dispatch({type:'DUPLICATE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})
				} else {
					// alert(JSON.stringify(res))
					// Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					dispatch({type:'DUPLICATE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})
				}
			})
			.catch(error => {
                // alert("last error :" + JSON.stringify(error))
				dispatch({type:'DUPLICATE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})
				return false;
			});

		});
	}

	return action;
}

export function updateLightshowDetail(body){
	var action = (dispatch, getState) => {				
		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);	
			const 
				defaults = {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': auth ? 'Bearer ' + auth.accessToken : ''
					}
				},
				request = {
					url: api.baseURL + '/LightshowDetails/' + body.id,
					method: 'post',
					body: JSON.stringify(body)
				};			
			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {	
					 res.json()
					.then(data => {
						// alert(JSON.stringify(data))
						// console.log(data)
						dispatch({type:'UPDATE_LIGHTSHOW_DETAIL_SUCCESS', data})						
					}).catch(error => {
						// alert("first : " + JSON.stringify(error))
						dispatch({type:'UPDATE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})	
						return false;
					});
				} else if (res.status === 400) {
					const err = JSON.parse(res._bodyText);
					// Alert.alert("Uh Oh", err.message)
					dispatch({type:'UPDATE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})
				} else {
					// alert(JSON.stringify(res))
					// Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					dispatch({type:'UPDATE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})
				}
			})
			.catch(error => {
                // alert("last error :" + JSON.stringify(error))
				dispatch({type:'UPDATE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})
				return false;
			});

		});
	}

	return action;
}

export function updateLightshowTitle(body){
	var action = (dispatch, getState) => {				
		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);	
			const 
				defaults = {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': auth ? 'Bearer ' + auth.accessToken : ''
					}
				},
				request = {
					url: api.baseURL + '/LightshowDetails/' + body.id,
					method: 'post',
					body: JSON.stringify(body)
				};			
			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {	
					 res.json()
					.then(data => {
						dispatch({type:'CHANGE_LIGHTSHOW_TITLE_SUCCESS', data})						
					}).catch(error => {
						dispatch({type:'CHANGE_LIGHTSHOW_TITLE_FAILURE', isLoading: false})	
						return false;
					});
				} else if (res.status === 400) {
					const err = JSON.parse(res._bodyText);
					dispatch({type:'CHANGE_LIGHTSHOW_TITLE_FAILURE', isLoading: false})
				} else {					
					dispatch({type:'CHANGE_LIGHTSHOW_TITLE_FAILURE', isLoading: false})
				}
			})
			.catch(error => {
				dispatch({type:'CHANGE_LIGHTSHOW_TITLE_FAILURE', isLoading: false})
				return false;
			});

		});
	}

	return action;
}

export function deleteLightshowDetail(id, body){
	var action = (dispatch, getState) => {			
		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);	
			const 
				defaults = {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': auth ? 'Bearer ' + auth.accessToken : ''
					}
				},
				request = {
					url: api.baseURL + '/LightshowDetails/' + id,
					method: 'post',
					body: JSON.stringify(body)
				};			
			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {					
					 res.json()
					.then(data => {
						// alert(JSON.stringify(data))
						// console.log(data)
						dispatch({type:'DELETE_LIGHTSHOW_DETAIL_SUCCESS', data})						
					}).catch(error => {
						// alert("first : " + JSON.stringify(error))
						dispatch({type:'DELETE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})	
						return false;
					});
				} else if (res.status === 400) {
					const err = JSON.parse(res._bodyText);
					// Alert.alert("Uh Oh", err.message)
					dispatch({type:'DELETE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})
				} else {
					alert(JSON.stringify(res))
					// Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					dispatch({type:'DELETE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})
				}
			})
			.catch(error => {
                // alert("last error :" + JSON.stringify(error))
				dispatch({type:'DELETE_LIGHTSHOW_DETAIL_FAILURE', isLoading: false})
				return false;
			});

		});
	}

	return action;
}

export function createLightshowColor(body) {
	var action = (dispatch, getState) => {				
		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);	
			const 
				defaults = {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': auth ? 'Bearer ' + auth.accessToken : ''
					}
				},
				request = {
					url: api.baseURL + '/LightshowColors',
					method: 'put',
					body: JSON.stringify(body)
				};			
			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {					
					 res.json()
					.then(data => {
						// alert(JSON.stringify(data))
						// console.log(data)
						dispatch({type:'CREATE_LIGHTSHOW_COLOR_SUCCESS', data})						
					}).catch(error => {
						alert("first : " + JSON.stringify(error))
						dispatch({type:'CREATE_LIGHTSHOW_COLOR_FAILURE', isLoading: false})	
						return false;
					});
				} else if (res.status === 400) {
					const err = JSON.parse(res._bodyText);
					Alert.alert("Uh Oh", err.message)
					dispatch({type:'CREATE_LIGHTSHOW_COLOR_FAILURE', isLoading: false})
				} else {
					alert(JSON.stringify(res))
					// Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					dispatch({type:'CREATE_LIGHTSHOW_COLOR_FAILURE', isLoading: false})
				}
			})
			.catch(error => {
                console.log("last error :" + JSON.stringify(error))
				dispatch({type:'CREATE_LIGHTSHOW_COLOR_FAILURE', isLoading: false})
				return false;
			});

		});
	}

	return action;
}

export function getLightshowColorsList(id){
	return {
		type: 'LIGHTSHOW_GET_COLORS',
		request: {
			url: api.baseURL + '/LightshowColors?where={"lightshowdetails":' + id + '}'
		}
	}
}

export function changeColorsOrder(colors){
	var action = (dispatch, getState) => {		
		dispatch({ type: 'CHANGE_COLORS_ORDER', data: colors });		
	}
	return action;
}

export function deleteLightshowColor(colors){	
	var action = (dispatch, getState) => {		
		dispatch({ type: 'DELETE_LIGHTSHOW_COLOR', data: colors });		
	}
	return action;
}

export function updateLightshowColors(id, body){
	var action = (dispatch, getState) => {	
		dispatch({ 
			type: 'UPDATE_LIGHTSHOW_COLORS', 
			isLoading: true 
		});			
		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);	
			const 
				defaults = {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': auth ? 'Bearer ' + auth.accessToken : ''
					}
				},
			
				request = {
					url: api.baseURL + '/LightshowColorsList/' + id,
					method: 'post',
					body: JSON.stringify(body)
				};			
			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {	
					res.json()
					.then(data => {
						// console.log('result: ', data)
						dispatch({type:'UPDATE_LIGHTSHOW_COLORS_SUCCESS', data})						
					}).catch(error => {
						alert("first : " + JSON.stringify(error))
						dispatch({type:'UPDATE_LIGHTSHOW_COLORS_FAILURE', isLoading: false})	
						return false;
					});
											
				} else if (res.status === 400) {
					const err = JSON.parse(res._bodyText);
					Alert.alert("Uh Oh", err.message)
					dispatch({type:'UPDATE_LIGHTSHOW_COLORS_FAILURE', isLoading: false})
				} else {
					alert(JSON.stringify(res))
					// Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					dispatch({type:'UPDATE_LIGHTSHOW_COLORS_FAILURE', isLoading: false})
				}
			})
			.catch(error => {
                console.log("last error :" + JSON.stringify(error))
				dispatch({type:'UPDATE_LIGHTSHOW_COLORS_FAILURE', isLoading: false})
				return false;
			});

		});
	}

	return action;
}

export function getLightshowLocation(){
	return {
		type: 'LIGHTSHOW_GET_LOCATION',
		request: {
			url: api.baseURL + '/LightshowLocation'
		}
	}
}

export function initialLightshowLocation(){
	var action = (dispatch, getState) => {		
		dispatch({ 
			type: 'INITIAL_LIGHTSHOW_LOCATION', 
			isLoading: false 
		});		
	}
	return action;
}

export function beginLightshow(body, page){
	var action = (dispatch, getState) => {			
		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);	
			const 
				defaults = {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': auth ? 'Bearer ' + auth.accessToken : ''
					}
				},
				request = {
					url: api.baseURL + '/LightshowTrigger',
					method: 'put',
					body: JSON.stringify(body)
				};			
			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {		
					res.json()
					.then(data => {
						console.log(data)	
						let realData = {
							page: page,
							data: data
						}					
						dispatch({type:'BENGIN_LIGHTSHOW_SUCCESS', realData})						
					}).catch(error => {
						// alert("first : " + JSON.stringify(error))
						dispatch({type:'BENGIN_LIGHTSHOW_FAILURE', isLoading: false})	
						return false;
					});
				} else if (res.status === 400) {
					const err = JSON.parse(res._bodyText);
					Alert.alert("Uh Oh", err.message)
					dispatch({type:'BENGIN_LIGHTSHOW_FAILURE', isLoading: false})
				} else {
					alert(JSON.stringify(res))
					// Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					dispatch({type:'BENGIN_LIGHTSHOW_FAILURE', isLoading: false})
				}
			})
			.catch(error => {
                console.log("last error :" + JSON.stringify(error))
				dispatch({type:'BENGIN_LIGHTSHOW_FAILURE', isLoading: false})
				return false;
			});

		});
	}

	return action;
}

export function endLightshow(id, body){
	var action = (dispatch, getState) => {	
		dispatch({ 
			type: 'END_LIGHTSHOW_SUCCESS', 
			data: 0
		});				
	}
	return action;
}

export function initialLightshowColor(){
	var action = (dispatch, getState) => {	
		dispatch({ 
			type: 'INITIAL_LIGHTSHOW_COLOR', 
			data: 0
		});				
	}
	return action;
}

export function saveForLater(){
	var action = (dispatch, getState) => {		
		dispatch({ 
			type: 'INITIAL_ALL_DATA', 
			data: 0 
		});		
	}
	return action;
}

export function initInvidialState(){
	var action = (dispatch, getState) => {		
		dispatch({ 
			type: 'INIT_INVIDIAL_STATE', 
			data: null
		});		
	}
	return action;
}

