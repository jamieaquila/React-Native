import * as Views from '../components/views';
import Festival from '../Festival';

export default {
	'/Feeds': {
		tabIndex: 0,
		routeStack: [
			{ component: Views.Feeds, root: true }
		]
	},
	 '/Music': {
	 	tabIndex: 1,
	 	routeStack: [
	 		{ component: Views.Music, root: true }
	 	]
	 },
	//'/Festival': {
	//	tabIndex: 1,
	//	routeStack: [
	//		{ component: Festival, root: true }
	//	]
	//},
	// '/MessageThreads': {
	// 	tabIndex: 2,
	// 	routeStack: [
	// 		{ component: Views.MessageThreads, root: true }
	// 	]
	// },
	'/Tours': {
		tabIndex: 2,
		routeStack: [
			{ component: Views.Tours, root: true}
		]
	},
	'/Profile': {
		tabIndex: 3,
		routeStack: [
			{ component: Views.Profile, root: true }
		]
	},
	'/ConnectSocialNetwork': {
		routeStack: [
			{ component: Views.ConnectSocialNetwork }
		]
	}
}