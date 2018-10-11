const initialState = {
	items: null,
	isLoading: false,
	isRefreshing: false
};

export default function modalReducer(state = initialState, action) {
	switch(action.type) {
		case 'MESSAGE_THREAD_FIND_OWN':
			return {
				...state,
				isLoading: true
			}
		case 'MESSAGE_THREAD_FIND_OWN_SUCCESS':
			return {
				...state,
				items: action.data,
				isLoading: false,
				isRefreshing: false
			}
		case 'MESSAGE_THREAD_FIND_OWN_FAILURE':
			return {
				...state,
				isLoading: false,
				isRefreshing: false
			}
		case 'MESSAGE_THREAD_START_REFRESHING':
			return {
				...state,
				isRefreshing: true
			}
		case 'AUTH_LOGOUT':
			return initialState
		default:
			return state;
	}
}
