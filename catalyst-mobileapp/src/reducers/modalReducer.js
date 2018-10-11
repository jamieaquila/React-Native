import { Navigator } from 'react-native-deprecated-custom-components'

const defaultState = {
	targetRoute: null,
	configureScene: (route, routeStack) => Navigator.SceneConfigs.FloatFromBottom,
	shouldPop: false
};

export default function modalReducer(state = defaultState, action) {
	switch(action.type) {
		case 'MODAL_PUSH':
			var { targetRoute, configureScene } = action;

			return {
				...state,
				targetRoute,
				configureScene: configureScene || defaultState.configureScene
			}
		case 'MODAL_PUSH_SUCCESS':
			return {
				...state,
				targetRoute: null
			}
		case 'MODAL_POP':
			var { targetRoute, shouldPop } = action;

			return {
				...state,
				targetRoute,
				shouldPop
			}
		case 'MODAL_POP_SUCCESS':
			var { shouldPop } = action;

			return {
				...state,
				shouldPop
			}
		default:
			return state;
	}
}
