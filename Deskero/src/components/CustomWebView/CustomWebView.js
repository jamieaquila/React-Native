import React, { Component } from 'react';
import {
    Text,
    View,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
    StyleSheet,
    Dimensions,
    ScrollView,
    RefreshControl,
    Alert,
    Image,
    WebView
} from 'react-native'
// import Image from 'react-native-image-progress'
import { Avatar } from 'react-native-elements';
import UserAvatar from 'react-native-user-avatar';
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
// import WebViewBridge from 'react-native-webview-bridge'

import { Images, Metrics } from '../../themes'
import { GlobalVals  } from '../../global'

const injectedScript = function() {
    function waitForBridge() {
      if (window.postMessage.length !== 1){
        setTimeout(waitForBridge, 200);
      }
      else {
        let height = 0;
        if(document.documentElement.clientHeight>document.body.clientHeight)
        {
          height = document.documentElement.clientHeight
        }
        else
        {
          height = document.body.clientHeight
        }
        let data = 'height***' + height
        postMessage(data)
      }
    }
    waitForBridge();
    window.onclick = function(e) {
        e.preventDefault();
        let data ='link***' + e.target.href
        window.postMessage(data);
        e.stopPropagation()
    }   
};

const customStyle = "<style>* {max-width: 100%;} body {font-family: Helvetica Neue;}}</style>";

export default class CustomWebView extends Component {
    constructor(props){
        super(props);
        this.state = {
            webViewHeight: 20
        }
        this._onMessage = this._onMessage.bind(this);
    } 

    _onMessage(e) {
        let arr = e.nativeEvent.data.split('***')
        // console.log('hahahahahahahaha')
        if(arr[0] == 'height'){
            
            // console.log(arr[1])
            this.setState({
              webViewHeight: parseInt(arr[1])
            });
        }else if(arr[0] == 'link'){
            this.props.openURL(arr[1])
            // console.log(arr[1])
        }        
    }

    render() {    	   
        return (             
            <WebView
                ref={(ref) => { this.webview = ref }}    
                injectedJavaScript={'(' + String(injectedScript) + ')();'}
                // injectedJavaScript={injectedScript}
                onMessage={this._onMessage}
                javaScriptEnabled={true}
                automaticallyAdjustContentInsets={false}
                style={[this.props.styles, styles.webview, {height: this.state.webViewHeight}]}
                source={{html: this.props.html + customStyle}}                              
            />   
            
        );
    }

}

const styles = StyleSheet.create({ 
    webview: {
        backgroundColor:'transparent'
    }
})