const defaultState = {
	item: null,
	isLoading: false
};

export default function pushNotificationTokenReducer(state = defaultState, action) {
	switch(action.type) {
		case 'PUSH_NOTIFICATION_TOKEN_CREATE':
			return {
				...state,
				isLoading: true
			}
		case 'PUSH_NOTIFICATION_TOKEN_CREATE_SUCCESS':
			return {
				...state,
				item: action.data,
				isLoading: false
			}
		default:
			return state;
	}
}