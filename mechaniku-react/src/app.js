import { Platform, PushNotificationIOS } from 'react-native';
import { Navigation } from 'react-native-navigation';
import PushNotification from 'react-native-push-notification'
import stripe from 'tipsi-stripe'
import { registerScreens } from './screens';
import { localStorage } from './services';

stripe.init({
  publishableKey: __DEV__ ? 'pk_test_9le7D1SqhM5lzkFoErSyHpsr' : 'pk_test_9le7D1SqhM5lzkFoErSyHpsr',
  merchantId: '',
  androidPayMode: 'production',
})

registerScreens();


if(Platform.OS == 'ios'){
  PushNotification.configure({  
    onRegister: (token) => {
      console.log(token)
      localStorage.get('deviceInfo').then((deviceInfo) => {
        if(!deviceInfo){
          localStorage.set('deviceInfo', JSON.stringify(token))
        }
      })
    },
    onNotification: (notification) => {
      console.log(notification)
      PushNotification.setApplicationIconBadgeNumber(0)
      notification.finish(PushNotificationIOS.FetchResult.NoData)
      receiveNotification(notification)
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },    
  })
}else{  
  PushNotification.configure({  
    onRegister: (token) => {
      console.log(token)
      localStorage.get('deviceInfo').then((deviceInfo) => {
        if(!deviceInfo){
          localStorage.set('deviceInfo', JSON.stringify(token))
        }
      })
    },
    onNotification: (notification) => {
      PushNotification.setApplicationIconBadgeNumber(0)
      console.log(notification)
      receiveNotification(notification)
    },
    senderID: '665183695590',    
    requestPermissions: true,
    // {
    //   foreground: false, // BOOLEAN: If the notification was received in foreground or not
    //   userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
    //   message: 'My Notification Message', // STRING: The notification message
    //   data: {}, // OBJECT: The push data
    // }
  })
}


localStorage.get('userLogin').then((login) => {
  let screen = {
    title: '',
    screen:'',
    navigatorStyle: {
      navBarHidden: false,
      navBarBackgroundColor:'rgba(248,248,248,0.82)',
      navBarNoBorder:true,
      navBarTitleTextCentered:true 
    }
  }
  if(login == 'true'){
    localStorage.get('userInfo').then((userInfo) => {
      let info = JSON.parse(userInfo)
      if(info.user_type == 1){
        screen.screen = 'mechaniku.AdminUsersScreen',
        screen.navigatorStyle.navBarHidden = true
      }else{
        screen.title = 'Appointments'
        screen.screen = 'mechaniku.MechanicAppointmentScreen'
        screen.navigatorButtons = {
          rightButtons: [
              {
                  id:'logout',
                  title: 'Logout'
              }
              
          ]
        }
      }
      Navigation.startSingleScreenApp({
        screen:screen
      }) 
    })
  }else{
    localStorage.get('curStatus').then((status) => {
      localStorage.get('appointmentId').then(appointmentId =>{
        if(status == 'pending'){
          screen.title = "Appointment Pending"
          screen.screen = "mechaniku.AppointmentPendingScreen"
        }else if(status == 'confirmed'){        
          screen.title = "Appointment Confirmed"
          screen.screen = "mechaniku.AppointmentConfirmedScreen"
          screen.navigatorButtons = {
            rightButtons: [
                {
                    id:'home',
                    title: 'HOME'
                }
            ]
          }        
        }else{
          screen.screen = "mechaniku.HomeScreen"
          screen.navigatorStyle.navBarHidden = true
        }
        Navigation.startSingleScreenApp({
          screen:screen,
          passProps:{
            appointmentId: appointmentId                  
          }
        }) 
      })      
    })
  }
  
})


export function receiveNotification(notification){
  let screen = {
    title: '',
    screen:'',
    navigatorStyle: {
      navBarHidden: false,
      navBarBackgroundColor:'rgba(248,248,248,0.82)',
      navBarNoBorder:true,
      navBarTitleTextCentered:true 
    }
  }

  let checkInfo = {}

  if(Platform.OS == 'ios'){
    checkInfo.state = notification.data.data.state
    checkInfo.appointmentId = notification.data.data.appointment_id
  }else{
    checkInfo.state = notification.state
    checkInfo.appointmentId = notification.appointment_id
  }

  if(checkInfo.state == 'created'){
    localStorage.get('userLogin').then((login) => {
      if(login == 'true'){
        localStorage.get('userInfo').then((userInfo) => {
          let info = JSON.parse(userInfo)
          if(info.user_type != 1){
            screen.title = 'Appointments',
            screen.screen = 'mechaniku.MechanicAppointmentScreen' 
            screen.navigatorStyle.navBarHidden = false
            Navigation.startSingleScreenApp({
              screen:screen
            })            
          }
        })
      }
    })
  }else if(checkInfo.state == 'accepted'){
    localStorage.set('curStatus', 'confirmed')
    localStorage.set('appointmentId', checkInfo.appointmentId)
    
    screen.title = 'Appointment Confirmed'
    screen.screen = 'mechaniku.AppointmentConfirmedScreen'  
    screen.navigatorStyle.navBarHidden = false
    screen.navigatorButtons = {
      rightButtons: [
          {
              id:'home',
              title: 'HOME'
          }
      ]
    }
    Navigation.startSingleScreenApp({
      screen:screen,
      passProps:{
        appointmentId: checkInfo.appointmentId                  
      }
    })   
  }  
}

// - IOS
// { 
//   foreground: false,
//   userInteraction: true,
//   message: 'Rejected your appointment.',
//   data: 
//    { 
//     remote: true,
//     notificationId: 'BF6DC0BF-0EF8-45BC-BF79-56C040B49B64',
//     data: { 
//        appointment_id: '1', 
//        state: 'rejected' 
//     } 
//   },
//   badge: 1,
//   alert: 'Rejected your appointment.',
//   sound: 'default',
//   finish: [Function: finish] 
// }

// - Android
// { 
//   foreground: false,
//   finish: [Function: finish],
//   'google.sent_time': 1520317175802,
//   'google.ttl': 2419200,
//   userInteraction: false,
//   id: '-1911677610',
//   state: 'rejected',
//   appointment_id: '1',
//   'google.message_id': '0:1520317175807923%6860d8eaf9fd7ecd',
//   message: 'Rejected your appointment.' 
// }