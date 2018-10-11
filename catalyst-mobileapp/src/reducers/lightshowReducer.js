const defaultState = {
	lightshowDetails: [],
	lightshowColors: [],
	lightshowDetail:undefined,
	lightshowLocation: undefined,	
	lightshowColor: undefined,
	lightshowTrigger: undefined,
	backPage: 0,
	isLoading: false,
	isRefreshing: false,
	changeLightshowTitle: false,
	curPage: '',
	invidialChange: false	
};

export default function lightshowReducer(state = defaultState, action) {
	switch(action.type) {		
		case 'LIGHTSHOW_GET_DETAILS':
		case 'CREATE_LIGHTSHOW_LOCATION':
		case 'CREATE_LIGHTSHOW_COLOR':
		case 'LIGHTSHOW_GET_LOCATION':
		case 'CREATE_LIGHTSHOW_DETAIL':
		case 'DELETE_LIGHTSHOW_DETAIL':
		case 'UPDATE_LIGHTSHOW_LOCATION':
		case 'UPDATE_LIGHTSHOW_DETAIL':
		case 'BENGIN_LIGHTSHOW':
		case 'DUPLICATE_LIGHTSHOW_DETAIL':
			return {
				...state,
				isLoading: true
			}		
		case 'UPDATE_LIGHTSHOW_COLORS':
			return {
				...state,
				lightshowColors: [],
				isLoading: true
			}
		case 'LIGHTSHOW_GET_DETAILS_FAILURE':
		case 'LIGHTSHOW_GET_COLORS_FAILURE':
		case 'CHANGE_LIGHTSHOW_TITLE_FAILURE':
		case 'CREATE_LIGHTSHOW_LOCATION_FAILURE':
		case 'CREATE_LIGHTSHOW_COLOR_FAILURE':
		case 'LIGHTSHOW_GET_LOCATION_FAILURE':
		case 'CREATE_LIGHTSHOW_DETAIL_FAILURE':
		case 'DELETE_LIGHTSHOW_DETAIL_FAILURE':
		case 'UPDATE_LIGHTSHOW_LOCATION_FAILURE':
		case 'UPDATE_LIGHTSHOW_DETAIL_FAILURE':
		case 'BENGIN_LIGHTSHOW_FAILURE':
		case 'UPDATE_LIGHTSHOW_COLORS_FAILURE':
		case 'DUPLICATE_LIGHTSHOW_DETAIL_FAILURE':
		case 'CHANGE_LIGHTSHOW_TITLE_FAILURE':
			return { 
				...state, 
				isLoading: false, 
				isRefreshing: false 
			}
		case 'LIGHTSHOW_GET_DETAILS_SUCCESS':
			// console.log(action.data)
			return {
				...state,
				lightshowDetails: action.data,
				isLoading: false,
				isRefreshing: false
			}
		case 'LIGHTSHOW_GET_COLORS_SUCCESS':	
			return {
				...state,
				curPage:'chooseOption',
				lightshowColors: action.data.sort(function(a, b){return a.order - b.order}),
				isLoading: false,
				isRefreshing: false
			}
		case 'LIGHTSHOW_GET_LOCATION_SUCCESS':
			return {
				...state,
				lightshowLocation: action.data,
				isLoading: false,
				isRefreshing: false
			}
		case 'CREATE_LIGHTSHOW_LOCATION_SUCCESS':
			return {
				...state,
				curPage:'location',
				lightshowLocation:action.data,
				isLoading: false, 
				isRefreshing: false 
			}	
		case 'UPDATE_LIGHTSHOW_LOCATION_SUCCESS':
			console.log(action.data)
			return {
				...state,		
				curPage:'location',
				lightshowLocation:action.data,		
				isLoading: false, 
				isRefreshing: false 
			}	
		case 'CREATE_LIGHTSHOW_COLOR_SUCCESS':
			return {
			  ...state,
			  lightshowColor: action.data,
			  backPage: 0,
			  curPage:'chooseColor',
			  isLoading: false,
			  isRefreshing: false
			}		
		case 'DUPLICATE_LIGHTSHOW_DETAIL_SUCCESS':
			let arr1 = state.lightshowDetails.slice()
			arr1.push(action.data)
			return {
				...state,
				lightshowDetails: arr1,
				isLoading: false,
				isRefreshing: false
			}		
		case 'UPDATE_LIGHTSHOW_COLORS_SUCCESS':
			// console.log('result : ', action.data)
			return {
				...state,
				lightshowColors: action.data.sort(function(a, b){return a.order - b.order}),
				invidialChange: true,
				isLoading: false,
				isRefreshing: false
			}				
		case 'CREATE_LIGHTSHOW_DETAIL_SUCCESS':
			let arr = state.lightshowDetails.slice()
			arr.push(action.data)
			return {
				...state,
				lightshowDetails: arr,
				lightshowDetail: action.data,
				isLoading: false,
				isRefreshing: false
			}
		case 'UPDATE_LIGHTSHOW_DETAIL_SUCCESS':
			let updateDetails = state.lightshowDetails.slice()
			for(var i = 0 ; i < updateDetails.length; i++){
				if(updateDetails[i].id == action.data.id){
					updateDetails[i] = action.data
					break;
				}
			}
			return {
				...state,
				curPage:'chooseColor',
				lightshowDetail: action.data,
				lightshowDetails: updateDetails,
				isLoading: false,
				isRefreshing: false
			}
		case 'CHANGE_LIGHTSHOW_TITLE_SUCCESS':
			// console.log(action.data)
			let changeDetails = state.lightshowDetails.slice()
			for(var i = 0 ; i < changeDetails.length; i++){
				if(changeDetails[i].id == action.data.id){
					changeDetails[i] = action.data
					break;
				}
			}
			return {
				...state,
				lightshowDetails: changeDetails,
				isLoading: false,
				isRefreshing: false
			}
		case 'DELETE_LIGHTSHOW_DETAIL_SUCCESS':
			let details = []
			for(var i = 0 ; i < state.lightshowDetails.length; i++){
				if(state.lightshowDetails[i].id != action.data.id){
					details.push(state.lightshowDetails[i])					
				}			
			}						
			return {
				...state,
				lightshowDetails: details,
				isLoading: false,
				isRefreshing: false
			}		
		case 'BENGIN_LIGHTSHOW_SUCCESS':
			return {
				...state,
				backPage:0,
				curPage: action.realData.page,
				lightshowTrigger: action.realData.data,				
				isLoading: false,
				isRefreshing: false
			}	
		case 'END_LIGHTSHOW_SUCCESS':
			return {
				...state,
				lightshowDetail:undefined,
				lightshowLocation: undefined,	
				lightshowColor: undefined,
				lightshowTrigger: undefined,
				changeLightshowTitle: false,
				curPage: '',
				isLoading: false,
				isRefreshing: false
			}
		case 'INITIAL_LIGHTSHOW_LOCATION':
			return {
				...state,
				curPage: '',
				lightshowLocation: undefined,
				lightshowDetail: undefined,
				isLoading: false,
				isRefreshing: false
			}
		case 'INITIAL_LIGHTSHOW_COLOR':
			return {
				...state,
				lightshowColor: undefined,
				lightshowColors: [],
				curPage:'location',
				backPage: action.data,
				changeLightshowTitle: false,
				isLoading: false,
				isRefreshing: false
			}
		case 'INITIAL_ALL_DATA':
			return {
				...state,
				lightshowDetail:undefined,
				lightshowLocation: undefined,	
				lightshowColor: undefined,	
				changeLightshowTitle: false,
				curPage:'',
				backPage: action.data,		
				isLoading: false,
				isRefreshing: false
			}
		case 'DELETE_LIGHTSHOW_COLOR':			
			return {
				...state,
				lightshowColors: action.data,
				isLoading: false,
				isRefreshing: false
			}
		case 'CHANGE_COLORS_ORDER':			
			return {
				...state,
				lightshowColors: action.data,
				isLoading: false,
				isRefreshing: false
			}		
		case 'INIT_INVIDIAL_STATE': {
			return {
				...state,
				invidialChange: false,
				isLoading: false,
				isRefreshing: false
			}
		}
		default:
			return state;
	}
}