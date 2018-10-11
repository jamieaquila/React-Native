const defaultState = {
  items: [],
  isLoading: false
}

export default function leaderReducer(state = defaultState, action) {
  switch(action.type) {
    case 'LEADER_FIND':
      return { 
        ...state,
        isLoading: true
      };
      break;
    case 'LEADER_FIND_SUCCESS':
      return { 
        ...state,
        items: action.data,
        isLoading: false
      };
      break;
    default:
      return state;
  }
}
