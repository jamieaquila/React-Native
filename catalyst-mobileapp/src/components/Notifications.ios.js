import React from 'react';
import { PushNotificationIOS, DeviceEventEmitter, View , AppState} from 'react-native';
// import GcmAndroid from 'react-native-gcm-android'
// import Messages from './Messages'

import ModalNavigator from './ModalNavigator'


import { create, destroy } from '../actions/PushNotificationTokenActions';
import { show as showNotification } from '../actions/NotificationActions';
import { clearMessage, clearFeedItem, clearLightshow} from '../actions/DeeplinkActions';
import { connect } from 'react-redux';

import Platform from 'Platform';

import { MessageThread, FeedItemDetail } from './views';

import KeepAwake from 'react-native-keep-awake';
import {startLightshowTrigger} from '../actions/LightshowTriggerAction';
import { processNotification } from "../helpers/NotificationProcessor";


var backgroundNotification = null;
class Notifications extends React.Component {
	

	componentWillMount() {

		if (Platform.OS === 'ios') {
			PushNotificationIOS.setApplicationIconBadgeNumber(0);
			var dispatch = this.props.dispatch;	
			PushNotificationIOS.getInitialNotification().then(function (notification) {
				console.log("getInitialNotification");
				if (notification != null) {

					if(notification._data) {
						var notif = notification._data.data;
						if(notif.deeplink) {
							processNotification(dispatch, notif);
						}
					}
				}
			});

			PushNotificationIOS.addEventListener('notification', notification => {
				console.log("notification", JSON.stringify(notification));
				
				if (AppState.currentState === 'background') {
					console.log("background notification");
					backgroundNotification = notification;
				}else {
					var content = {
						message : notification._alert,
						data: {}
					}

					if(notification._data && notification._data.data) {
						content.data = notification._data.data;
					}
					console.log("Notifications", content);
					this.props.dispatch(showNotification(content));
				}	
			});

			AppState.addEventListener('change', function (new_state) {

				if (new_state === 'active' && backgroundNotification != null) {
					console.log("state change notification");
					var notification = backgroundNotification;
					console.log(notification);
					if(notification._data) {
						var notif = notification._data.data;
						if(notif.deeplink) {

							processNotification(dispatch, notif);
						}
					}
					backgroundNotification = null;
				}
			});

			PushNotificationIOS.addEventListener('register', token => {
				console.log('Push notification token: ', token);
				this.props.dispatch(create(token));
			});

			// PushNotificationIOS.addEventListener('registrationError', err => {
			// 	console.warn(err.message);
			// });
		}
		else {
			// GcmAndroid.addEventListener('register', token => {
			// 	this.props.dispatch(create(token));
			// });
			// GcmAndroid.addEventListener('registerError', error => {
			// 	console.log('registerError', error.message);
			// });
			// GcmAndroid.addEventListener('notification', notification => {
			// 	var info = JSON.parse(notification.data.info);
			// 	if (!GcmAndroid.isInForeground) {
			// 		//Have to test Android Notification first
			// 		//this.props.dispatch(showNotification(info.message));
			// 	}
			// });
			// DeviceEventEmitter.addListener('sysNotificationClick', function(e) {
			// 	console.log('sysNotificationClick', e);
			// });
		}
	}

	componentWillReceiveProps(nextProps) {
		console.log("Notification will receive props.");
	     if(nextProps.deeplink.deeplinkType === "message" && nextProps.deeplink.notifMessageThread.id !== undefined ){
				 var messageThread = nextProps.deeplink.notifMessageThread;
				 this.openMessageThread(messageThread);

	     }
			 if(nextProps.deeplink.deeplinkType === "exclusiveContent" && nextProps.deeplink.notifFeedItem.id !== undefined ){
				 var feedItem = nextProps.deeplink.notifFeedItem;
				 this.openFeedItem(feedItem);
	     }

	}
	appOpenedByNotificationTap(notification) {

	}
	openMessageThread(messageThread) {
		  console.log("openMessageThread");
		  console.log(JSON.stringify(messageThread));
		  var { navigator } = this.props;
	  	navigator.push({component: MessageThread, passProps: { messageThread: messageThread } })
			this.props.dispatch(clearMessage);
	}
	openFeedItem(feedItem) {
		  console.log("openFeedItem");
		  console.log(JSON.stringify(feedItem));
		  var { navigator } = this.props;
	  	navigator.push({component: FeedItemDetail,
				 passProps: {feedItem: feedItem, navigator: navigator, itemType: '' } });
		  this.props.dispatch(clearFeedItem);
	}
	// changeKeepAwake(status){
	// 	if(status){
	// 		KeepAwake.activate();
	// 	}else{
	// 		KeepAwake.deactivate()
	// 	}
	// }



	render() {
		// return <Messages />;
		return <ModalNavigator />
	}

}

const mapStateToProps = (state) => ({ deeplink: state.deeplink});
export default connect(mapStateToProps)(Notifications);
