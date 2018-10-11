const defaultState = {
	isLoading: false,
	shouldDismissModal: false,
	isPerformingAPIRequest: false,
	code: '',
	albumToRedeem: null
};

export default function redemptionCodeReducer(state = defaultState, action) {
	switch (action.type) {
		case 'REDEMPTION_CODE_SET_CODE':
			return {
				...state,
				code: action.code
			};
		case 'REDEMPTION_CODE_SET_ALBUM_TO_REDEEM':
			return {
				...state,
				albumToRedeem: action.album.id
			};
		case 'REDEMPTION_CODE_SET_TRACK_TO_REDEEM':
			return {
				...state,
				trackToRedeem: action.track.id
			};
		case 'REDEMPTION_CODE_REDEEM':
			return {
				...state,
				isPerformingAPIRequest: true
			};
		case 'REDEMPTION_CODE_REDEEM_SUCCESS':
			return {
				...state,
				redeemedCode: action.data,
				shouldDismissModal: true,
				isPerformingAPIRequest: false,
				code: '',
				albumToRedeem: null
			};
		case 'REDEMPTION_CODE_REDEEM_FAILURE':
			return {
				...state,
				isPerformingAPIRequest: false,
				code: ''
			};
		case 'REDEMPTION_CODE_PURCHASE':
			return {
				...state,
				isPerformingAPIRequest: true
			};
		case 'REDEMPTION_CODE_PURCHASE_SUCCESS':
			return {
				...state,
				redeemedCode: action.data,
				shouldDismissModal: true,
				isPerformingAPIRequest: false,
				code: '',
				albumToRedeem: null
			};
		case 'REDEMPTION_CODE_PURCHASE_FAILURE':
			return {
				...state,
				isPerformingAPIRequest: false,
				code: ''
			};
		case 'REDEMPTION_CODE_MODAL_DISMISSED':
			return {
				...state,
				shouldDismissModal: false,
				albumToRedeem: null
			};
		default:
			return state;
	}
}
