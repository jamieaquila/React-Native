import { routes } from '../config';
import { show as showStatusBar, hide as hideStatusBar, setStyle as setStatusBarStyle } from './StatusBarActions';

export function push(targetRoute, configureScene = null, statusBarState = { hidden: true, style: null }) {
	const { hidden, style } = statusBarState;

	return (dispatch, getState) => {
		dispatch({
			type: 'MODAL_PUSH',
			targetRoute,
			configureScene,
		});

		hidden && dispatch(hideStatusBar());
		dispatch(setStatusBarStyle(style));
	}
}

export function pushSuccess() {
	return { type: 'MODAL_PUSH_SUCCESS' };
}

export function pop() {
	return (dispatch, getState) => {
		dispatch({ 
			type: 'MODAL_POP',
			shouldPop: true,
			targetRoute: null
		});
	}
}

export function popSuccess() {
	return (dispatch, getState) => {
		dispatch({
			type: 'MODAL_POP_SUCCESS',
			shouldPop: false
		});
		dispatch(showStatusBar());
		dispatch(setStatusBarStyle());
	};
}
