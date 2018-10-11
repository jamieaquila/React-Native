const defaultState = {
	item: null,
	isLoading: false
};

export default function deviceReducer(state = defaultState, action) {
	switch(action.type) {
		case 'DEVICE_CREATE':
			return {
				...state,
				isLoading: true
			}
		case 'DEVICE_CREATE_FAILURE':
			return {
				...state,
				isLoading: false
			}
		case 'DEVICE_STORE':
			return {
				...state,
				item: action.data,
				isLoading: false
			}
		default:
			return state;
		break;
	}
}