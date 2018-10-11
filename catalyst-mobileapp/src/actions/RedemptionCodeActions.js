import { AsyncStorage, Alert } from 'react-native';
import { api, app } from '../config'

import { getTracks } from '../actions/TrackActions';
import { getAlbums } from '../actions/AlbumActions';
import { pop as popModal } from '../actions/ModalActions';

export function redeem() {
	var action = (dispatch, getState) => {
		dispatch({ type: 'REDEMPTION_CODE_REDEEM' });

		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);

			const defaults = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': auth ? 'Bearer ' + auth.accessToken : ''
				}
			}

			const request = {
				url: api.baseURL + '/RedemptionCodes/' + getState().redemptionCode.code + '/Redeem',
				method: 'post',
				body: JSON.stringify({
					album: getState().redemptionCode.albumToRedeem
				})
			}

			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {
					res.json()
					.then(data => {
						if (data.album !== null && data.album === getState().redemptionCode.albumToRedeem) {
							dispatch({ type: 'REDEMPTION_CODE_REDEEM_SUCCESS', data });
							dispatch(popModal());
							dispatch(getTracks());
							dispatch(getAlbums());
						} else {
							Alert.alert("Whoops!", "The code you redeemed seems to be for a different album.");
							dispatch({ type: 'REDEMPTION_CODE_REDEEM_FAILURE' });
						}
					})
				} else if (res.status === 400) {
					Alert.alert("Whoops!", "Looks like your code has already been redeemed.");
					dispatch({ type: 'REDEMPTION_CODE_REDEEM_FAILURE' });
				} else {
					Alert.alert("Whoops!", "An error occurred, did you enter your code properly?");
					dispatch({ type: 'REDEMPTION_CODE_REDEEM_FAILURE' });
				}
			})
			.catch(error => {
				dispatch({ type: 'REDEMPTION_CODE_REDEEM_FAILURE' });
				console.log(error);

				return false;
			});

		});
	}

	return action;
}

export function purchase() {
	var action = (dispatch, getState) => {
		dispatch({ type: 'REDEMPTION_CODE_PURCHASE' });

		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);

			const defaults = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': auth ? 'Bearer ' + auth.accessToken : ''
				}
			}

			const request = {
				url: api.baseURL + '/RedemptionCodes/Purchase',
				method: 'post',
				body: JSON.stringify({
					album: getState().redemptionCode.albumToRedeem
				})
			}

			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {
					res.json()
					.then(data => {
						if (data.album !== null && data.album === getState().redemptionCode.albumToRedeem) {
							dispatch({ type: 'REDEMPTION_CODE_PURCHASE_SUCCESS', data });
							dispatch(popModal());
							dispatch(getTracks());
							dispatch(getAlbums());
						} else {
							Alert.alert("Whoops!", "The code you redeemed seems to be for a different album.");
							dispatch({ type: 'REDEMPTION_CODE_PURCHASE_FAILURE' });
						}
					})
				} else if (res.status === 400) {
					Alert.alert("Whoops!", "Looks like you have already purchased this album.");
					dispatch({ type: 'REDEMPTION_CODE_PURCHASE_FAILURE' });
				} else {
					Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					dispatch({ type: 'REDEMPTION_CODE_PURCHASE_FAILURE' });
				}
			})
			.catch(error => {
				dispatch({ type: 'REDEMPTION_CODE_PURCHASE_FAILURE' });
				console.log(error);

				return false;
			});

		});
	}

	return action;
}

export function purchaseTrack() {
	var action = (dispatch, getState) => {
		dispatch({ type: 'REDEMPTION_CODE_PURCHASE' });

		AsyncStorage.getItem('auth')
		.then(authString => {
			var auth = JSON.parse(authString);

			const defaults = {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': auth ? 'Bearer ' + auth.accessToken : ''
				}
			}

			const request = {
				url: api.baseURL + '/RedemptionCodes/PurchaseTrack',
				method: 'post',
				body: JSON.stringify({
					album: getState().redemptionCode.albumToRedeem,
					track: getState().redemptionCode.trackToRedeem,
				})
			}

			fetch(request.url, {...defaults, ...request})
			.then(res => {
				if (res.ok) {
					res.json()
					.then(data => {
						if (data.track !== null && data.track === getState().redemptionCode.trackToRedeem) {
							dispatch({ type: 'REDEMPTION_CODE_PURCHASE_SUCCESS', data });
							dispatch(popModal());
							dispatch(getTracks());
							dispatch(getAlbums());
						} else {
							Alert.alert("Whoops!", "The code you redeemed seems to be for a different track.");
							dispatch({ type: 'REDEMPTION_CODE_PURCHASE_FAILURE' });
						}
					})
				} else if (res.status === 400) {
					Alert.alert("Whoops!", "Looks like you have already purchased this track.");
					dispatch({ type: 'REDEMPTION_CODE_PURCHASE_FAILURE' });
				} else {
					Alert.alert("Whoops!", "An error occurred while purchasing the product. Please try again.");
					dispatch({ type: 'REDEMPTION_CODE_PURCHASE_FAILURE' });
				}
			})
			.catch(error => {
				dispatch({ type: 'REDEMPTION_CODE_PURCHASE_FAILURE' });
				console.log(error);

				return false;
			});

		});
	}

	return action;
}

export function modalDismissed() {
	return {
		type: 'REDEMPTION_CODE_MODAL_DISMISSED'
	}
};

export function setCode(code) {
	return {
		type: 'REDEMPTION_CODE_SET_CODE',
		code
	}
};

export function setAlbumToRedeem(album) {
	return {
		type: 'REDEMPTION_CODE_SET_ALBUM_TO_REDEEM',
		album
	}
}

export function setTrackToRedeem(track) {
	return {
		type: 'REDEMPTION_CODE_SET_TRACK_TO_REDEEM',
		track
	}
}
