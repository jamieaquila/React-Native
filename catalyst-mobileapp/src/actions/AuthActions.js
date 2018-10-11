import { api, app } from '../config';
import { AsyncStorage, Linking, Platform } from 'react-native'
import * as Keychain from 'react-native-keychain';
import DeviceInfo from 'react-native-device-info';
import jwtDecode from 'jwt-decode';

import { findOwn as findOwnActivities } from './ActivityActions'
import { setStyle as setStatusBarStyle } from './StatusBarActions'
import { findMe } from './UserActions'
import { getTracks } from './TrackActions'
import { getAlbums } from './AlbumActions'
import { pause } from './MusicPlayerActions'
import { getGeoFilters } from '../actions/AppActions'
import { app as appConfig } from '../config'
import { announce } from '../actions/MessageActions'

import SafariView from 'react-native-safari-view';

export function auth(credential) {

	return (dispatch, getState) => {

		dispatch({ type: 'AUTH_AUTH' });
		var lastAction = getState().auth.lastAction;

		(
			new Promise((resolve, reject) => {

				if (Platform.OS === 'ios') {
					Keychain.getGenericPassword('device')
						.then(creds => creds.username)
						.then(deviceString => JSON.parse(deviceString))
						.then(resolve)
						.catch(reject);
				} else {
					resolve({ uuid: DeviceInfo.getUniqueID() })
				}

			})
		)
		.then(device => {
			AsyncStorage.getItem('auth')
			.then(authString => authString ? JSON.parse(authString) : {})
			.then(auth => {
				var hasAuth = auth && auth.accessToken;
				var authHasExpired = hasAuth ? jwtDecode(auth.accessToken)['exp'] * 1000 < Date.now() : true;				
				var body = credential;

				if (!auth.refreshToken) {
					body.includeRefreshToken = true;
					body.deviceUuid = device.uuid;
				}

				const request = {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					url: api.baseURL + '/Apps/' + app.id + '/Auth',
					method: 'post',
					body: JSON.stringify(body)
				};
				
				// If user is logged in then use the authenticated route
				if (hasAuth && !authHasExpired) {
					request.headers.Authorization = 'Bearer ' + auth.accessToken;
					request.url = api.baseURL + '/Apps/' + app.id + '/AuthStrategy';
				}

				console.log(JSON.stringify(request));

				fetch(request.url, request)
				.then(response => {
					if (response.ok) {

						if (hasAuth && !authHasExpired) {
							dispatch(findMe());
							dispatch(findOwnActivities());
							dispatch(authFromStorage());
							dispatch(getTracks());
							dispatch(getAlbums());
							dispatch(getGeoFilters(appConfig.id))
							//dispatch(announce());

							if (lastAction && typeof lastAction === 'function') dispatch(lastAction);
						} else {
							response
								.json()
								.then(authStrategy => {
									_persistAuth(authStrategy)
										.then(() => dispatch({ type: 'AUTH_SUCCESS', auth: authStrategy }))
										.then(() => {
											dispatch(findMe());
											dispatch(findOwnActivities());
											dispatch(getTracks());
											dispatch(getAlbums());
											dispatch(getGeoFilters(appConfig.id))
											//dispatch(announce());
											if (lastAction && typeof lastAction === 'function') dispatch(lastAction);
										})
										.catch(console.error);
								})
								.catch(console.error);
						}

					} else {
						dispatch({ type: 'AUTH_FAILURE' });
					}
				})
				.catch(error => dispatch({ type: 'AUTH_ERROR' }))
			})
		});
	}
}

export const refreshAuthStrategy = (id) => (dispatch, getState) => {
	dispatch({ type: 'AUTH_REFESH_ACCESS_TOKEN' });

	const request = {
		url: `${api.baseURL}/Me/AuthStrategies/${id}/refresh`,
		method: 'POST'
	}

	const defaults = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': (getState().auth) ? 'Bearer ' + getState().auth.accessToken : ''
		}
	}
	
	fetch(request.url, {...defaults, ...request })
		.then(res => {
			if(res.ok) {
				dispatch(findMe());
			}
		})
}

export function unauthorized(lastAction, platform) {
	return {
		type: 'AUTH_UNAUTHORIZED',
		platform: platform || null,
		lastAction: lastAction
	}
}

export function authFromStorage() {
	return (dispatch, getState) => {
		AsyncStorage.getItem('auth').then(authString => {
			if (!authString) return false;
			
			var auth = JSON.parse(authString);
			dispatch({ type: 'AUTH_SUCCESS', auth });
			dispatch(findMe());

			
			
		})
	}
}

export function logout() {
	return (dispatch, getState) => {
		AsyncStorage.removeItem('auth').then(authString => {
			dispatch({ type: 'AUTH_LOGOUT' });
			dispatch(getTracks());
			dispatch(getAlbums());
			dispatch(pause());
		});
	}
}

export function connectTwitter(redirect) {
	return (dispatch, getState) => {

		dispatch({ type: 'GET_TWITTER_REQUEST_TOKEN' });

		const request = {
			url: api.baseURL + '/Apps/' + app.id + '/TwitterRequestTokens?callback='+ api.baseURL + '/SocialNetworkCallback/Twitter?redirect=' + redirect,
			method: 'post'
		}

		const defaults = {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': (getState().auth) ? 'Bearer ' + getState().auth.accessToken : ''
			}
		}

		return fetch(request.url, {...defaults, ...request })
		.then(res => {
			if (res.ok) {
				return res.json().then(data => {
					var url = 'https://api.twitter.com/oauth/authorize?oauth_token=' + data.requestToken;

					SafariView.isAvailable()
					.then(() => {
						SafariView.show({ url, fromBottom: true });
						SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
						SafariView.addEventListener("onDismiss", () => dispatch(setStatusBarStyle('light-content')));
					})
					.catch(() => Linking.openURL(url));
				});
			}
		});

	}
}

export function connectFacebook(redirect, facebookSettings) {
	return (dispatch, getState) => {
		var url = 'https://www.facebook.com/dialog/oauth?scope=public_profile,email,publish_actions,user_friends&client_id=' + facebookSettings.appId + '&redirect_uri=' + redirect;

		SafariView.isAvailable()
		.then(() => {
			SafariView.show({ url, fromBottom: true });
			SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
			SafariView.addEventListener("onDismiss", () => dispatch(setStatusBarStyle('light-content')));
		})
		.catch(() => Linking.openURL(url));
	}
}

export const connectSpotify = (redirect, spotifySettings) => dispatch => {
	var scopes = 'streaming user-read-private user-top-read user-read-email playlist-modify-public';
	const url = 'https://accounts.spotify.com/authorize'
		+ `?client_id=${spotifySettings.clientId}`
		+ '&response_type=code'
		+ `&scope=${encodeURIComponent(scopes)}`
		+ `&redirect_uri=${redirect}`;

		SafariView.isAvailable()
			.then(() => {
				SafariView.show({ url, fromBottom: true });
				SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
				SafariView.addEventListener("onDismiss", () => dispatch(setStatusBarStyle('light-content')));
			})
			.catch(() => Linking.openURL(url));
}

export function connectInstagram(redirect, instagramSettings) {
	return (dispatch, getState) => {
		var url = 'https://api.instagram.com/oauth/authorize/?client_id=' + instagramSettings.clientId + '&redirect_uri=' + encodeURIComponent(redirect) + '&response_type=code';
		SafariView.isAvailable()
		.then(() => {
			SafariView.show({ url, fromBottom: true });
			SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
			SafariView.addEventListener("onDismiss", () => dispatch(setStatusBarStyle('light-content')));
		})
		.catch(() => Linking.openURL(url));
	}
}


export function connectGoogle(redirect, googleSettings, state) {
	return (dispatch, getState) => {
		var url = "https://accounts.google.com/o/oauth2/auth?client_id=" + googleSettings.clientId + "&scope=https://www.googleapis.com/auth/youtube.force-ssl+https://www.googleapis.com/auth/plus.me+https://www.googleapis.com/auth/plus.profile.emails.read+https://www.googleapis.com/auth/plus.login&response_type=code&redirect_uri=" + redirect + "&state=" + state + "&access_type=offline";

		SafariView.isAvailable()
		.then(() => {
			SafariView.show({ url, fromBottom: true });
			SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
			SafariView.addEventListener("onDismiss", () => dispatch(setStatusBarStyle('light-content')));
		})
		.catch(error => Linking.openURL(url));

		return false;
	}
}

export function connectYoutube(redirect, youtubeSettings, state) {
	return (dispatch, getState) => {
		var url = "https://accounts.google.com/o/oauth2/auth?client_id=" + youtubeSettings.clientId + "&scope=https://www.googleapis.com/auth/youtube.force-ssl+https://www.googleapis.com/auth/plus.me&response_type=code&redirect_uri=" + redirect + "&state=" + state + "&access_type=offline";

		SafariView.isAvailable()
		.then(() => {
			SafariView.show({ url, fromBottom: true });
			SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
			SafariView.addEventListener("onDismiss", () => dispatch(setStatusBarStyle('light-content')));
		})
		.catch(error => Linking.openURL(url));

		return false;
	}
}

export function _persistAuth(auth) {
	return AsyncStorage.setItem('auth', JSON.stringify(auth));
}
