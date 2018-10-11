import { app, api } from '../config'
import DeviceInfo from 'react-native-device-info';
import * as Keychain from 'react-native-keychain'

import { uuid } from '../helpers'
import { Platform } from 'react-native';

let internals = {
	device: {
		name:						DeviceInfo.getDeviceName(),
		type:						DeviceInfo.getDeviceId(),
		appBundleId:		DeviceInfo.getBundleId(),
		appBuildNumber:	DeviceInfo.getBuildNumber(),
		appVersion:			DeviceInfo.getVersion(),
		platform:				Platform.OS,
	},
};

export function create() {

	return (dispatch, getState) => {

		dispatch({ type: 'DEVICE_CREATE' });
		
		if (Platform.OS === 'ios') {
			Keychain
				.getGenericPassword('device')
				.then(creds => creds.username)
				.then(deviceString => JSON.parse(deviceString))
				.then(data => {

					if (!data.uuid) return Keychain.resetGenericPassword('device').then(() => dispatch(create()));

					const device = internals.device;		

					const request = {
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						url: api.baseURL + '/Apps/' + app.id + '/Devices/' + data.uuid,
						method: 'put',
						body: JSON.stringify(device)
					}

					fetch(request.url, request)
						.then(response => {
							if (response.ok) {
								response.json()
									.then(data => {
										dispatch({
											type: 'DEVICE_STORE',
											data
										});
									});
							} else {
								Keychain.resetGenericPassword('device').then(() => dispatch(create()));
							}
						})
						.catch(error => {
							dispatch({ type: 'DEVICE_CREATE_FAILURE' });
							console.log(error);
							return false;
						});
				})
				.catch(err => {					
					const device = Object.assign({ uuid: uuid.v4() }, internals.device);
					internals.createDevice(device, dispatch);
					console.warn(err);
				});
		} else {
			//Android return consistent uniqueID per device, there is no need to make use of KeyChain in case of android.
			const device = Object.assign({ uuid: DeviceInfo.getUniqueID() }, internals.device);
			internals.createDevice(device, dispatch);
		}
	}
}

internals.createDevice = (device, dispatch) => {
	console.log(api.baseURL + '/Apps/' + app.id + '/Devices')
	console.log(device)
	const request = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		url: api.baseURL + '/Apps/' + app.id + '/Devices',
		method: 'post',
		body: JSON.stringify(device)
	}

	fetch(request.url, request)
		.then(response => {
			if (response.ok) {
				response
					.json()
					.then(device => {
						// Call KeyChain for ios
						// In case of android keychain functionality is not needed.
						(new Promise((resolve, reject) => {
							if (Platform.OS === 'ios') {
								Keychain
									.setGenericPassword(JSON.stringify(device), '-empty-', 'device')
									.then(resolve)
									.catch(reject);
							} else {
								resolve({});
							}
						}))
							.then(data => {
								dispatch({
									type: 'DEVICE_STORE',
									data: device,
								});
							})
							.catch(console.error);
					});
			} else {
				dispatch({ type: 'DEVICE_CREATE_FAILURE' });
			}
		})
		.catch(error => {
			dispatch({ type: 'DEVICE_CREATE_FAILURE' });
			console.log(error);
			return false;
		});
};
