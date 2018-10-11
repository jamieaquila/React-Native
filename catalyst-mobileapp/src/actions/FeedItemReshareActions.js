import { AsyncStorage } from 'react-native';
import { api, app } from '../config'
import { parseTemplate } from '../helpers'

import { show as showNotification } from '../actions/NotificationActions'
import { find as findLeaders } from '../actions/LeaderActions';
import { findMe } from '../actions/UserActions';

export function create(feedItemId) {
	var action = (dispatch, getState) => {
		const appId = app.id;

		dispatch({
			type: 'FEED_ITEM_RESHARE_CREATE',
			appId,
			feedItemId,
			isLoading: true
		});

		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);

			const defaults = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': (auth) ? 'Bearer ' + auth.accessToken : ''
				}
			}

			const request = {
				url: api.baseURL + '/Apps/'+ app.id + '/FeedItems/' + feedItemId + '/Reshares',
				method: 'post'
			}

			fetch(request.url, {...defaults, ...request})
			.then(res => { 
				if (res.ok) {
					res.json()
					.then(data => {
						const { activity } = data;

						dispatch({ type: 'FEED_ITEM_RESHARE_CREATE_SUCCESS', appId, feedItemId, data, isLoading: false })
						dispatch(showNotification(parseTemplate(activity.type.message, { activity })));
						dispatch(findLeaders())
						dispatch(findMe())
					})
				} else if (res.status === 401) {
					dispatch({ type: 'FEED_ITEM_RESHARE_CREATE_FAILURE', appId, feedItemId, isLoading: false })
					dispatch({ type: 'AUTH_UNAUTHORIZED', lastAction: action });
				} else {
					console.log(res.err)
					dispatch({ type: 'FEED_ITEM_RESHARE_CREATE_FAILURE', appId, feedItemId, isLoading: false })
				}
			})
			.catch(error => {
				dispatch({ type: 'FEED_ITEM_RESHARE_CREATE_FAILURE', appId, feedItemId, isLoading: false })
				console.log(error);

				return false;
			});

		});
	}

	return action;
}

export function destroy(feedItemId) {
	const appId = app.id;

	return (dispatch, getState) => {
		dispatch({
			type: 'FEED_ITEM_RESHARE_DESTROY',
			appId,
			feedItemId,
			isLoading: true
		});


		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);

			const defaults = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': (auth) ? 'Bearer ' + auth.accessToken : ''
				}
			}

			const request = {
				url: api.baseURL + '/Apps/' + appId + '/FeedItems/' + feedItemId + '/Reshares',
				method: 'delete'
			}

			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if(res.ok) {
					dispatch(findLeaders())
					dispatch(findMe())
					dispatch({type: 'FEED_ITEM_RESHARE_DESTROY_SUCCESS', appId, feedItemId, isLoading: false})
				} else {
					dispatch({ type: 'FEED_ITEM_RESHARE_DESTROY_FAILURE', appId, feedItemId, isLoading: false })
				}
			})
			.catch(error => {
				dispatch({ type: 'FEED_ITEM_RESHARE_DESTROY_FAILURE', appId, feedItemId, isLoading: false })
				console.log(error);

				return false;
			});

		});
	}
}