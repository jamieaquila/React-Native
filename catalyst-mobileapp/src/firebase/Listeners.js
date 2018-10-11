import { Platform, AsyncStorage, AppState } from 'react-native';
import { create, destroy } from '../actions/PushNotificationTokenActions';
import { show as showNotification } from '../actions/NotificationActions';
import { processNotification } from "../helpers/NotificationProcessor";
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType, NotificationActionType, NotificationActionOption, NotificationCategoryOption} from "react-native-fcm";

AsyncStorage.getItem('lastNotification').then(data=>{
  if(data){
    // if notification arrives when app is killed, it should still be logged here
    console.log('lastNotification', data);
    AsyncStorage.removeItem('lastNotification');
  }
})

AsyncStorage.getItem('lastMessage').then(data=>{
  if(data){
    // if notification arrives when app is killed, it should still be logged here
    console.log('last message', JSON.parse(data));
    AsyncStorage.removeItem('lastMessage');
  }
})

export function registerKilledListener(){
  // these callback will be triggered even when app is killed
  FCM.on(FCMEvent.Notification, notif => {
    AsyncStorage.setItem('lastNotification', JSON.stringify(notif));
    if(notif.opened_from_tray){
      if(notif._actionIdentifier === 'com.myidentifi.fcm.text.reply'){
        if(AppState.currentState !== 'background'){
          alert('User replied '+ JSON.stringify(notif._userText));
        } else {
          AsyncStorage.setItem('lastMessage', JSON.stringify(notif._userText));
        }
      }
      if(notif._actionIdentifier === 'com.myidentifi.fcm.text.view'){
        alert("User clicked View in App");
      }
      if(notif._actionIdentifier === 'com.myidentifi.fcm.text.dismiss'){
        alert("User clicked Dismiss");
      }
    }
  });
}

// these callback will be triggered only when app is foreground or background
export function registerAppListener(dispatch){
  FCM.on(FCMEvent.Notification, notif => {
    console.log("Notification", notif);
    if(notif.fcm.body) {

      dispatch(showNotification(notif.fcm.body));

    }
    if(notif.opened_from_tray){
      //var deeplink = notif.deeplink;
      //var content = notif.deeplinkContent;
      console.log("NotificationTray", notif);
      if(notif.deeplink) {
        processNotification(dispatch, notif);
      }
    }

  });

  FCM.on(FCMEvent.RefreshToken, token => {
    // console.log("TOKEN (refreshUnsubscribe)", token);
  });

  FCM.enableDirectChannel();
  FCM.on(FCMEvent.DirectChannelConnectionChanged, (data) => {
    // console.log('direct channel connected' + data);
  });
  setTimeout(function() {
    // FCM.isDirectChannelEstablished().then(d => console.log(d));
  }, 1000);
}

FCM.setNotificationCategories([
  {
    id: 'com.myidentifi.fcm.text',
    actions: [
      {
        type: NotificationActionType.TextInput,
        id: 'com.myidentifi.fcm.text.reply',
        title: 'Quick Reply',
        textInputButtonTitle: 'Send',
        textInputPlaceholder: 'Say something',
        intentIdentifiers: [],
        options: NotificationActionOption.AuthenticationRequired
      },
      {
        type: NotificationActionType.Default,
        id: 'com.myidentifi.fcm.text.view',
        title: 'View in App',
        intentIdentifiers: [],
        options: NotificationActionOption.Foreground
      },
      {
        type: NotificationActionType.Default,
        id: 'com.myidentifi.fcm.text.dismiss',
        title: 'Dismiss',
        intentIdentifiers: [],
        options: NotificationActionOption.Destructive
      }
    ],
    options: [NotificationCategoryOption.CustomDismissAction, NotificationCategoryOption.PreviewsShowTitle]
  }
])
