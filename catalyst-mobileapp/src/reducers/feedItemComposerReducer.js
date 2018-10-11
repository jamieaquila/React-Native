const defaultState = {
	message: "",
	media: {
		type: null,
		url: null
	},
	canSubmit: false,
	hasCreated: false,
	isUploading: false
};

export default function feedItemComposer(state = defaultState, action) {
	switch(action.type) {
		case "FEED_ITEM_COMPOSER_SET_MESSAGE":
			var { message } = action.payload;

			return {
				...state,
				message,
				canSubmit: _validate({...state, message})
			}
		case "FEED_ITEM_COMPOSER_SET_MEDIA":
			var { media } = action.payload;

			return {
				...state,
				media,
				canSubmit: _validate({...state, media})
			}
		case "FEED_ITEM_COMPOSER_DELETE_MEDIA":
			return {
				...state,
				media: defaultState.media,
				canSubmit: _validate({...state, ...{ media: defaultState.media }})
			}
		case "FEED_ITEM_COMPOSER_CREATE_SUCCESS":
			return {
				...state,
				hasCreated: true,
				isUploading: false
			}
		case "FEED_ITEM_COMPOSER_CREATE_ERROR":
		case "FEED_ITEM_COMPOSER_CREATE_FAILURE":	
			return {
				...state,
				hasCreated: false,
				isUploading: false
			}
		case "FEED_ITEM_COMPOSER_CREATE":
			return {
				...state,
				isUploading: true
			}
		case "FEED_ITEM_COMPOSER_CREATED":
			return {
				...state,
				hasCreated: false
			}
		case "FEED_ITEM_COMPOSER_CLEAR":
			return defaultState;
		default:
			return state;
	}
}

function _validate(feedItem) {
	return (
		feedItem.message != defaultState.message || 
		feedItem.media != defaultState.media);
}