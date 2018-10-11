const defaultState = {
  isLoading: false,
  startedLightshows: [],
  curPage: '',
  startedLightshow: undefined,
  endedLightshow: undefined,
  startLightshowUser: false
};

export default function messageReducer(state = defaultState, action) {
  let lightshows
  switch(action.type) {
    case "SIO_MESSAGE_ANNOUNCE":
      return {
        ...state,
        isLoading: true
      }
    case "SIO_MESSAGE_ANNOUNCE_SUCCESS":
    {
      console.log("sio announce success.");
      return {
        ...state,
        isLoading: false
      }
    }
    case "SIO_MESSAGE_ANNOUNCE_ERROR":
    case "SIO_MESSAGE_ANNOUNCE_FAILURE":
    {
      console.log("sio announce failure");
      return {
        ...state,
        isLoading: false
      }
    }

    case "SIO_MESSAGE_UPDATE_LOCATION":
      return {
        ...state,
        isLoading: true
      }
    case "SIO_MESSAGE_UPDATE_LOCATION_SUCCESS":
    {
      console.log("sio updateLocation success.");
      
      return {
        ...state,        
        isLoading: false
      }
    }
    case "SIO_MESSAGE_UPDATE_LOCATION_ERROR":
    case "SIO_MESSAGE_UPDATE_LOCATION_FAILURE":
    {
      console.log("sio updateLocation failure");
      return {
        ...state,
        isLoading: false
      }
    }

    case "SIO_MESSAGE_START_LIGHTSHOW":
      return {
        ...state,
        isLoading: true
      }
    case "SIO_MESSAGE_START_LIGHTSHOW_SUCCESS":
    {
      console.log("sio start lightshow success.");
      // console.log(action.body)
      lightshows = []
      lightshows = state.startedLightshows.slice()
      lightshows.push(action.body)
    
      return {
        ...state,
        startedLightshows: lightshows,
        startedLightshow: action.body,     
        isLoading: false
      }
    }
    case "SIO_MESSAGE_START_LIGHTSHOW_ERROR":
    case "SIO_MESSAGE_START_LIGHTSHOW_FAILURE":
    {
      console.log("sio start lightshow failure");
      return {
        ...state,
        isLoading: false
      }
    }

    case "SIO_MESSAGE_STOP_LIGHTSHOW":
      return {
        ...state,
        isLoading: true
      }
    case "SIO_MESSAGE_STOP_LIGHTSHOW_SUCCESS":
      console.log("sio stop lightshow success.");
      lightshows = []
      lightshows = state.startedLightshows.slice()
      var idx = lightshows.indexOf(action.body)
      if(idx > -1)
        lightshows.splice(idx, 1)      
      return {
        ...state,
        startedLightshows: lightshows,
        endedLightshow: action.body,        
        isLoading: false
      }
    case "SIO_MESSAGE_STOP_LIGHTSHOW_ERROR":
    case "SIO_MESSAGE_STOP_LIGHTSHOW_FAILURE":
      console.log("sio stop lightshow failure");
      return {
        ...state,
        isLoading: false
      }    
    case 'INIT_STOP_LIGHTSHOW':
      return {
        ...state,
        endedLightshow: action.data,
        isLoading: false
      } 
    case 'INIT_START_LIGHTSHOW':
      return {
        ...state,
        startedLightshow: action.data,
        isLoading: false
      } 
    case 'STOP_LIGHTSHOW_WITHOUT_CALL_API':
      lightshows = []
      lightshows = state.startedLightshows.slice()
      console.log(action.data)
      var idx = lightshows.indexOf(action.data)
      if(idx > -1)
        lightshows.splice(idx, 1)      
      return {
        ...state,
        startedLightshows: lightshows,
        endedLightshow: action.data,        
        isLoading: false
      }
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        curPage: action.data,
        isLoading: false
      }
    case 'STARTED_USER_LIGHTSHOW': 
      return {
        ...state,
        startLightshowUser: true,
        isLoading: false
      }
      case 'END_USER_LIGHTSHOW': 
        return {
          ...state,
          startLightshowUser: false,
          isLoading: false
        }
    default:
      return state;
  }
}
