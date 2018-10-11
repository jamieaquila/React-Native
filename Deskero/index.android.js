__STRESS_TEST__ = false;
import PushNotification from 'react-native-push-notification';
import Sound from 'react-native-sound';
import { localStorage } from './src/services'
import App from './src/app';


// let effect = new Sound("chat_notification.mp3", Sound.MAIN_BUNDLE, (error) => {
//     if (error) {
//     //   console.log(error)
//     }
// })

// PushNotification.setApplicationIconBadgeNumber(0)

// PushNotification.configure({
//     onRegister: (token) => {
//         // console.log(token)
//         localStorage.get('deviceToken').then((deviceToken) => {
//             if(!deviceToken){
//                 localStorage.set('deviceToken', token.token)
//             }
//         })      
//     },
//     onNotification: (notification) => {
//         // console.log( 'NOTIFICATION:' + JSON.stringify(notification) );  
//         PushNotification.setApplicationIconBadgeNumber(0)  
//         effect.play((success) => {
//             if (!success) {
//             //   console.log('Sound did not play')
//             }
//         })    
//     },
//     senderID: "841387662129",
//     requestPermissions: true,
// })

