const defaultState = {
	isLoading: false,
	notifMessageThread: {},
	notifFeedItem: {},
	deeplinkType:""
};

export default function deeplinkReducer(state = defaultState, action) {
	switch(action.type) {
		case "NOTIF_FIND_MESSAGE":
			return {
				...state,
				isLoading: true,
				deeplinkType: "message"
			}
		case "NOTIF_FIND_MESSAGE_SUCCESS":
		{
		  console.log("notif_find_message_success");
			return {
				...state,
				notifMessageThread: action.data,
				isLoading: false
			}
		}
		case "NOTIF_FIND_MESSAGE_ERROR":
		case "NOTIF_FIND_MESSAGE_FAILURE":
		{
			console.log("notif_find_message_failure");
			return {
				...state,
				notifMessageThread: {},
				deeplinkType: "",
				isLoading: false
			}
		}
		case "NOTIF_FIND_FEEDITEM":
			return {
				...state,
				deeplinkType: "exclusiveContent",
				isLoading: true
			}
		case "NOTIF_FIND_FEEDITEM_SUCCESS":
		{
		  console.log("notif_find_feeditem_success");
			return {
				...state,
				notifFeedItem: action.data,
				isLoading: false
			}
		}
		case "NOTIF_FIND_FEEDITEM_ERROR":
		case "NOTIF_FIND_FEEDITEM_FAILURE":
		{
			console.log("notif_find_feeditem_failure");
			return {
				...state,
				notifFeedItem:{},
				deeplinkType: "",
				isLoading: false
			}
		}
		case "NOTIF_LIGHTSHOW":
			return {
				...state,
				deeplinkType: "lightshow",
				isLoading: true
			}
		case "NOTIF_CLEAR_MESSAGE":
			return {
				...state,
				notifMessageThread: {},
				deeplinkType: "",
				isLoading: false
			}
		case "NOTIF_CLEAR_FEEDITEM":
			return {
				...state,
				notifFeedItem: {},
				deeplinkType: "",
				isLoading: false
			}
		case "NOTIF_CLEAR_LIGHTSHOW":
			return {
				...state,
				deeplinkType: "",
				isLoading: false
			}
		default:
			return state;
	}
}
