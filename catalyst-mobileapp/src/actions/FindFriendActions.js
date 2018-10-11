import { AsyncStorage, Alert } from 'react-native';
import { app, api } from '../config'
import albumReducer from '../reducers/albumReducer';
import connectActionSheet from '@expo/react-native-action-sheet/connectActionSheet';


export function getMyLocation(long, lat) {
	var action = (dispatch, getState) => {
		const coords = {
			longitude: Number(long),
			latitude: Number(lat),
		};
		dispatch({ 
			type: 'FIND_MY_LOCATION', 
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
					url: api.baseURL + '/Apps/' + app.id + '/LocationCheckin',
					method: 'post',
					body: JSON.stringify(coords)
				};			
			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {					
					 res.json()
					.then(data => {
						console.log(data)
						dispatch({type:'FIND_MY_LOCATION_SUCCESS', data})
						
					}).catch(error => {
						console.log(error)
						dispatch({type:'FIND_MY_LOCATION_FAILURE', isLoading: false})	
						return false;
					});
				} else if (res.status === 400) {
					const err = JSON.parse(res._bodyText);
					Alert.alert("Uh Oh", err.message)
					dispatch({type:'FIND_MY_LOCATION_FAILURE', isLoading: false})
				} else {
					console.log(res)
					// alert('not working 2')
					// Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					dispatch({type:'FIND_MY_LOCATION_FAILURE', isLoading: false})
				}
			})
			.catch(error => {
				console.log(error)
				dispatch({type:'FIND_MY_LOCATION_FAILURE', isLoading: false})
				// alert("error :" + JSON.stringify(error));
				return false;
			});

		});
	}

	return action;
}


export function getMyFriendsLocation() {
	var action = (dispatch, getState) => {
		dispatch({ 
			type: 'FIND_MY_FRIENDS_LOCATION', 
			isLoading: true  
		});
		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);
			// alert(auth.accessToken)
			const 
			  defaults = {
			    headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': auth ? 'Bearer ' + auth.accessToken : ''
				}
			  },
			  request = {
				url: api.baseURL + '/Apps/' + app.id + '/LocationCheckin',
				method: 'get',
			  };		
			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {
					 res.json()
					.then(data => {
						// alert(JSON.stringify(data))
						dispatch({type:'FIND_MY_FRIENDS_LOCATION_SUCCESS', data})
						// if (data.album !== null && data.album === getState().redemptionCode.albumToRedeem) {
						// 	dispatch({ type: 'REDEMPTION_CODE_PURCHASE_SUCCESS', data });
						// 	dispatch(popModal());
						// 	dispatch(getTracks());
						// 	dispatch(getAlbums());
						// } else {
						// 	Alert.alert("Whoops!", "The code you redeemed seems to be for a different album.");
						// 	dispatch({ type: 'REDEMPTION_CODE_PURCHASE_FAILURE' });
						// }
					}).catch(error => {
						dispatch({type:'FIND_MY_FRIENDS_LOCATION_FAILURE', isLoading: false})
						console.log(error);
						return false;
					});
				} else if (res.status === 400) {
					const err = JSON.parse(res._bodyText);
					// Alert.alert("Uh Oh", err.message)
					// dispatch({ type: 'REDEMPTION_CODE_PURCHASE_FAILURE' });
					dispatch({type:'FIND_MY_FRIENDS_LOCATION_FAILURE', isLoading: false})
				} else {
					// alert('not working 2')
					// Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					// dispatch({ type: 'REDEMPTION_CODE_PURCHASE_FAILURE' });
					dispatch({type:'FIND_MY_FRIENDS_LOCATION_FAILURE', isLoading: false})
				}
			})
			.catch(error => {
				dispatch({type:'FIND_MY_FRIENDS_LOCATION_FAILURE', isLoading: false})
				console.log(error);
				return false;
			});

		});
	}

	return action;
}