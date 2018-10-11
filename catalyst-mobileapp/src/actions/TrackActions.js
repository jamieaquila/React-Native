import { AsyncStorage } from 'react-native';
import StreamingKit from 'react-native-streamingkit';

// config
import { app, api } from '../config'

// actions
import { findOwn as findOwnActivities } from '../actions/ActivityActions'
import { find as findLeaders } from '../actions/LeaderActions'
import { findMe } from '../actions/UserActions'
import { show as showNotification } from '../actions/NotificationActions'

// helpers 
import { parseTemplate } from '../helpers'

export function getTracks() {
  return {
    type: 'GET_TRACKS',
    request: {
      url: api.baseURL + '/Tracks?sort=plays+DESC&where=' + encodeURIComponent('{"app":"' + app.id + '"}'),
    }
  }
}

export function like(trackId) {
	var action =  (dispatch, getState) => {
		const appId = app.id

		dispatch({
			type: 'TRACK_LIKE',
			appId,
			trackId,
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
				url: api.baseURL + '/Apps/'+ app.id + '/Tracks/' + trackId + '/Likes',
				method: 'post'
			}

			fetch(request.url, {...defaults, ...request})
			.then(res => { 
				if (res.ok) {
					res.json()
					.then(data => {
						const { activity } = data;

						dispatch({ type: 'TRACK_LIKE_SUCCESS', appId, trackId, data, isLoading: false })
						dispatch(showNotification(parseTemplate(activity.type.message, { activity })));
						dispatch(findLeaders())
						dispatch(findMe())
					})
				} else if (res.status === 401) {
					dispatch({ type: 'TRACK_LIKE_FAILURE', appId, trackId, isLoading: false })
					dispatch({ type: 'AUTH_UNAUTHORIZED', lastAction: action });
				} else {
					console.log(res.err)
					dispatch({ type: 'TRACK_LIKE_FAILURE', appId, trackId, isLoading: false })
				}
			})
			.catch(error => {
				dispatch({ type: 'TRACK_LIKE_FAILURE', appId, trackId, isLoading: false })
				console.log(error);

				return false;
			});

		});
	}

	return action;
}

export function dislike(trackId) {
	const appId = app.id;

	return (dispatch, getState) => {
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
				url: api.baseURL + '/Apps/' + appId + '/Tracks/' + trackId + '/Likes',
				method: 'delete'
			}

			fetch(request.url, {...defaults, ...request})
			.then(res => { 
				if (!res.ok) return false;

				dispatch(findLeaders())
				dispatch(findMe())
				dispatch({ type: 'TRACK_DISLIKE_SUCCESS', appId, trackId, isLoading: false })

			})
			.catch(error => {
				dispatch({ type: 'TRACK_DISLIKE_FAILURE', appId, trackId, isLoading: false })
				console.log(error);

				return false;
			});

		});
	}

}