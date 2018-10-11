import { NativeModules } from 'react-native';
import { shuffleArray } from '../helpers'
import StreamingKit from 'react-native-streamingkit';

import * as MusicPlayerManager from '../helpers/MusicPlayerManager';

const { SpotifyManager } = NativeModules;

const PlaybackType = {
	'STREAM': 0,
	'SPOTIFY': 1
};

const getPlaybackType = (track) => {
	if (!track.audioUrl && track.spotifyTrackUrl) return PlaybackType.SPOTIFY;
	return PlaybackType.STREAM;
}

const getStreamType = (track) => {
	return getPlaybackType(track) === PlaybackType.SPOTIFY ? 'spotify' : 'stream'; 
}

export function playTrack(targetTrack) {
	return (dispatch, getState) => {
		const { streamType } = getState().musicPlayer;
		dispatch({ type: 'MUSIC_PLAYER_PLAY_TRACK', streamType});

		MusicPlayerManager.play(dispatch, getState().musicPlayer, targetTrack, getState().user);

		dispatch({ 
			type: 'MUSIC_PLAYER_PLAY_TRACK', 
			album: false,
			track: targetTrack.id, 
			queue: getState().tracks.data.filter(track => !track.locked && Date.parse(track.releaseDate) < Date.now()).map(track => track.id),
			streamType: getStreamType(targetTrack)
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
		const { streamType } = getState().musicPlayer;
		dispatch({ type: 'MUSIC_PLAYER_PLAY_ALBUM', streamType });

		
		var targetTrack = targetAlbum.tracks.filter(track => !track.locked && Date.parse(track.releaseDate) < Date.now())[0];

		MusicPlayerManager.play(dispatch, getState().musicPlayer, targetTrack, getState().user);

		dispatch({ 
			type: 'MUSIC_PLAYER_PLAY_ALBUM',
			album: targetAlbum.id,
			track: targetTrack.id, 
			queue: targetAlbum.tracks.filter(track => !track.locked && Date.parse(track.releaseDate) < Date.now()).map(track => track.id),
			streamType: getStreamType(targetTrack)
		});
	}
}

export function playTrackInAlbum(targetTrack, targetAlbum) {
	return (dispatch, getState) => {
		const { streamType } = getState().musicPlayer;

		MusicPlayerManager.play(dispatch, getState().musicPlayer, targetTrack, getState().user);

		dispatch({ 
			type: 'MUSIC_PLAYER_PLAY_TRACK_IN_ALBUM', 
			album: targetAlbum.id,
			track: targetTrack.id, 
			queue: targetAlbum.tracks.filter(track => !track.locked && Date.parse(track.releaseDate) < Date.now()).map(track => track.id),
			streamType: getStreamType(targetTrack)
		});
	}
}

export function nextTrack(userPressed = true) {
	return (dispatch, getState) => {
		var { currentTrack, queue, streamType, state } = getState().musicPlayer;

		const paused = state === 'paused';
		var currentIndex = queue.indexOf(currentTrack);
		var nextIndex = currentIndex + 1;
		let targetTrackId;

		switch(getState().musicPlayer.repeatMode) {
			case 'none':
				targetTrackId = queue[nextIndex] || queue[0];
				break;

			case 'one':
				if(userPressed) targetTrackId = queue[nextIndex] || queue[0];
				else targetTrackId = queue[currentIndex];
				break;

			case 'all':
				targetTrackId = queue[nextIndex] || queue[0];
				break;
		}

		const targetTrack = getState().tracks.data.find(track => track.id === targetTrackId);
		MusicPlayerManager.play(dispatch, getState().musicPlayer, targetTrack, getState().user);
		
		// Stay paused
		if (paused) MusicPlayerManager.pause(dispatch, getState().musicPlayer);
		dispatch({ 
			type: 'MUSIC_PLAYER_NEXT_TRACK',
			targetTrack: targetTrackId,
			streamType: getStreamType(targetTrack)
		});
	}
}

export const previousTrack = () => async (dispatch, getState) => {
	const { musicPlayer } = getState();
	var { currentTrack, queue, streamType, state } = musicPlayer;

	const paused = state === 'paused';
	var currentIndex = queue.indexOf(currentTrack);
	var prevIndex = currentIndex - 1;

	// Check to restart song
	const pos = await MusicPlayerManager.getPosition(dispatch, musicPlayer);
	if (pos >= 2) return MusicPlayerManager.seekTo(dispatch, musicPlayer, 0);

	// Early in song, go back one
	const targetTrackId = queue[prevIndex] || queue[queue.length - 1];

	const targetTrack = getState().tracks.data.find(track => track.id === targetTrackId);
	MusicPlayerManager.play(dispatch, getState().musicPlayer, targetTrack, getState().user);
	
	// Stay paused
	if (paused) MusicPlayerManager.pause(dispatch, getState().musicPlayer);
	dispatch({ 
		type: 'MUSIC_PLAYER_PREVIOUS_TRACK',
		targetTrack: targetTrackId,
		streamType: getStreamType(targetTrack)
	});
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
		MusicPlayerManager.seekTo(dispatch, getState().musicPlayer, time);
	}
}

export function play(currentTime) {

	return (dispatch, getState) => {
		var { currentTrack } = getState().musicPlayer;
		var targetTrack = getState().tracks.data.find(track => track.id === currentTrack);

		MusicPlayerManager.play(dispatch, getState().musicPlayer, targetTrack, getState().user);
	}
}

export function pause() {
	return (dispatch, getState) => {
		var { currentTrack } = getState().musicPlayer
		var targetTrack = getState().tracks.data.find(track => track.id === currentTrack)

		MusicPlayerManager.pause(dispatch, getState().musicPlayer);
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