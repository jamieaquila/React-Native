import { api, app } from '../config';
import { AsyncStorage } from 'react-native'

export function destroy(authStrategy) {

	return (dispatch, getState) => {

		return new Promise ((resolve, reject) => {
			const requestDisconnectAuth = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': (getState().auth) ? 'Bearer ' + getState().auth.accessToken : ''
				},
				url: api.baseURL + '/Me/AuthStrategies/' + authStrategy.id,
				method: 'put'
			};

			fetch(requestDisconnectAuth.url, requestDisconnectAuth)
				.then(() => {
					dispatch({type: 'AUTH_STRATEGY_DESTROY_SUCCESS', authStrategy: authStrategy});

					const requestMe = {
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'Authorization': (getState().auth) ? 'Bearer ' + getState().auth.accessToken : ''
						},
						url: api.baseURL + '/Apps/' + app.id + '/Me?populate=' + encodeURIComponent('[{"attributeName":"authStrategies","params":{"where":{"app":"' + app.id + '"}}},{"attributeName":"trackLikes"},{"attributeName":"feedItemLikes"},{"attributeName":"feedItemReshares"}]'),
						method: 'get'
					};
					fetch(requestMe.url, requestMe)
						.then(res => res.json())
						.then(responseJson => {
							var hasConnectedStrategy = responseJson.authStrategies.find(strategy => strategy.status === 'connected');
							if (hasConnectedStrategy) {
								dispatch({ type: 'USER_GET_ME_SUCCESS', data: responseJson });
							}
							resolve({ logout: !hasConnectedStrategy });
						})
						.catch(reject)
				})
				.catch(err => {
					console.log('** Failing here', err);
					reject(err)
				});
		});
	};
}

// export function deleteOwn(id) {
// 	return (dispatch, getState) => {

// 		dispatch({ type: 'AUTH_STRATEGY_DELETE' })

// 		const request = {
// 			headers: {
// 				'Accept': 'application/json',
// 				'Content-Type': 'application/json',
// 				'Authorization': (getState().auth) ? 'Bearer ' + getState().auth.accessToken : ''
// 			},
// 			url: api.baseURL + '/Me/AuthStrategies/' + id,
// 			method: 'delete'
// 		}

// 		fetch(request.url, request)
// 		.then(res => {
// 			if (res.ok) {
// 				var auth = {
// 					...getState().auth,
// 					authStrategies: getState().auth.authStrategies.filter(authStrategy => (authStrategy.id !== id))
// 				}

// 				AsyncStorage.setItem('auth', JSON.stringify(auth))
// 				.then(authString => dispatch({ id, type: 'AUTH_STRATEGY_DELETE_SUCCESS' }))
// 			} else {
// 				dispatch({ id, type: 'AUTH_STRATEGY_DELETE_FAILURE' })
// 			}
// 		})
// 		.catch(error => {
// 			dispatch({ id, type: 'AUTH_STRATEGY_DELETE_FAILURE' });
// 			console.log(error);
// 		});
// 	}
// }