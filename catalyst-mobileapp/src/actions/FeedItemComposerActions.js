import { AsyncStorage, Image } from 'react-native';
import { app, api } from '../config';

import ImageResizer from 'react-native-image-resizer';

import { getFeeds } from './FeedActions';

import RNFetchBlob from 'react-native-fetch-blob';

export function setMessage(message) {
	return {
		type: 'FEED_ITEM_COMPOSER_SET_MESSAGE',
		payload: {
			message
		}
	}
}

export function setMedia(media) {
	return (dispatch, getState) => {
		switch (media.type) {
			case 'image':
				ImageResizer.createResizedImage(media.url, 1080, 1080, 'JPEG', 90)
				.then((resizedImageUri) => {
					Image.getSize(resizedImageUri, (width, height) => {
						media.url = resizedImageUri;
						dispatch({
							type: 'FEED_ITEM_COMPOSER_SET_MEDIA',
							payload: {
								media: {...media, ...{width, height}}
							}
						});
					});
				})
				.catch(err => console.log(err));
				break;
			case 'video':
				dispatch({
					type: 'FEED_ITEM_COMPOSER_SET_MEDIA',
					payload: {
						media
					}
				});
				break;
		}
	}
}

export function deleteMedia() {
	return {
		type: 'FEED_ITEM_COMPOSER_DELETE_MEDIA',
	}
}

export function created() {
	return { type: 'FEED_ITEM_COMPOSER_CREATED' }
}

export function create() {
	var action = (dispatch, getState) => {
		var feedItem = getState().feedItemComposer;

		AsyncStorage.getItem('auth').then(authString => {
			var auth = JSON.parse(authString);

			var mediaFileName = "video.mp4";
			var mediaFileType  = "video/mp4";
			switch(feedItem.media.type){
				case "image":
					mediaFileType = 'image/jpeg';
					mediaFileName = 'photo.jpg';
				break;
				case "video": {
					var subStr =feedItem.media.url.split('ext=');
					if(subStr.length >0) {
						let extension = subStr[subStr.length-1];	
						let lowercase = extension.toLowerCase();
						
						if(lowercase == 'mov')
							mediaFileType = 'video/quicktime';
						else if(lowercase == '3gp')
							mediaFileType = 'video/3gpp';
						else if(lowercase == 'wmv')
							mediaFileType = 'video/x-ms-wmv';
						else if(lowercase == "avi")
							mediaFileType = 'video/x-msvideo';
						else if(lowercase == "flv")
							mediaFileType = 'video/x-flv';	
						mediaFileName = 'video.'+lowercase;

						
					}else {
						mediaFileType = 'video/mp4';
						mediaFileName = 'video.mp4';
					}
				}
				break;
			}

			var request = {
				url: api.baseURL + '/Apps/' + app.id + '/FeedItems',
				method: 'post'
			}
			dispatch({ type: 'FEED_ITEM_COMPOSER_CREATE' });

		  RNFetchBlob
		  	.config({timeout: 60000})
		  	.fetch(request.method , request.url, {
		  	'Accept' : 'application/json',
		  	'Content-Type' : 'multipart/form-data',
		    Authorization : (auth) ? 'Bearer ' + auth.accessToken : ''
    		  }, [
    		{ name : 'data', data : JSON.stringify(feedItem)},
		    { name : 'file', filename : mediaFileName, type: mediaFileType, data: RNFetchBlob.wrap(feedItem.media.url)}

		  ]).then((res) => {
		  		var payload = res.data;
				dispatch({ type: 'FEED_ITEM_COMPOSER_CREATE_SUCCESS', payload });
				dispatch(getFeeds());			
		  }).catch((error) => {
				dispatch({ type: 'FEED_ITEM_COMPOSER_CREATE_ERROR' });
				// console.warn(error);

				return false;
		  });
		})
		.catch(err => console.log(err));
	}

	return action;
}

export function clear() {
	return { type: 'FEED_ITEM_COMPOSER_CLEAR' }
}
