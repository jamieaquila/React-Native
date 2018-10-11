const defaultState = {
    data: undefined,
    isLoading: false
}
  
export default function setLocationReducer(state = defaultState, action) {
    switch(action.type) {
      case 'SET_LOCATION_SUCCESS':
        return { 
          ...state,
          data: action.data,
          isLoading: false
        };
        break;      
      case 'SET_LOCATION':
      case 'SET_LOCATION_FAILURE':
          return { 
            ...state,
            isLoading: action.isLoading
          };
      case 'SET_LOCATION_INIT':
          return {
            ...state,
            data: undefined,
            isLoading: false
          }
      default:
        return state;
    }
}