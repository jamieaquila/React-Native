import { shuffleArray } from '../helpers'
import StreamingKit from 'react-native-streamingkit';
import MusicControl from 'react-native-music-control';

function updateMusicControlTrack(targetTrack) {
	MusicControl.setNowPlaying({
		title: targetTrack.name,
		artwork: targetTrack.imageUrl,
		artist: targetTrack.artist,
		album: targetTrack.album.name,
		duration: targetTrack.duration, // (Seconds)
		color: 0xFFFFFF, // Notification Color - Android Only
	});
}

export function playTrack(targetTrack) {
	return (dispatch, getState) => {
		dispatch({ type: 'MUSIC_PLAYER_PLAY_TRACK'});
		StreamingKit.play(targetTrack.audioUrl);

		dispatch({ 
			type: 'MUSIC_PLAYER_PLAY_TRACK', 
			album: false,
			track: targetTrack.id, 
			queue: getState().tracks.data.filter(track => !track.locked && Date.parse(track.releaseDate) < Date.now()).map(track => track.id)
		});

		updateMusicControlTrack(targetTrack);
		MusicControl.updatePlayback({
			state: MusicControl.STATE_PLAYING
		});
	}
}

export function setState(state) {
	return {
		type: 'MUSIC_PLAYER_SET_STATE',
		state
	}
}

export function shuffleOn() {
	return (dispatch, getState) => {
		var { currentTrack, queue } = getState().musicPlayer;
		var currentIndex = queue.indexOf(currentTrack); 

		queue.splice(currentIndex, 1);
		var nextQueue = shuffleArray(queue);
		nextQueue.unshift(currentTrack);

		dispatch({
			type: 'MUSIC_PLAYER_SHUFFLE_ON',
			shuffle: true,
			queue: nextQueue
		})
	}
}

export function shuffleOff() {
	return (dispatch, getState) => {
		var { currentAlbum } = getState().musicPlayer;
		var tracks = getState().tracks.data;

		dispatch({
			type: 'MUSIC_PLAYER_SHUFFLE_OFF',
			shuffle: false,
			queue: (currentAlbum) ? tracks.find(album => album.id === currentAlbum).tracks.map(track => track.id) : tracks.filter(track => !track.locked && Date.parse(track.releaseDate) < Date.now()).map(track => track.id)
		})
	}
}

export function playAlbum(targetAlbum) {
	return (dispatch, getState) => {
		dispatch({ type: 'MUSIC_PLAYER_PLAY_ALBUM'});

		var targetTrack = targetAlbum.tracks.filter(track => !track.locked && Date.parse(track.releaseDate) < Date.now())[0];

		StreamingKit.play(targetTrack.audioUrl);
		dispatch({ 
			type: 'MUSIC_PLAYER_PLAY_ALBUM',
			album: targetAlbum.id,
			track: targetTrack.id, 
			queue: targetAlbum.tracks.filter(track => !track.locked && Date.parse(track.releaseDate) < Date.now()).map(track => track.id)
		});
	}
}

export function playTrackInAlbum(targetTrack, targetAlbum) {
	return (dispatch, getState) => {
		StreamingKit.play(targetTrack.audioUrl);

		dispatch({ 
			type: 'MUSIC_PLAYER_PLAY_TRACK_IN_ALBUM', 
			album: targetAlbum.id,
			track: targetTrack.id, 
			queue: targetAlbum.tracks.filter(track => !track.locked && Date.parse(track.releaseDate) < Date.now()).map(track => track.id)
		});
	}
}

export function nextTrack() {
	return (dispatch, getState) => {
		var { currentTrack, queue } = getState().musicPlayer;

		var currentIndex = queue.indexOf(currentTrack);
		var nextIndex = currentIndex + 1;

		switch(getState().musicPlayer.repeatMode) {
			case 'none':
				var targetTrackId = queue[nextIndex] || queue[0];
				var targetTrack = getState().tracks.data.find(track => track.id === targetTrackId)
				var paused = (!queue[nextIndex]);

				if (paused) {
					StreamingKit.play(targetTrack.audioUrl);
					StreamingKit.pause();
				} else {
					StreamingKit.play(targetTrack.audioUrl);
				}

				dispatch({ 
					type: 'MUSIC_PLAYER_NEXT_TRACK',
					targetTrack: targetTrackId,
				});
				updateMusicControlTrack(targetTrack);
				break;
			case 'one':
				var targetTrackId = queue[currentIndex];
				var targetTrack = getState().tracks.data.find(track => track.id === targetTrackId);

				StreamingKit.play(targetTrack.audioUrl);

				dispatch({ 
					type: 'MUSIC_PLAYER_NEXT_TRACK',
					targetTrack: targetTrackId,
				});
				updateMusicControlTrack(targetTrack);
				break;
			case 'all':
				var targetTrackId = queue[nextIndex] || queue[0];
				var targetTrack = getState().tracks.data.find(track => track.id === targetTrackId)

				StreamingKit.play(targetTrack.audioUrl);

				dispatch({ 
					type: 'MUSIC_PLAYER_NEXT_TRACK',
					targetTrack: targetTrackId,
				});
				updateMusicControlTrack(targetTrack);
				break;
		}

	}
}

export function previousTrack() {
	return (dispatch, getState) => {
		var { currentTrack, queue } = getState().musicPlayer;

		var currentIndex = queue.indexOf(currentTrack);
		var prevIndex = currentIndex - 1;

		switch(getState().musicPlayer.repeatMode) {
			case 'none':
				var targetTrackId = queue[prevIndex] || queue[0];
				var targetTrack = getState().tracks.data.find(track => track.id === targetTrackId)

				StreamingKit.play(targetTrack.audioUrl);
				updateMusicControlTrack(targetTrack);
				dispatch({ 
					type: 'MUSIC_PLAYER_PREVIOUS_TRACK',
					targetTrack: targetTrackId,
				});

				break;
			case 'one':
				var targetTrackId = queue[currentIndex];
				var targetTrack = getState().tracks.data.find(track => track.id === targetTrackId)

				StreamingKit.play(targetTrack.audioUrl);
				updateMusicControlTrack(targetTrack);
				dispatch({ 
					type: 'MUSIC_PLAYER_PREVIOUS_TRACK',
					targetTrack: targetTrackId,
				});

				break;
			case 'all':
				var targetTrackId = queue[prevIndex] || queue[queue.length - 1];
				var targetTrack = getState().tracks.data.find(track => track.id === targetTrackId)

				StreamingKit.play(targetTrack.audioUrl);
				updateMusicControlTrack(targetTrack);
				dispatch({ 
					type: 'MUSIC_PLAYER_PREVIOUS_TRACK',
					targetTrack: targetTrackId,
				});

				break;
		}

	}
}

export function nextRepeatMode() {
	return (dispatch, getState) => {
		switch (getState().musicPlayer.repeatMode) {
			case 'none':
				var repeatMode = 'all';
			break;
			case 'all':
				var repeatMode = 'one';
			break;
			case 'one':
				var repeatMode = 'none';
			break;
		}

		dispatch({
			type: 'MUSIC_PLAYER_SET_REPEAT_MODE',
			repeatMode
		});
	}
}

export function seekToTime(time) {
	return (dispatch, getState) => {
		StreamingKit.seekToTime(time);
		MusicControl.updatePlayback({
			elapsedTime: time
		});
	}
}

export function play(currentTime) {

	return (dispatch, getState) => {
		var { currentTrack } = getState().musicPlayer;
		var targetTrack = getState().tracks.data.find(track => track.id === currentTrack);

		MusicControl.updatePlayback({
			state: MusicControl.STATE_PLAYING
		});

		StreamingKit.getProgress((err, progress) => {

			if (!getState().musicPlayer.currentTrack || !progress) {

				StreamingKit.play(targetTrack.audioUrl);
			}
			else {
				StreamingKit.resume();
			}
		});


	}
}

export function pause() {
	return (dispatch, getState) => {
		var { currentTrack } = getState().musicPlayer
		var targetTrack = getState().tracks.data.find(track => track.id === currentTrack)

		StreamingKit.getProgress((err, progress) => {
		});

		StreamingKit.pause();

		MusicControl.updatePlayback({
			state: MusicControl.STATE_PAUSED
		});
	}
}

export function togglePlayback() {
	return (dispatch, getState) => {
		getState().musicPlayer.state == 'paused' ? dispatch(play()) : dispatch(pause());
	}
}

export function playAndShuffle() {
	return (dispatch, getState) => {
		var { queue, currentTrack } = getState().musicPlayer;
		var currentIndex = queue.indexOf(currentTrack); 

		// put the currentTrack at the end so we don't hear the same track when selecting shuffle
		queue.splice(currentIndex, 1);
		var nextQueue = shuffleArray(queue);
		nextQueue.push(currentTrack);

		var targetTrack = getState().tracks.data.find(track => track.id === nextQueue[0]);

		dispatch({
			type: 'MUSIC_PLAYER_PLAY_AND_SHUFFLE',
			currentAlbum: false,
			queue: nextQueue,
			track: nextQueue[0],
			shuffle: true
		})
	}
}

export function setInterruptionState(state) {
	return {
		type: 'MUSIC_PLAYER_SET_INTERRUPTED_STATE',
		state
	}
}

export function toggleMiniMode() {
	return (dispatch, getState) => {
		dispatch({
			type: 'MUSIC_PLAYER_TOGGLE_MINI_MODE',
			miniMode: !getState().musicPlayer.miniMode
		})
	}	
}