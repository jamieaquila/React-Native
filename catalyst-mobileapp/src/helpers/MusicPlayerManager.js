import StreamingKit from 'react-native-streamingkit';
import { Alert, NativeModules, Linking } from 'react-native';
const { SpotifyManager } = NativeModules;
import MusicControl from 'react-native-music-control';

import { setState } from '../actions/MusicPlayerActions';
import { setStyle as setStatusBarStyle } from '../actions/StatusBarActions'

import SafariView from 'react-native-safari-view';

export const getStreamType = (track) => {
  if (!track.audioUrl && track.spotifyTrackUrl) return 'spotify';
  return 'stream';
}

export const play = (dispatch, musicPlayer, track, user) => {
  const { streamTypem, currentTrack } = musicPlayer;

  // Check if should resume or play track
  const shouldResume = currentTrack === track.id && musicPlayer.state === 'paused';
  if (shouldResume) return resume(dispatch, musicPlayer);

  // To avoid streams playing over eachother
  pause(dispatch, musicPlayer, false);

  // Update music controls for the first time
  MusicControl.setNowPlaying({
    elapsedTime: 0,
    state: MusicControl.STATE_PLAYING,
		title: track.name,
		artwork: track.imageUrl,
		artist: track.artist,
		album: track.album.name,
		duration: track.duration, // (Seconds)
		color: 0xFFFFFF, // Notification Color - Android Only
	});

  switch(getStreamType(track)) {
    case 'spotify':
      SpotifyManager.playUri(track.spotifyTrackUrl, err => {
        if(!err) dispatch(setState('playing'));
        else {
          Alert.alert(
            'Uh oh',
            'A Spotify Premium membership is required to stream this track.',
            [
              { text: 'Try Premium', onPress: () => openSpotifyPremium(dispatch) },
              { text: 'Okay' }
            ]
          );
        }
      });
    break;

    case 'stream':
      StreamingKit.play(track.audioUrl);
    break;
  }
}

export const pause = (dispatch, musicPlayer, updatePlayback = true) => {
  const { streamType } = musicPlayer;

  // Update controls
  if (updatePlayback) {
    getPosition(dispatch, musicPlayer)
      .then(pos => {
        MusicControl.updatePlayback({
          state: MusicControl.STATE_PAUSED,
          elapsedTime: pos
        });
      });
  }

  // Update stream
  if(streamType === 'spotify') {
    SpotifyManager.pause();
    dispatch(setState('paused'));
  }
  else {
    StreamingKit.pause();
  }
}

export const resume = (dispatch, musicPlayer) => {
  const { streamType } = musicPlayer;

  MusicControl.updatePlayback({
    state: MusicControl.STATE_PLAYING
  });

  switch(streamType) {
    case 'spotify':
      SpotifyManager.resume();
      dispatch(setState('playing'));
    break;

    case 'stream':
      StreamingKit.resume();
    break;
  }
}

export const getPosition = (dispatch, musicPlayer) => {
  return new Promise((resolve, reject) => {
    const { streamType } = musicPlayer;

    switch(streamType) {
      case 'spotify':
        SpotifyManager.getPosition(pos => {
          resolve(pos);
        });
      break;

      case 'stream':
        StreamingKit.getProgress((err, progress) => {
          if (err) return reject(err);
          resolve(progress);
        });
      break;
    }
  })
}

export const seekTo = (dispatch, musicPlayer, time) => {
  const { streamType } = musicPlayer;

  MusicControl.updatePlayback({
    elapsedTime: time
  });

  switch(streamType) {
    case 'spotify':
      SpotifyManager.seekTo(time);
    break;

    case 'stream':
      StreamingKit.seekToTime(time);
    break;
  }
}

const openSpotifyPremium = (dispatch) => {
  const url = 'https://www.spotify.com/us/purchase/panel/?ref=buzznog';

  SafariView.isAvailable()
		.then(() => {
			SafariView.show({ url, fromBottom: true });
			SafariView.addEventListener("onShow", () => dispatch(setStatusBarStyle('default')));
			SafariView.addEventListener("onDismiss", () => {
        dispatch(setStatusBarStyle('light-content'));
        setTimeout(() => {
          Alert.alert('Spotify Notice', 'If your spotify membership has recently changed, it may take a few mintues to take affect in the app. You may need to restart the app.');
        }, 2000);
      });
		})
		.catch(() => Linking.openURL(url));
}