import {Navigation, ScreenVisibilityListener} from 'react-native-navigation';

import LoginScreen from './Login/LoginScreen'
import ForgetPasswordScreen from './ForgetPassword'

import DashboardScreen from './MainScreens/Dashboard'
import CustomersScreen from './MainScreens/Customers'
import TicketScreen from './MainScreens/Tickets'
import SearchTicketScreen from './MainScreens/Tickets/SearchTicket'
import TicketsSearchResultScreen from './MainScreens/Tickets/TicketsSearchResult'
import CustomSearchTicketsScreen from './MainScreens/Tickets/CustomSearchTickets'

import TicketDetailScreen from './MainScreens/Tickets/TicketDetail'
import ChatScreen from './MainScreens/Chat'
import SettingScreen from './MainScreens/Settings'
import ProfileScreen from './MainScreens/Profile'
import AddEditCustomerFilterScreen from './MainScreens/Customers/AddEditCustomerFilter'
import CustomerHistoryScreen from './MainScreens/Customers/CustomerHistory'
import AddEditCustomerScreen from './MainScreens/Customers/AddEditCustomer'
import AddEditCompanyScreen from './MainScreens/Customers/AddEditCompany'
import CompanyDetailScreen from './MainScreens/Customers/CompanyDetail'
import AddEditTicketScreen from './MainScreens/Tickets/AddEditTicket'
import TicketForwardScreen from './MainScreens/Tickets/TicketForward'
import ScenariosScreen from './MainScreens/Tickets/Scenarios'
import ChatSessionScreen from './MainScreens/Chat/ChatSession'
import SendFeedbakScreen from './MainScreens/Settings/SendFeedback'
import WebViewModal from '../components/Modals/WebViewModal'
import TextEditorScreen from './MainScreens/Tickets/TextEditor'

export function registerScreens() {
  Navigation.registerComponent('deskero.LoginScreen', () => LoginScreen);
  Navigation.registerComponent('deskero.WebViewModal', () => WebViewModal);
  Navigation.registerComponent('deskero.ForgetPasswordScreen', () => ForgetPasswordScreen);  
  Navigation.registerComponent('deskero.DashboardScreen', () => DashboardScreen);
  Navigation.registerComponent('deskero.CustomersScreen', () => CustomersScreen); 
  Navigation.registerComponent('deskero.TicketScreen', () => TicketScreen);
  Navigation.registerComponent('deskero.SearchTicketScreen', () => SearchTicketScreen);
  Navigation.registerComponent('deskero.TicketsSearchResultScreen', () => TicketsSearchResultScreen); 
  Navigation.registerComponent('deskero.CustomSearchTicketsScreen', () => CustomSearchTicketsScreen); 
  Navigation.registerComponent('deskero.TicketDetailScreen', () => TicketDetailScreen); 
  Navigation.registerComponent('deskero.ChatScreen', () => ChatScreen); 
  Navigation.registerComponent('deskero.SettingScreen', () => SettingScreen); 
  Navigation.registerComponent('deskero.ProfileScreen', () => ProfileScreen); 
  Navigation.registerComponent('deskero.AddEditCustomerFilterScreen', () => AddEditCustomerFilterScreen); 
  Navigation.registerComponent('deskero.CustomerHistoryScreen', () => CustomerHistoryScreen); 
  Navigation.registerComponent('deskero.AddEditCustomerScreen', () => AddEditCustomerScreen); 
  Navigation.registerComponent('deskero.AddEditCompanyScreen', () => AddEditCompanyScreen); 
  Navigation.registerComponent('deskero.CompanyDetailScreen', () => CompanyDetailScreen); 
  Navigation.registerComponent('deskero.AddEditTicketScreen', () => AddEditTicketScreen); 
  Navigation.registerComponent('deskero.TicketForwardScreen', () => TicketForwardScreen); 
  Navigation.registerComponent('deskero.ScenariosScreen', () => ScenariosScreen); 
  Navigation.registerComponent('deskero.ChatSessionScreen', () => ChatSessionScreen); 
  Navigation.registerComponent('deskero.SendFeedbakScreen', () => SendFeedbakScreen); 
  Navigation.registerComponent('deskero.TextEditorScreen', () => TextEditorScreen); 
}


