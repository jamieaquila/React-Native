import { app, api } from '../config'

export function getFeeds() {
	return {
		type: 'FEED_GET_FEEDS',
		request: {
			url: api.baseURL + '/Apps/' + app.id + '/Feeds'
		}
	}
}

export function getFeed(feedId) {
	return {
		type: 'FEED_GET_FEED',
		feedId,
		request: {
			url: api.baseURL + '/Feeds/' + feedId
		}
	}
}

export function appendFeedItems(feedId) {
	return (dispatch, getState) => {
		var lastItem = getState().feed.items.find(feed => feed.id === feedId).feedItems.slice(-1).pop();
		if (!lastItem) return;

		dispatch({
			type: 'FEED_APPEND_FEED_ITEMS',
			feedId,
			request: {
				url: api.baseURL + '/Feeds/' + feedId + '?feedItemCriteria=' + encodeURIComponent('{"createdAt":{"<": "'+ new Date(lastItem.createdAt).toISOString() +'"},"limit": 8,"sort":"createdAt DESC"}')
			}
		});
	}
}

export function startRefreshing() {
	return {
		type: 'FEED_START_REFRESHING'
	}
}