
const defaultState = {
	items: [],
	isLoading: false,
	isRefreshing: false
};

export default function tourReducer(state = defaultState, action) {

	switch(action.type) {		
		case 'TOUR_GET_MENUS':
			return {
				...state,
				isLoading: true
			}
		case 'TOUR_GET_MENUS_SUCCESS':
			return {
				...state,
				items: action.data,
				isLoading: false,
				isRefreshing: false
			}
		case 'TOUR_GET_MENUS_FAILURE':
			return { 
				...state, 
				isLoading: false, 
				isRefreshing: false 
			}
		default:
			return state;
	}
}