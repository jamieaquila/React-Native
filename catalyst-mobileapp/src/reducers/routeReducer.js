import { routes } from '../config'

const defaultState = {
	currentRoute: routes['/Feeds'],
	nextRouteToPush: false,
	nextRouteStack: false,
	firstRouteToPush: false
};

export default function routeReducer(state = defaultState, action) {
	switch(action.type) {
		case 'ROUTER_PUSH':
			return {
				...state,
				index: state.index + 1,
				currentRoute: action.targetRoute
			};
			break;
		case 'ROUTER_POP':
			return {
				...state,
				index: state.index - 1
			};
			break;
		case 'ROUTE_REPLACE':
			return {
				...state,
				currentRoute: action.targetRoute
			}
			break;
		case 'ROUTE_CHANGE_TAB':
			return {
				...state,
				currentRoute: { 
					tabIndex: action.tabIndex,
					routeStack: state.currentRoute.routeStack
				}
			}
			break;
		case 'ROUTE_GOTO_ROUTE':
			return {
				...state,
				currentRoute: action.targetRoute
			}
			break;
		case 'ROUTE_PUSH_ROUTE_AT_TABINDEX':
			return {
				...state,
				nextRouteToPush: {
					tabIndex: action.tabIndex,
					route: action.route
				}
			}
			break;
		case 'ROUTE_FRIST_ROUTE_AT_TABINDEX':
			return {
				...state,
				firstRouteToPush: {
					tabIndex: action.tabIndex
				}
			}
			break;
		case 'ROUTE_REPLACE_ROUTE_STACK_AT_TABINDEX':
			return {
				...state,
				nextRouteStackToReplace: {
					tabIndex: action.tabIndex,
					routeStack: action.routeStack
				}
			}
			break;
		case 'CLEAR_NEXT_ROUTE':
			return {
				...state,
				nextRouteToPush: defaultState.nextRouteToPush
			}
			break;
		case 'CLEAR_NEXT_ROUTE_STACK_TO_REPLACE':
			return {
				...state,
				nextRouteStackToReplace: defaultState.nextRouteStackToReplace
			}
			break;
		default:
			return state;
	}
}
