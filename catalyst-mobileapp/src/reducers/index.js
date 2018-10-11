import { combineReducers } from 'redux'

import feed from './feedReducer';
import tour from './tourReducer';
import app from './appReducer';
import tracks from './trackReducer';
import route from './routeReducer';
import twitterRequestToken from './twitterRequestTokenReducer';
import albums from './albumReducer';
import auth from './authReducer';
import modal from './modalReducer';
import statusBar from './statusBarReducer';
import user from './userReducer';
import musicPlayer from './musicPlayerReducer';
import activities from './activityReducer';
import notification from './notificationReducer';
import leaders from './leaderReducer';
import device from './deviceReducer';
import pushNotificationToken from './pushNotificationTokenReducer';
import feedItemComposer from './feedItemComposerReducer';
import messageThread from './messageThreadReducer';
import messageThreadComposer from './messageThreadComposerReducer';
import redemptionCode from './redemptionCodeReducer';
import findMyFriends from './findMyFriendsReducer';
import setLocation from './setLocationReducer'
import lightshows from './lightshowReducer'
import lightshowTrigger from './lightshowTriggerReducer'
import deeplink from './deeplinkReducer'
import socketMessage from './messageReducer'
import festival from './festivalReducer'
export default combineReducers({
	feed,
	tour,
	app,
	tracks,
	albums,
	route,
	twitterRequestToken,
	auth,
	modal,
	statusBar,
	user,
	musicPlayer,
	activities,
	notification,
	leaders,
	device,
	pushNotificationToken,
	feedItemComposer,
	messageThread,
	messageThreadComposer,
	redemptionCode,
	findMyFriends,
	setLocation,
	lightshows,
	lightshowTrigger,
	deeplink,
	socketMessage,
	festival
});
