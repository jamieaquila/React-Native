import { app, api } from '../config'

export function findOneMessageThread(messageThreadId) {
	console.log("findMessageThread "+messageThreadId);
	return {
		type: 'NOTIF_FIND_MESSAGE',
		request: {
			url: api.baseURL + '/Apps/' + app.id + '/MessageThreads/'+ messageThreadId
		}
	}
}


export function findOneFeedItem(feedItemId) {
	console.log("findOneFeedItem "+feedItemId);
	return {
		type: 'NOTIF_FIND_FEEDITEM',
		request: {
			url: api.baseURL + '/Apps/' + app.id + '/FeedItems/'+ feedItemId
		}
	}
}

export function startLightshow() {
	return {	type: 'NOTIF_LIGHTSHOW' }
}
export function clearMessage() {
	return { type: 'NOTIF_CLEAR_MESSAGE' }
}

export function clearFeedItem() {
	return { type: 'NOTIF_CLEAR_FEEDITEM' }
}

export function clearLightshow() {
	return { type: 'NOTIF_CLEAR_LIGHTSHOW' }
}
