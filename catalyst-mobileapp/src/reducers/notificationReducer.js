const defaultState = {
  message: null,
  data: null,
  shouldDisplay: false
}

export default function notificationReducer(state = defaultState, action) {
  switch(action.type) {
    case 'NOTIFICATION_SHOW':
      return { 
        ...state,
        message: action.message,
        data: action.data,
        shouldDisplay: true
      };
    case 'NOTIFICATION_SHOWN':
      return {
        ...state,
        shouldDisplay: false
      }
    default:
      return state;
  }
}
