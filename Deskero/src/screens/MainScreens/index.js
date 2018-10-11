import { Platform } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { Images, Locale } from '../../themes'
import { GlobalVals } from '../../global'

export function startMain(idx){   
  let tabs;
  if(GlobalVals.user.role == 'AGENT'){
    tabs = [
      {
        label: Locale.t('DASHBOARD.TITLE'),
        screen: 'deskero.DashboardScreen',
        icon: Images.dashboardTabIcon,
        title: Locale.t('DASHBOARD.TITLE'),
      }, 
      {
        label: Locale.t('CUSTOMERS.TITLE'),
        screen: 'deskero.CustomersScreen',
        icon: Images.customersTabIcon,
        title: Locale.t('CUSTOMERS.TITLE'),
      }, 
      {
        label: Locale.t('TICKETS.TITLE'),
        screen: 'deskero.TicketScreen',
        icon: Images.ticketsTabIcon,
        title: '',
      }, 
      {
        label: Locale.t('CHAT.TITLE'),
        screen: 'deskero.ChatScreen',
        icon: Images.chatTabIcon,
        title: '',
      }
    ]
  }else{
    tabs = [
      {
        label: 'Dashboard',
        screen: 'deskero.DashboardScreen',
        icon: Images.dashboardTabIcon,
        title: Locale.t('DASHBOARD.TITLE'),
      }, 
      {
        label: 'Tickets',
        screen: 'deskero.TicketScreen',
        icon: Images.ticketsTabIcon,
        title: '',
      }, 
      {
        label: 'Chat',
        screen: 'deskero.ChatScreen',
        icon: Images.chatTabIcon,
        title: '',
      }
    ]
  }

  let appStyle = {}
  let tabsStyle = {}

  if(Platform.OS == 'ios'){
    tabsStyle = {
      tabBarBackgroundColor: 'rgb(255, 255, 255)',
      tabBarButtonColor: 'rgb(175, 175, 175)',
      tabBarSelectedButtonColor: 'rgb(223, 61, 0)',
      tabBarTranslucent: false,    
      initialTabIndex:idx
    }
    appStyle = {
      navBarButtonColor: '#ffffff',
      navBarTextFontSize:17,
      navBarTextFontFamily:'Helvetica Neue',  
      navigationBarColor: 'rgb(223, 61, 0)',
      navBarBackgroundColor: 'rgb(223, 61, 0)',  
      navBarTextColor: '#ffffff',     
      navBarNoBorder: true,
      drawUnderNavBar: false, 
      tabBarButtonColor: 'rgb(175, 175, 175)',          
      tabBarSelectedButtonColor: '#ff505c',          
      statusBarColor: '#002b4c',
      navBarTitleTextCentered:false,      
    }
  }else{
    tabsStyle = {
      tabBarBackgroundColor: 'rgb(255, 255, 255)',
      tabBarButtonColor: 'rgb(175, 175, 175)',
      tabBarSelectedButtonColor: 'rgb(223, 61, 0)',
      tabBarTranslucent: false,    
        
    }
    appStyle = {
      navBarButtonColor: '#ffffff',
      navBarTextFontSize:17,
      navBarTextFontFamily:'Helvetica Neue',  
      navigationBarColor: 'rgb(223, 61, 0)',
      navBarBackgroundColor: 'rgb(223, 61, 0)',  
      navBarTextColor: '#ffffff',     
      navBarNoBorder: true,
      drawUnderNavBar: false, 
      tabBarButtonColor: 'rgb(175, 175, 175)',          
      tabBarSelectedButtonColor: '#ff505c',          
      statusBarColor: '#002b4c',
      navBarTitleTextCentered:false,      
      initialTabIndex:idx,
      orientation: 'portrait'
    }
  }

    Navigation.startTabBasedApp({
      tabs,
      animationType: 'slide-down',
      tabsStyle: tabsStyle,
      appStyle: appStyle,
      drawer: {
        left: {
          screen: 'deskero.SettingScreen',        
        },                   
        disableOpenGesture: true
      },        
    });
  
  
}