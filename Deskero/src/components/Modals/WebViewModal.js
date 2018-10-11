import React, { Component } from 'react';
import { 
    StyleSheet, 
    Image, 
    View, 
    Text, 
    TouchableOpacity,
    Modal,
    WebView 
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
import Button from 'apsl-react-native-button'


export default class WebViewModal extends Component {
    constructor(props){
        super(props);
            
        
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));        
    }

    onNavigatorEvent(event) {
        if(event.id === 'back'){
            this.props.navigator.dismissModal({
                animationType: 'slide-down'
            });
        }
    }  

    render() {
        return(       
            <View style={styles.container}>
                <WebView source={{uri: this.props.link}} />
            </View>
       
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,    
        backgroundColor: '#f5f5f5',
    },    
})