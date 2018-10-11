const defaultState = {	
	lightshowDetail: undefined
};

export default function lightshowTriggerReducer(state = defaultState, action) {
    switch(action.type) {		
		case 'LIGHTSHOW_USER':
		case 'LIGHTSHOW_TREGGER_GET_DETAIL':
			return {
				...state,
				isLoading: true
			}	
			
		case 'LIGHTSHOW_USER_FAILURE':	
			return { 
				...state, 
				isLoading: false, 
				isRefreshing: false 
			}			
		case 'LIGHTSHOW_TREGGER_GET_DETAIL_FAILURE':	
			return { 
				...state, 
				isLoading: false, 
				isRefreshing: false 
			}		
		case 'LIGHTSHOW_TREGGER_GET_DETAIL_SUCCESS':
			console.log(action.data)
			return {
				...state,
				lightshowDetail: action.data,
				isLoading: false,
                isRefreshing: false	
			}
		case 'LIGHTSHOW_USER_SUCCESS':
			return {
				...state,
				isLoading: false,
				isRefreshing: false			
			}
		case 'INITIALIZE_LIGHTSHOW_TREGGER':
			return {
				...state,
				lightshowDetail: undefined,
				isLoading: false,
				isRefreshing: false			
			}
		default:
			return state;
	}
}