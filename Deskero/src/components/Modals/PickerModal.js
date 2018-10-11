import React, { Component } from 'react';
import { 
    StyleSheet, 
    Image, 
    View, 
    Text, 
    TouchableOpacity,
    Modal,
    Platform,
    Animated,
    Picker,
    TouchableHighlight,
} from 'react-native'
import { Images, Metrics, Locale } from '../../themes'

export default class PickerModal extends Component {
    constructor(props) {
        super(props);       
    }

    componentDidMount() {
        Animated.timing(this.props.offSet, {
           duration: 300,
           toValue: 0
         }).start()
    }

    closeModal() {
        Animated.timing(this.props.offSet, {
           duration: 300,
           toValue: Metrics.screenHeight
        }).start(this.props.closeModal);
    }

    done(){
        Animated.timing(this.props.offSet, {
            duration: 300,
            toValue: Metrics.screenHeight
         }).start(this.props.done);
    }

    getTemplateList(){
        let templateArr = this.props.items.map((item, i) => {
            return (                           
                <Picker.Item
                    key={i}
                    value={item.title}
                    label={item.title}
                />
            )
        })
        return templateArr        
    }

    render() {
        return (
            <Modal
                ref={ref => this.modal = ref}
                animationType="fade"
                transparent={true}
                visible={true}
                onRequestClose={() => {console.log("Modal has been closed.")}}>
                <View style={{flex: 1, alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.3)'}}>
                    <Animated.View style={{ transform: [{translateY: Platform.OS == 'ios' ? 300 : 270 * Metrics.scaleHeight}], backgroundColor:'white' }}                  
                        >
                        <View style={styles.closeButtonContainer}>
                            <TouchableHighlight onPress={() => this.closeModal() } underlayColor="transparent" style={[styles.closeButton, {alignItems:'flex-start'}]}>
                                <Text style={styles.closeButtonText}>{Locale.t('CANCEL')}</Text>
                            </TouchableHighlight>
                            <View style={{width:'60%'}} />
                            <TouchableHighlight onPress={() => this.done() } underlayColor="transparent" style={[styles.closeButton, {alignItems:'flex-end'}]}>
                                <Text style={styles.closeButtonText}>{Locale.t('DONE')}</Text>
                            </TouchableHighlight>
                        </View>
                        <Picker
                            selectedValue={this.props.selectedTemplate}
                            onValueChange={(item) => this.props.changeTemplate(item)}>
                            {this.getTemplateList()}
                        </Picker>
                    </Animated.View>  
                </View>
            </Modal>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 60
    },
    showtimeContainer: {
        borderTopColor: '#ededed', 
        borderTopWidth:1
    },
    showtime: {
        padding:20, 
        textAlign: 'center'
    },
    button: {
        marginTop:25, 
        marginBottom:25
    },
    closeButtonContainer: {
        flexDirection: 'row', 
        width:'100%',
        justifyContent: 'center',
        alignItems:'center', 
        borderTopColor: '#e2e2e2', 
        borderTopWidth: 1, 
        borderBottomColor: '#e2e2e2', 
        borderBottomWidth:1
    },
    closeButton: {
        padding:10, 
        width:'20%'
    },
    buttonText: {
        textAlign: 'center'
    },
    closeButtonText: {
        color: '#027afe'
    },
    
});