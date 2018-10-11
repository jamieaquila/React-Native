const defaultState = {
  data: [],
  isLoading: false
}

export default function albumReducer(state = defaultState, action) {
  switch(action.type) {
    case 'GET_ALBUMS':
      return { 
        ...state,
        isLoading: true
      };
      break;
    case 'GET_ALBUMS_SUCCESS':
      return { 
        data: action.data,
        isLoading: false
      };
      break;
    default:
      return state;
  }
}
