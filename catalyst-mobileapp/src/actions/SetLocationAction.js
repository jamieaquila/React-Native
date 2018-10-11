import { AsyncStorage, Alert } from 'react-native';
import { app, api } from '../config'
import connectActionSheet from '@expo/react-native-action-sheet/connectActionSheet';
import albumReducer from '../reducers/albumReducer';

export function setLocation(body) {
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
					url: api.baseURL + '/Apps/' + app.id + '/AppLocation',
					method: 'put',
					body: JSON.stringify(body)
				};			
			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {					
					 res.json()
					.then(data => {
						// alert(JSON.stringify(data))
						dispatch({type:'SET_LOCATION_SUCCESS', data})						
					}).catch(error => {
						alert("first : " + JSON.stringify(error))
						dispatch({type:'SET_LOCATION_FAILURE', isLoading: false})	
						return false;
					});
				} else if (res.status === 400) {
					const err = JSON.parse(res._bodyText);
					Alert.alert("Uh Oh", err.message)
					dispatch({type:'SET_LOCATION_FAILURE', isLoading: false})
				} else {
					// alert(JSON.stringify(res))
					// alert('not working 2')
					// Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					dispatch({type:'SET_LOCATION_FAILURE', isLoading: false})
				}
			})
			.catch(error => {
                // alert("last error :" + JSON.stringify(error))
				dispatch({type:'SET_LOCATION_FAILURE', isLoading: false})
				// alert("error :" + JSON.stringify(error));
				return false;
			});

		});
	}

	return action;
}

export function setLocaiontInit(){
	var action = (dispatch, getState) => {		
		dispatch({ 
			type: 'SET_LOCATION_INIT', 
			isLoading: false 
		});		
	}
	return action;
}
