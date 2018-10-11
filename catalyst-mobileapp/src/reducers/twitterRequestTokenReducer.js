const defaultState = {
	requestToken: null,
	screenName: null,
	isLoading: false
}

export default function twitterRequestTokenReducer(state = defaultState, action) {
	switch(action.type) {
		case 'GET_TWITTER_REQUEST_TOKEN':
			return { 
				...state,
				isLoading: true
			};
			break;
		case 'SAVE_TWITTER_REQUEST_TOKEN_SCREEN_NAME':
			return {
				...state,
				screenName: action.screenName
			}
			break;
		case 'GET_TWITTER_REQUEST_TOKEN_SUCCESS':
			return { 
				...state,
				requestToken: action.data.requestToken,
				isLoading: false
			};
			break;
		default:
			return state;
	}
}
