const defaultState = {
	id: null,
	name: null,
	settings: {},
	geoFilterObject:[],
	styles: {
		primaryColor: "#5CADFF",
		primaryLightColor: "#b7DBFF",
		primaryDarkColor: "#284c70"
	},
	statusBarVisible: true
};

export default function navigatorReducer(state = defaultState, action) {
	switch(action.type) {
		case 'APP_GET_APP_SUCCESS':
			return {
				...state,
				...action.data,
				styles: action.data.styles || defaultState.styles
			}
		break;
		case 'SHOW_STATUS_BAR':
			return {
				...state,
				statusBarVisible: true
			};
		break;
		case 'HIDE_STATUS_BAR':
			return {
				...state,
				statusBarVisible: false
			};
		break;
		case 'GET_GEOFILTERS_SUCCESS':
		// console.log('the data is',action.data)
		return {
			...state,
			geoFilterObject:action.data,
		}
		default:
			return state;
	}
}
