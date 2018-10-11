import { jwtDecode } from '../helpers';

const defaultState = {
	accessToken: null,
	refreshToken: null,
	userId: null,
	role: null,
	needsAuth: false,
	lastAction: null,
	isLoading: false
};

export default function authReducer(state = defaultState, action) {
	switch(action.type) {
		case 'AUTH_AUTH':
				return {
					...state,
					isLoading: true
				}
		case 'AUTH_UNAUTHORIZED':
			const { lastAction, platform } = action;

			return {
				...state,
				needsAuth: true,
				lastAction: lastAction,
				isLoading: false,
				platform: platform
			}
		case 'AUTH_SUCCESS':
			var jwtPayload = jwtDecode(action.auth.accessToken);

			return {
				...state,
				accessToken: action.auth.accessToken,
				refreshToken: action.auth.refreshToken || null,
				userId: jwtPayload.userId || null,
				role: jwtPayload.role || null,
				needsAuth: false,
				lastAction: {},
				isLoading: false,
			}
		case 'AUTH_LOGOUT':
			return defaultState;
		default:
			return state;
	}
}
