const defaultState = {
	currentAlbum	: false,
	currentTrack	: false,
	state					: 'paused',
	queue					: [],
	repeatMode		: 'none',
	shuffle				: false,
	wasInterrupted	: false,
	miniMode: false,
	streamType: null
};

export default function musicPlayerReducer(state = defaultState, action) {
	switch(action.type) {
		case 'MUSIC_PLAYER_PLAY_AND_SHUFFLE':
			return {
				...state,
				currentAlbum: action.album,
				currentTrack: action.track,
				queue: action.queue,
				shuffle: action.shuffle
			}
		case 'MUSIC_PLAYER_SHUFFLE_ON':
			return { 
				...state, 
				shuffle: action.shuffle,
				queue: action.queue
			}
		case 'MUSIC_PLAYER_SHUFFLE_OFF':
			return { 
				...state, 
				shuffle: action.shuffle,
				queue: action.queue
			}
			break;
		case 'MUSIC_PLAYER_PLAY_TRACK':
			return {
				...state,
				currentAlbum: action.album,
				currentTrack: action.track,
				queue: action.queue,
				streamType: action.streamType
			}
		case 'MUSIC_PLAYER_DID_SEEK':
			return { 
				...state, 
				shouldSeek: false
			}
		case 'MUSIC_PLAYER_PLAY_TRACK_IN_ALBUM':
			return {
				...state,
				currentAlbum: action.album,
				currentTrack: action.track,
				queue: action.queue,
				streamType: action.streamType
			}
		case 'MUSIC_PLAYER_PLAY_ALBUM':
			return {
				...state,
				currentAlbum: action.album,
				currentTrack: action.track,
				queue: action.queue,
				streamType: action.streamType
			}
		case 'MUSIC_PLAYER_NEXT_TRACK':
			return {
				...state,
				currentTrack: action.targetTrack,
				streamType: action.streamType
			}
		case 'MUSIC_PLAYER_PREVIOUS_TRACK':
			return {
				...state,
				currentTrack: action.targetTrack,
				streamType: action.streamType
			}
		case 'GET_TRACKS_SUCCESS':
			var unlockedTracks = action.data.filter(track => !track.locked && Date.parse(track.releaseDate) < Date.now()).map(track => track.id);
			var currentTrack = unlockedTracks.find(unlockedTrack => state.currentTrack === unlockedTrack);

			return {
				...state,
				currentTrack: currentTrack || false,
				queue: unlockedTracks
			}
		case 'MUSIC_PLAYER_SET_REPEAT_MODE':
			return {
				...state,
				repeatMode: action.repeatMode
			}
		case 'MUSIC_PLAYER_SET_STATE':
			return {
				...state,
				state: action.state
			}
		case 'MUSIC_PLAYER_SET_INTERRUPTED_STATE':
			return {
				...state,
				wasInterrupted: action.state,
			};
		case 'MUSIC_PLAYER_TOGGLE_MINI_MODE':
			return {
				...state,
				miniMode: action.miniMode
			}
		default:
			return state;
	}
}
