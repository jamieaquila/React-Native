const defaultState = {
	data: [],
	isLoading: false,
	nextAction: false
}

export default function trackReducer(state = defaultState, action) {
	switch(action.type) {
		case 'GET_TRACKS':
			return { 
				...state,
				isLoading: true
			};

		case 'GET_TRACKS_SUCCESS':
			return { 
				data: action.data,
				isLoading: false
			};
		case 'TRACK_DISLIKE':
		case 'TRACK_LIKE':
		case 'TRACK_LIKE_SUCCESS':
		case 'TRACK_LIKE_FAILURE':
		case 'TRACK_DISLIKE_SUCCESS':
		case 'TRACK_DISLIKE_FAILURE':
			return { 
				...state,
				isLoading: action.isLoading
			};
		default:
			return state;
	}
}
