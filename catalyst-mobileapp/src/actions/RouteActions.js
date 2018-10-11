import { routes } from '../config'

export function push(navigator, route) {
	return (dispatch, getState) => {
		navigator.push(route);
		dispatch({
			type: 'ROUTER_PUSH',
			navigator: navigator,
			targetRoute: route
		});
	}
}

export function pop(navigator) {
	return (dispatch, getState) => {
		navigator.pop();
		dispatch({
			type: 'ROUTER_POP',
			navigator: navigator
		});
	}
}

export function replace(routePath) {
	if (routes[routePath]) {
		return {
			type: 'ROUTE_REPLACE',
			targetRoute: routes[routePath]
		};	
	} else {
		return {
			type: 'ROUTE_NOT_FOUND'
		};
	}
}

export function changeTab(tabIndex) {
	return {
		type: 'ROUTE_CHANGE_TAB',
		tabIndex: tabIndex
	};	
}

export function pushModal(routePath) {
	if (routes[routePath]) {
		return {
			type: 'ROUTE_PUSH_MODAL',
			targetRoute: routes[routePath]
		};	
	} else {
		return {
			type: 'ROUTE_NOT_FOUND'
		};
	}

}

export function replaceWithRoute(targetRoute) {
	return {
		type: 'ROUTE_REPLACE',
		targetRoute
	}
}

export function pushRouteAtTabIndex(tabIndex, route) {
	return {
		type: 'ROUTE_PUSH_ROUTE_AT_TABINDEX',
		tabIndex,
		route
	}
}

export function firstRouteAtTabIndex(tabIndex) {
	return {
		type: 'ROUTE_FRIST_ROUTE_AT_TABINDEX',
		tabIndex
	}
}

export function clearNextRoute() {
	return {
		type: 'CLEAR_NEXT_ROUTE'
	}
}

export function replaceRouteStackAtTabIndex(tabIndex, routeStack) {
	return {
		type: 'ROUTE_REPLACE_ROUTE_STACK_AT_TABINDEX',
		tabIndex,
		routeStack
	}
}

export function clearNextRouteStackToReplace() {
	return {
		type: 'CLEAR_NEXT_ROUTE_STACK_TO_REPLACE'
	}
}