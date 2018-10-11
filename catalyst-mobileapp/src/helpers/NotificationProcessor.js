import {Platform} from 'react-native';
import { findOneMessageThread, findOneFeedItem, startLightshow } from '../actions/DeeplinkActions';

export function processNotification(dispatch, notif){
    if (Platform.OS === 'android') {
      var deeplink = notif.deeplink;
      var content = notif.deeplinkContent;
      if(deeplink === "message") {
        try {
          var contentObj =  JSON.parse(content);
          if(contentObj.messageThreadId) {
            dispatch(findOneMessageThread(contentObj.messageThreadId));
          }

        }catch(error) {
          console.log(error);
        }
      }else if(deeplink === "exclusiveContent") {
        try {
          var contentObj =  JSON.parse(content);
          if(contentObj.feedItemId) {
            dispatch(findOneFeedItem(contentObj.feedItemId));
          }

        }catch(error) {
          console.log(error);
        }
      }else if(deeplink === "lightshow") {
        dispatch(startLightshow());
      }

    } else {
      var deeplink = notif.deeplink;
      var content = notif.deeplinkContent;
      if(deeplink === "message") {
        try {
          var contentObj =  content;
          if(contentObj.messageThreadId) {
            dispatch(findOneMessageThread(contentObj.messageThreadId));
          }

        }catch(error) {
          console.log(error);
        }
      }else if(deeplink === "exclusiveContent") {
        try {
          var contentObj =  content;
          if(contentObj.feedItemId) {
            dispatch(findOneFeedItem(contentObj.feedItemId));
          }

        }catch(error) {
          console.log(error);
        }
      }else if(deeplink === "lightshow") {
        dispatch(startLightshow());
      }

    
    }
}
