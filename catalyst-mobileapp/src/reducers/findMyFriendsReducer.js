const defaultState = {
    friends: [],
    location: [],
    isLoading: false
}
  
export default function findMyFriendReducer(state = defaultState, action) {
    switch(action.type) {
      case 'FIND_MY_LOCATION_SUCCESS':
        return { 
          ...state,
          isLoading: false
        };
        break;
      case 'FIND_MY_FRIENDS_LOCATION_SUCCESS':
        return { 
          ...state,
          friends: action.data.friends,
          isLoading: false
        };
        break;
      case 'FIND_MY_LOCATION':
      case 'FIND_MY_FRIENDS_LOCATION':
      case 'FIND_MY_LOCATION_FAILURE':
      case 'FIND_MY_FRIENDS_LOCATION_FAILURE':
          return { 
            ...state,
            isLoading: action.isLoading
          };
      default:
        return state;
    }
}
  