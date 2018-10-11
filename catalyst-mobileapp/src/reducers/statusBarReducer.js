const defaultState = {
	style: 'light-content',
	hidden: false
}

export default function statusBarReducer(state = defaultState, action) {
	switch(action.type) {
		case 'STATUS_BAR_SHOW':
		case 'STATUS_BAR_HIDE':
			return {
				...state,
				hidden: action.hidden
			}
		case 'STATUS_BAR_SET_STYLE':
			return {
				...state,
				style: action.style || defaultState.style
			}
		default:
			return state;
	}

}