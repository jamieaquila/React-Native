import * as Keychain from 'react-native-keychain';
import { api, app } from '../config'
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

export function create(pnToken) {

	return (dispatch) => {
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
			if (!device.uuid) return false;
			console.log("device", device.uuid);
			console.warn(pnToken);
			dispatch({
				type: 'PUSH_NOTIFICATION_TOKEN_CREATE',
				request: {
					url: api.baseURL + '/Apps/' + app.id + '/Devices/' + device.uuid + '/PushNotificationTokens?platform=' + Platform.OS,
					method: 'post',
					body: JSON.stringify({
						pnToken
					})
				}
			});
		})
		.catch(err => console.log(err))
	}

}

export function destroy() {

	return (dispatch) => {
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
			if (!device.uuid) return false;

			dispatch({
				type: 'PUSH_NOTIFICATION_TOKEN_DESTROY',
				request: {
					url: api.baseURL + '/Apps/' + app.id + '/Devices/' + device.uuid + '/PushNotificationTokens?platform=' + Platform.OS,
					method: 'delete'
				}
			});
		})
		.catch(err => console.log(err))
	}

}
