import { AppRegistry } from 'react-native'
import App from './App'
import bgMessaging from 'modules/notifications/bgMessaging'

AppRegistry.registerComponent('enzym_proto', () => App)
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging)
