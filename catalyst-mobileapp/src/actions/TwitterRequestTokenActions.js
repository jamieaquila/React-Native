import { app, api } from '../config'

export function getTwitterRequestToken(redirect) {
	return {
		type: 'GET_TWITTER_REQUEST_TOKEN',
		request: {
			url: api.baseURL + '/Apps/' + app.id + '/TwitterRequestTokens?callback='+ api.baseURL + '/SocialNetworkCallback/Twitter?redirect=' + redirect,
			method: 'post'
		}
	}
}