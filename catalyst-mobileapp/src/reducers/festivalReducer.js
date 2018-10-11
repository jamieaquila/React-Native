
const defaultState = {	
	isLoading: false,
	isRefreshing: false,
	festivalArtists:[],
	festivalArtistSetTimes: []
};

export default function festivalReducer(state = defaultState, action) {
	let artists = []
	let artistSetTimes = []
	switch(action.type) {
		case 'GET_FESTIVAL_ARTISTS':
		case 'CREATE_FESTIVAL_ARTIST_FAVORITE':
		case 'UPDATE_FESTIVAL_ARTIST_FAVORITE':
		case 'GET_FESTIVAL_ARTIST_SETTIME':
		case 'CREATE_FESTIVAL_ARTIST_SETTIME':
		case 'UPDATE_FESTIVAL_ARTIST_SETTIME':
		case 'CREATE_FESTIVAL_USER_SCHEDULE':
		case 'UPDATE_FESTIVAL_USER_SCHEDULE':
			return {
				...state,
				isLoading: true,
				isRefreshing: true
			}	
		
		case 'GET_FESTIVAL_ARTISTS_FAILURE':
		case 'CREATE_FESTIVAL_ARTIST_FAVORITE_FAILUE':
		case 'UPDATE_FESTIVAL_ARTIST_FAVORITE_FAILUE':
		case 'GET_FESTIVAL_ARTIST_SETTIME_FAILUE':
		case 'CREATE_FESTIVAL_ARTIST_SETTIME_FAILUE':
		case 'UPDATE_FESTIVAL_ARTIST_SETTIME_FAILUE':
		case 'CREATE_FESTIVAL_USER_SCHEDULE_FAILUE':
		case 'UPDATE_FESTIVAL_USER_SCHEDULE_FAILUE':
			return { 
				...state, 
				isLoading: false, 
				isRefreshing: false 
			}
		case 'GET_FESTIVAL_ARTISTS_SUCCESS':
			// console.log(action.data)
			return {
				...state,
				festivalArtists: action.data,
				isLoading: false,
				isRefreshing: false
			}	
		case 'CREATE_FESTIVAL_ARTIST_FAVORITE_SUCCESS':	
			artists = state.festivalArtists
			for(var i = 0 ; i < artists.length ; i++){
				if(artists[i].id == action.data.festivalArtistId){
					artists[i].festivalArtistFavorite.push(action.data)
					break
				}				
			}
			return {
				...state,	
				festivalArtists: artists,			
				isLoading: false,
				isRefreshing: false
			}	
		case 'UPDATE_FESTIVAL_ARTIST_FAVORITE_SUCCESS':		
			artists = state.festivalArtists
			for(var i = 0 ; i < artists.length ; i++){
				var flag = false
				for(var j = 0; j < artists[i].festivalArtistFavorite.length ; j++){
					if(artists[i].festivalArtistFavorite[j].id == action.data[0].id){
						artists[i].festivalArtistFavorite[j] = action.data[0]
						flag = true
						break
					}
					if(flag) break
				}		
			}
			return {
				...state,	
				festivalArtists: artists,			
				isLoading: false,
				isRefreshing: false
			}	
		case 'GET_FESTIVAL_ARTIST_SETTIME_SUCCESS':
			// console.log(action.data)
			return {
				...state,
				festivalArtistSetTimes: action.data,
				isLoading: false,
				isRefreshing: false
			}	
		case 'CREATE_FESTIVAL_ARTIST_SETTIME_SUCCESS':
			// console.log(action.data)
			return {
				...state,
				isLoading: false,
				isRefreshing: false
			}	
		case 'UPDATE_FESTIVAL_ARTIST_SETTIME_SUCCESS':
			// console.log(action.data)
			
			return {
				...state,
				isLoading: false,
				isRefreshing: false
			}	
		case 'CREATE_FESTIVAL_USER_SCHEDULE_SUCCESS':
			artistSetTimes = state.festivalArtistSetTimes
			for(var i = 0 ; i < artistSetTimes.length ; i++){
				if(artistSetTimes[i].id == action.data.festivalArtistSetTime){
					artistSetTimes[i].festivalUserSchedules.push(action.data)
					break;
				}
			}			
			return {
				...state,
				festivalArtistSetTimes: artistSetTimes,
				isLoading: false,
				isRefreshing: false
			}	

		case 'UPDATE_FESTIVAL_USER_SCHEDULE_SUCCESS':
			artistSetTimes = state.festivalArtistSetTimes
			for(var i = 0 ; i < artistSetTimes.length ; i++){
				let flag = false
				for(var j = 0 ; j < artistSetTimes[i].festivalUserSchedules.length ; j++){
					if(artistSetTimes[i].festivalUserSchedules[j].id == action.data[0].id){
						artistSetTimes[i].festivalUserSchedules[j] = action.data[0]
						flag = true
						break
					}
				}
				if(flag) break
			}
			return {
				...state,
				festivalArtistSetTimes: artistSetTimes,
				isLoading: false,
				isRefreshing: false
			}	
		default:
			return state;
	}
}