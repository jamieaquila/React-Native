import React from 'react';
import { View } from 'react-native';
// import GcmAndroid from 'react-native-gcm-android'
// import Messages from './Messages'

import ModalNavigator from './ModalNavigator'


import { create, destroy } from '../actions/PushNotificationTokenActions';
import { show as showNotification } from '../actions/NotificationActions';
import { clearMessage, clearFeedItem} from '../actions/DeeplinkActions';
import { connect } from 'react-redux';

import Platform from 'Platform';

import FCM from "react-native-fcm";
import {registerKilledListener, registerAppListener} from "../firebase/Listeners";
import firebaseClient from  "../firebase/FirebaseClient";
import { MessageThread, FeedItemDetail } from './views';
import KeepAwake from 'react-native-keep-awake';
import {startLightshowTrigger} from '../actions/LightshowTriggerAction';
registerKilledListener();
class Notifications extends React.Component {

	async componentWillMount() {

        registerAppListener(this.props.dispatch);
        FCM.getInitialNotification().then(notif => {
          this.setState({
            initNotif: notif
          })
        });

        try{
          let result = await FCM.requestPermissions({badge: true, sound: true, alert: true});
        } catch(e){
          console.error(e);
        }

        FCM.getFCMToken().then(token => {
          // console.log("TOKEN (getFCMToken)", token);
          this.props.dispatch(create(token));
        });

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


  componentWillUnmount() {
      // stop listening for events
  }
	render() {
		// return <Messages />;
		return <ModalNavigator />
	}

}
const mapStateToProps = (state) => ({ deeplink: state.deeplink});
export default connect(mapStateToProps)(Notifications);
