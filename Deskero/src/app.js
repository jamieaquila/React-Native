import { Platform, PushNotificationIOS, AppState } from 'react-native';
import PushNotification from 'react-native-push-notification';
import Sound from 'react-native-sound';

import { registerScreens } from './screens';
import { startLogin } from './screens/Login';
import { startMain } from './screens/MainScreens';

import { Client, localStorage } from './services'
import { GlobalVals } from './global'

registerScreens();

let effect = new Sound("chat_notification.mp3", Sound.MAIN_BUNDLE, (error) => { if (error) {} })



AppState.addEventListener('change', state =>{  
    if(state === "active") resetBadgeIcon()
})

if(Platform.OS == 'ios'){
    PushNotification.configure({  
      onRegister: (token) => {
        console.log(token)
        localStorage.get('deviceToken').then((deviceToken) => {
            if(!deviceToken){
                localStorage.set('deviceToken', token.token)
            }
        })
      },
      onNotification: (notification) => {
        console.log(notification)
        
        notification.finish(PushNotificationIOS.FetchResult.NoData)
        effect.play((success) => { if (!success) {} })

        resetBadgeIcon()
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true
      }      
    })
}else{  
    PushNotification.configure({  
      onRegister: (token) => {
        // console.log(token)
        localStorage.get('deviceInfo').then((deviceInfo) => {
          if(!deviceInfo){
            localStorage.set('deviceInfo', JSON.stringify(token))
          }
        })
      },
      onNotification: (notification) => {
        // console.log(notification)
        effect.play((success) => { if (!success) {} })

        resetBadgeIcon()
      },
      senderID: '841387662129',    
      requestPermissions: true
    })
}

export function resetBadgeIcon() {
    console.log("reset");
    PushNotification.setApplicationIconBadgeNumber(0)
    localStorage.get('loginStatus').then((status) => { 
        if(status) {
            localStorage.get('bearer').then((bearer) => {
                localStorage.get('clientId').then((clientId) => {
                    localStorage.get('deviceToken').then((deviceToken) => {
                        Client.resetNotificationBadges(bearer, clientId, deviceToken)
                            .end((err, res) => {
                                if(err) console.log('Error')
                                else console.log('okokokok')
                            })
                    })
                })
            })
        }
    })
        
}

export function startUserLogin(){
  startLogin();
}

export function startMainTab(idx){
  startMain(idx)
}



localStorage.get('loginStatus').then((status) => {    
    localStorage.get('lang').then((lang) => {
        if(lang){
            GlobalVals.language = lang
        }
        if(status){
            checkLoginStatus()
        }else{
            startUserLogin()
        }
    })      
})

export function checkLoginStatus(){    
  localStorage.get('clientId').then((clientId) => {
      if(clientId && clientId != ''){
          localStorage.get('bearer').then((bearer) => {
              if(bearer && bearer != ''){
                  localStorage.get('permissions').then((permissions) => {
                      if(!permissions){
                          GlobalVals.user.authenticated = false;
                          localStorage.clear();
                          startUserLogin()
                      }else{
                          GlobalVals.user.authenticated = true;
                          localStorage.get('httpDomain').then((httpDomain) =>{
                              GlobalVals.propertis.domain = httpDomain;
                              localStorage.get('clientId').then((clientId) => {
                                  GlobalVals.propertis.clientId = clientId;
                                  localStorage.get('permissions').then((permissions) => {
                                      GlobalVals.permissions = JSON.parse(permissions);
                                      GlobalVals.forceDataRefresh = false;
                                      localStorage.get('badges').then((badges) => {
                                          if(badges){
                                              GlobalVals.badges = JSON.parse(badges);
                                          }
                                          localStorage.get('chatBadges').then((chatBadges) => {
                                              if(chatBadges){
                                                  GlobalVals.chatBadges = JSON.parse(chatBadges);
                                              }
                                              localStorage.get('userId').then((userId) => {
                                                  GlobalVals.dataKeyId = clientId + '-' + userId;
                                                  GlobalVals.chatRetry = 0;
                                                  localStorage.get('chat-onlineUsers').then((onlineUsers) => {
                                                    if(onlineUsers) GlobalVals.onlineUsers = JSON.parse(onlineUsers)

                                                    localStorage.get('clientId').then((clientId) => {
                                                        localStorage.get('userId').then((userId) => {
                                                            Client.chatAuth(clientId, userId)
                                                                .end((err, res) => {
                                                                    if(err){
                                                                    }else{
                                                                        if(res.body.authorized){
                                                                            GlobalVals.token = res.body.token
                                                                            Client.connect()
                                                                        }
                                                                    }
                                                                prepareUserCheck()
                                                            })    
                                                        })
                                                    })
                                                  })
                                              })
                                          })
                                      })
                                  })
                              })
                          })
                          
                      }
                  })
              }
          })
      }else{
          GlobalVals.user.authenticated = false;
          startUserLogin()
      }
  })
}

export function prepareUserCheck(){   
  localStorage.get('userName').then((userName) => {
      GlobalVals.user.name = userName;
      localStorage.get('userId').then((userId) => {
          GlobalVals.user.id = userId;
          localStorage.get('chatUserId').then((chatUserId) => {
              GlobalVals.user.chatUserId = chatUserId;
              localStorage.get('userRole').then((userRole) => {
                  GlobalVals.user.role = userRole;
                  localStorage.get('profilePhoto').then((profilePhoto) => {
                      if(profilePhoto == 'true'){
                          localStorage.get('httpDomain').then((httpDomain) => {
                              GlobalVals.user.profilePhoto = httpDomain + "profilePhoto/" + GlobalVals.user.role.toLowerCase() + "/" + GlobalVals.user.id;
                          })
                      }else{
                          GlobalVals.user.profilePhoto = false;
                      }
                      var callUrl;
                      if(GlobalVals.user.role == "CUSTOMER"){                          
                          callUrl = GlobalVals.propertis.apiBaseUrl + 'customer/' + GlobalVals.user.id;
                      }else{
                          callUrl = GlobalVals.propertis.apiBaseUrl + 'agent/' + GlobalVals.user.id;
                      }
                      localStorage.get('bearer').then((bearer) => {
                          localStorage.get('clientId').then((clientId) => {
                              Client.prepareUser(callUrl, bearer, clientId)
                                  .end((err, res) => {
                                      if(err){
                                          localStorage.clear()
                                          startUserLogin()
                                      }else{
                                          if(res.status == 204){
                                            localStorage.clear()
                                            startUserLogin()
                                          }else{
                                              GlobalVals.userDetails = res.body;   
                                              startMainTab(0)
                                          }
                                      }
                                  })                                        
                          })
                      })
                  })
              })
          })
      })
  })
    
}







