import {    
    PushNotificationIOS
} from 'react-native'
import PushNotification from 'react-native-push-notification';
import Sound from 'react-native-sound';
import { localStorage } from './src/services'
import { Client } from 'bugsnag-react-native';
const bugsnag = new Client();
import App from './src/app';

// let effect = new Sound("chat_notification.mp3", Sound.MAIN_BUNDLE, (error) => {
//     if (error) {}
// })

// PushNotification.setApplicationIconBadgeNumber(0)

// PushNotification.configure({
//     onRegister: (token) => {   
//         console.log('TOKEN:' + JSON.stringify(token))
        
//         localStorage.get('deviceToken').then((deviceToken) => {
//             if(!deviceToken){
//                 localStorage.set('deviceToken', token.token)
//             }
//         })
//     },
//     onNotification: (notification) => {
//         console.log( 'NOTIFICATION:' + JSON.stringify(notification) );  

//         PushNotification.setApplicationIconBadgeNumber(0)      
//         notification.finish(PushNotificationIOS.FetchResult.NoData);
//         effect.play((success) => {
//             if (!success) {}
//         })
//     },
//     permissions: {
//         alert: true,
//         badge: true,
//         sound: true
//     }
// })

