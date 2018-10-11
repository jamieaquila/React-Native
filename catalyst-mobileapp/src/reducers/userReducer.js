const defaultState = {
	currentUser: null,
	isLoading: false
};

export default function userReducer(state = defaultState, action) {
	switch(action.type) {
		case 'USER_GET_ME':
			return {
				...state,
				isLoading: true
			}
		case 'USER_GET_ME_SUCCESS':
			var currentUser = action.data;

			// Add to authStrategy
			currentUser.authStrategyTypes = {};
			for(let strategy of currentUser.authStrategies) currentUser.authStrategyTypes[strategy.type] = true;

			return {
				...state,
				currentUser,
				isLoading: false
			}
		case 'USER_GET_ME_FAILURE':
			return {
				...state,
				isLoading: false
			}
		case 'TRACK_LIKE_SUCCESS':
			var newCurrentUser = state.currentUser;
			newCurrentUser.trackLikes = state.currentUser.trackLikes.concat(action.data);

			return {
				...state,
				currentUser: newCurrentUser
			}
		case 'TRACK_DISLIKE_SUCCESS':
		case 'TRACK_DISLIKE':
			var newCurrentUser = state.currentUser;
			newCurrentUser.trackLikes = newCurrentUser.trackLikes.filter(trackLike => trackLike.track !== action.trackId)

			return {
				...state,
				currentUser: newCurrentUser,
			}
		case 'FEED_ITEM_LIKE_SUCCESS':
			var newCurrentUser = state.currentUser;
			newCurrentUser.feedItemLikes = state.currentUser.feedItemLikes.concat(action.data);

			return {
				...state,
				currentUser: newCurrentUser
			}
		case 'FEED_ITEM_DISLIKE_SUCCESS':
		case 'FEED_ITEM_DISLIKE':
			var newCurrentUser = state.currentUser;
			newCurrentUser.feedItemLikes = newCurrentUser.feedItemLikes.filter(feedItemLike => feedItemLike.feedItem !== action.feedItemId)

			return {
				...state,
				currentUser: newCurrentUser,
			}
		case 'FEED_ITEM_RESHARE_CREATE_SUCCESS':
			var newCurrentUser = state.currentUser;
			newCurrentUser.feedItemReshares = state.currentUser.feedItemReshares.concat(action.data);

			return {
				...state,
				currentUser: newCurrentUser
			}
		case 'FEED_ITEM_RESHARE_DESTROY_SUCCESS':
			var newCurrentUser = state.currentUser;
			newCurrentUser.feedItemReshares = newCurrentUser.feedItemReshares.filter(feedItemReshare => feedItemReshare.feedItem !== action.feedItemId)

			return {
				...state,
				currentUser: newCurrentUser,
			}
		case 'LEADER_FIND_ME_SUCCESS':
			var newCurrentUser = state.currentUser;
			newCurrentUser.leader = action.data;

			return {
				...state,
				currentUser: newCurrentUser
			}
		case 'AUTH_LOGOUT':
			return defaultState;
		case 'AUTH_STRATEGY_DESTROY_SUCCESS':
			var newCurrentUser = state.currentUser;
			newCurrentUser.authStrategies = newCurrentUser.authStrategies.filter(authStrategy => authStrategy.id !== action.authStrategy.id)
			delete newCurrentUser.authStrategyTypes[action.authStrategy.type];

			return {
				...state,
				currentUser: newCurrentUser,
				isLoading: false
			}			
		default:
			return state;
	}
}