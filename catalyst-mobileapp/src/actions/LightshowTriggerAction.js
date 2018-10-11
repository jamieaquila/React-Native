import { AsyncStorage, Alert } from 'react-native';
import { app, api } from '../config'


export function getLightshowDetail(id){
	return {
		type: 'LIGHTSHOW_TREGGER_GET_DETAIL',
		request : {
			url : api.baseURL + '/LightshowDetails/' + id
		}
	}
}

export function setLightshowUser(body){
	var action = (dispatch, getState) => {		
		dispatch({ 
			type: 'LIGHTSHOW_USER', 
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
					url: api.baseURL + '/LightshowUser',
					method: 'put',
					body: JSON.stringify(body)
				};			
			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {		
					res.json()
					.then(data => {
						// console.log(data)
						
						dispatch({type:'LIGHTSHOW_USER_SUCCESS', data})						
					}).catch(error => {
						// alert("first : " + JSON.stringify(error))
						dispatch({type:'LIGHTSHOW_USER_FAILURE', isLoading: false})	
						return false;
					});
				} else if (res.status === 400) {
					const err = JSON.parse(res._bodyText);
					Alert.alert("Uh Oh", err.message)
					dispatch({type:'LIGHTSHOW_USER_FAILURE', isLoading: false})
				} else {
					alert(JSON.stringify(res))
					// Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					dispatch({type:'LIGHTSHOW_USER_FAILURE', isLoading: false})
				}
			})
			.catch(error => {
                console.log("last error :" + JSON.stringify(error))
				dispatch({type:'LIGHTSHOW_USER_FAILURE', isLoading: false})
				return false;
			});

		});
	}

	return action;
}

export function initializeData(){
	var action = (dispatch, getState) => {	
		dispatch({ 
			type: 'INITIALIZE_LIGHTSHOW_TREGGER', 
			data: undefined
		});				
	}
	return action;
}