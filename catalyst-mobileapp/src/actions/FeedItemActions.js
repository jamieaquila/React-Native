import { AsyncStorage } from 'react-native';
import { api, app } from '../config'

import { parseTemplate } from '../helpers'

import { show as showNotification } from '../actions/NotificationActions'
import { find as findLeaders } from '../actions/LeaderActions';
import { findMe } from '../actions/UserActions';

export function like(feedItemId) {
	var action = (dispatch, getState) => {
		const appId = app.id;

		dispatch({
			type: 'FEED_ITEM_LIKE',
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
				url: api.baseURL + '/Apps/'+ app.id + '/FeedItems/' + feedItemId + '/Likes',
				method: 'post'
			}

			fetch(request.url, {...defaults, ...request})
			.then(res => { 
				if (res.ok) {
					res.json()
					.then(data => {
						const { activity } = data;
						dispatch({ type: 'FEED_ITEM_LIKE_SUCCESS', appId, feedItemId, data, isLoading: false })
						dispatch(showNotification(parseTemplate(activity.type.message, { activity })));
						dispatch(findLeaders())
						dispatch(findMe())
					})
				} else if (res.status === 401) {
					dispatch({ type: 'FEED_ITEM_LIKE_FAILURE', appId, feedItemId, isLoading: false })
					dispatch({ type: 'AUTH_UNAUTHORIZED', lastAction: action });
				} else if (res.status === 403) {
					res.json()
						.then(data => {
							const { platform } = data;
							dispatch({ type: 'FEED_ITEM_LIKE_FAILURE', appId, feedItemId, isLoading: false })
							dispatch({ type: 'AUTH_UNAUTHORIZED', platform: platform, lastAction: action });
						})
				} else  {
					console.log(res.err);
					dispatch({ type: 'FEED_ITEM_LIKE_FAILURE', appId, feedItemId, isLoading: false })
				}
			})
			.catch(error => {
				dispatch({ type: 'FEED_ITEM_LIKE_FAILURE', appId, feedItemId, isLoading: false })
				console.log(error);

				return false;
			});

		});
	}

	return action;
}

export function dislike(feedItemId) {
	const appId = app.id;

	return (dispatch, getState) => {
		dispatch({
			type: 'FEED_ITEM_DISLIKE',
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
				url: api.baseURL + '/Apps/' + appId + '/FeedItems/' + feedItemId + '/Likes',
				method: 'delete'
			}

			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if(res.ok) {
					dispatch(findLeaders())
					dispatch(findMe())
					dispatch({type: 'FEED_ITEM_DISLIKE_SUCCESS', appId, feedItemId, isLoading: false})
				} else {
					dispatch({ type: 'FEED_ITEM_DISLIKE_FAILURE', appId, feedItemId, isLoading: false })
				}
			})
			.catch(error => {
				dispatch({ type: 'FEED_ITEM_DISLIKE_FAILURE', appId, feedItemId, isLoading: false })
				console.log(error);

				return false;
			});

		});
	}

}

export function findComment(targetFeedItem) {
	var action = (dispatch, getState) => {
		const appId    = app.id;
		const feedItemId = targetFeedItem.id;

		dispatch({
			type: 'FEED_ITEM_FETCH_COMMENT',
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
					url: api.baseURL + '/Apps/'+ app.id + '/FeedItems/' + feedItemId + '/Comments',
					method: 'get'
				}

				fetch(request.url, {...defaults, ...request})
					.then(res => {
						if (res.ok) {
							res.json()
								.then(data => {
									dispatch({ type: 'FEED_ITEM_FETCH_COMMENT_SUCCESS', appId, targetFeedItem, data, isLoading: false })
									dispatch(findLeaders())
									dispatch(findMe())

								})
						} else if (res.status === 401) {
							dispatch({ type: 'FEED_ITEM_COMMENT_POST_FAILURE', appId, feedItemId, isLoading: false })
							dispatch({ type: 'AUTH_UNAUTHORIZED', lastAction: action });
						} else if (res.status === 403) {
							res.json()
								.then(data => {
									const { platform } = data;
									dispatch({ type: 'FEED_ITEM_COMMENT_POST_FAILURE', appId, feedItemId, isLoading: false })
									dispatch({ type: 'AUTH_UNAUTHORIZED', platform: platform, lastAction: action });
								})
						} else  {
							dispatch({ type: 'FEED_ITEM_COMMENT_POST_FAILURE', appId, feedItemId, isLoading: false })
						}
					})
					.catch(error => {
						dispatch({ type: 'FEED_ITEM_COMMENT_POST_FAILURE', appId, feedItemId, isLoading: false })
						return false;
					});

			});
	}

	return action;
}

export function createComment(feedItem, message) {
	var action = (dispatch, getState) => {
		const appId    = app.id;
		const feedItemId = feedItem.id;

		dispatch({
			type: 'FEED_ITEM_COMMENT_POST',
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
					url: api.baseURL + '/Apps/'+ app.id + '/FeedItems/' + feedItemId + '/Comments',
					method: 'post',
					body: JSON.stringify({
						message
					})

				}

				fetch(request.url, {...defaults, ...request})
					.then(res => {
						if (res.ok) {
							res.json()
								.then(data => {
									const { activity } = data;
									dispatch({ type: 'FEED_ITEM_COMMENT_POST_SUCCESS', appId, feedItemId, data, isLoading: false })
									dispatch(findComment(feedItem));
									if(activity) dispatch(showNotification(parseTemplate(activity.type.message, { activity })));

								})
						} else if (res.status === 401) {
							dispatch({ type: 'FEED_ITEM_COMMENT_POST_FAILURE', appId, feedItemId, isLoading: false })
							dispatch({ type: 'AUTH_UNAUTHORIZED', lastAction: action });
						} else if (res.status === 403) {
							res.json()
								.then(data => {
									const { platform } = data;
									dispatch({ type: 'FEED_ITEM_COMMENT_POST_FAILURE', appId, feedItemId, isLoading: false })
									dispatch({ type: 'AUTH_UNAUTHORIZED', platform: platform, lastAction: action });
								})
						} else  {
							dispatch({ type: 'FEED_ITEM_COMMENT_POST_FAILURE', appId, feedItemId, isLoading: false })
						}
					})
					.catch(error => {
						dispatch({ type: 'FEED_ITEM_COMMENT_POST_FAILURE', appId, feedItemId, isLoading: false })
						return false;
					});

			});
	}

	return action;
}