import { Image } from 'react-native';

const defaultState = {
	items: [],
	isLoading: false,
	isRefreshing: false
};

export default function feedReducer(state = defaultState, action) {

	switch(action.type) {
		case 'FEED_START_REFRESHING':
			return {
				...state,
				isRefreshing: true
			}
		case 'FEED_GET_FEED':
			return {
				...state,
				isLoading: true
			}
		case 'FEED_GET_FEED_SUCCESS':
			return {
				...state,
				items: state.items.map(feed => feed.id == action.feedId ? action.data : feed),
				isLoading: false,
				isRefreshing: false
			}
		case 'FEED_GET_FEED_FAILURE':
			return { 
				...state, 
				isLoading: false, 
				isRefreshing: false 
			};
		case 'FEED_GET_FEEDS':
			return {
				...state,
				isLoading: true
			};
		case 'FEED_GET_FEEDS_SUCCESS':
			return { 
				...state,
				items: action.data,
				isLoading: false
			};
		case 'FEED_GET_FEEDS_FAILURE':
			return { ...state, isLoading: false };
		case 'FEED_APPEND_FEED_ITEMS':
			return {
				...state,
				isLoading: true
			};
		case 'FEED_APPEND_FEED_ITEMS_SUCCESS':
			var { data, feedId } = action;

			var items = state.items.map(feed => {
				if (feed.id === feedId) {
					feed.canLoadMore = (data.feedItems.length > 0)
					feed.feedItems = feed.feedItems.concat(data.feedItems);
				}
				return feed;
			});

			return {
				...state,
				items,
				isLoading: false
			}
		case 'FEED_APPEND_FEED_ITEMS_FAILURE':
			return { ...state, isLoading: false }
		case 'FEED_ITEM_FETCH_COMMENT':
			return { ...state, isLoading: true }
		case 'FEED_ITEM_FETCH_COMMENT_SUCCESS':
			var { data, targetFeedItem } = action;

			var items = state.items.map(item => {

				item.feedItems = item.feedItems.map(feedItem => {
					if (feedItem.id !== targetFeedItem.id) return feedItem;

					feedItem.commentList = data;
					return feedItem;
				});

				return item;
			});

			return {
				...state,
				items,
				isLoading: false
			}
		case 'FEED_ITEM_FETCH_COMMENT_FAILURE':
			return { ...state, isLoading: false }
		case 'FEED_ITEM_RESHARE_CREATE_SUCCESS':
		case 'FEED_ITEM_RESHARE_DESTROY_SUCCESS':
			return {
				...state,
				isLoading: action.isLoading
			};
		case 'FEED_ITEM_LIKE':
		case 'FEED_ITEM_DISLIKE_FAILURE':
			var { feedItemId } = action;
			var feedItemsList = state.items.map((item) => item.feedItems);
			var feedItems = [].concat.apply([], feedItemsList);
			var feedItem = feedItems.find(item => {
				return item.id == feedItemId;
			});

			if (feedItem) {
				feedItem.likes = feedItem.likes + 1;
			}

			return {
				...state,
				isLoading: action.isLoading
			};
		case 'FEED_ITEM_DISLIKE':
		case 'FEED_ITEM_LIKE_FAILURE':
			var { feedItemId } = action;
			var feedItemsList = state.items.map((item) => item.feedItems);
			var feedItems = [].concat.apply([], feedItemsList);
			var feedItem = feedItems.find(item => {
				return item.id == feedItemId;
			});

			if (feedItem) {
				feedItem.likes = feedItem.likes - 1;
			}

			return {
				...state,
				isLoading: action.isLoading
			};
		case 'FEED_ITEM_COMMENT_POST':
			var { feedItemId } = action;
			var feedItemsList = state.items.map((item) => item.feedItems);
			var feedItems = [].concat.apply([], feedItemsList);
			var feedItem = feedItems.find(item => {
				return item.id == feedItemId;
			});

			if (feedItem) {
				feedItem.comments = feedItem.comments + 1;
			}

			return {
				...state,
				isLoading: action.isLoading
			};
		case 'FEED_ITEM_COMMENT_POST_FAILURE':
			var { feedItemId } = action;
			var feedItemsList = state.items.map((item) => item.feedItems);
			var feedItems = [].concat.apply([], feedItemsList);
			var feedItem = feedItems.find(item => {
				return item.id == feedItemId;
			});

			if (feedItem) {
				feedItem.comments = feedItem.comments - 1;
			}

			return {
				...state,
				isLoading: action.isLoading
			};
		case 'FEED_ITEM_RESHARE_CREATE':
		case 'FEED_ITEM_RESHARE_DESTROY_FAILURE':
			var { feedItemId } = action;
			var feedItemsList = state.items.map((item) => item.feedItems);
			var feedItems = [].concat.apply([], feedItemsList);
			var feedItem = feedItems.find(item => {
				return item.id == feedItemId;
			});

			if (feedItem) {
				feedItem.shares = feedItem.shares + 1;
			}

			return {
				...state,
				isLoading: action.isLoading
			};
		case 'FEED_ITEM_RESHARE_DESTROY':
		case 'FEED_ITEM_RESHARE_CREATE_FAILURE':

			var { feedItemId } = action;
			var feedItemsList = state.items.map((item) => item.feedItems);
			var feedItems = [].concat.apply([], feedItemsList);
			var feedItem = feedItems.find(item => {
				return item.id == feedItemId;
			});

			if (feedItem) {
				feedItem.shares = feedItem.shares - 1;
			}

			return {
				...state,
				isLoading: action.isLoading
			};


		default:
			return state;
	}
}
