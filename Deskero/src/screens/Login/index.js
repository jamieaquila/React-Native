import {Navigation} from 'react-native-navigation';

export function startLogin(navigator){
    
    Navigation.startSingleScreenApp({
        screen: {
          screen: 'deskero.LoginScreen',
          title: '',
          navigatorStyle: {
            drawUnderNavBar: false,
            navBarHidden: true,
          }
        },
        portraitOnlyMode: true  
    });
}