const initialState = {
	item: {
		title: "",
		messages: [{
			message: ""
		}],
	},
	canSubmit: false,
	hasCreated: false
};

export default function messageThreadComposer(state = initialState, action) {
	switch(action.type) {
		case "MESSAGE_THREAD_COMPOSER_SET_MESSAGE":
			var { message } = action.payload;

			return {
				...state,
				item: { ...state.item, messages: [ { message } ] },
				canSubmit: _validate({ ...state.item, messages: [ { message } ] })
			}
		case "MESSAGE_THREAD_COMPOSER_CREATE_SUCCESS":
			return {
				...state,
				hasCreated: true
			}
		case "MESSAGE_THREAD_COMPOSER_CREATED":
			return {
				...state,
				hasCreated: false
			}
		case "MESSAGE_THREAD_COMPOSER_CLEAR":
			return initialState;
		default:
			return state;
	}
}

function _validate(item) {
	return item.messages[0].message != initialState.item.messages[0].message;
}