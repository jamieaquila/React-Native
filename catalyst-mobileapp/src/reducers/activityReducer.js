const defaultState = {
	isLoading: false,
	items: []
};

export default function activityReducer(state = defaultState, action) {
	switch(action.type) {
		case "ACTIVITY_GET_OWN":
			return {
				...state,
				isLoading: true
			}
		case "ACTIVITY_GET_OWN_SUCCESS":
			return {
				...state,
				items: action.data,
				isLoading: false
			}
		case "TRACK_LIKE_SUCCESS":
		case "FEED_ITEM_LIKE_SUCCESS":
		case "FEED_ITEM_RESHARE_CREATE_SUCCESS":
			var { items } = state;
			items.unshift(action.data.activity)

			return {
				...state,
				items,
			}
		case "TRACK_DISLIKE_SUCCESS":
			var newItems = state.items.filter(item => (item.track != action.trackId));

			return {
				...state,
				items: newItems,
			}
			break;
		case "FEED_ITEM_DISLIKE_SUCCESS":
			var newItems = state.items.filter(item => (item.feedItem != action.feedItemId));

			return {
				...state,
				items: newItems,
			}
		case "FEED_ITEM_RESHARE_DESTROY_SUCCESS":
			var newItems = state.items.filter(item => (item.feedItem != action.feedItemId));

			return {
				...state,
				items: newItems,
			}
		case "AUTH_STRATEGY_DESTROY_SUCCESS":
			switch(action.authStrategy.type) {
				case "twitter":
					var activityTypeToDelete = "connectTwitter";
				break;
				case "facebook":
					var activityTypeToDelete = "connectFacebook";
				break;
			}
			var newItems = state.items.filter(item => (item.type && item.type.id != activityTypeToDelete));

			return {
				...state,
				items: newItems,
			}
		default:
			return state;
	}
}
