import React, { Component } from 'react';
import { 
    StyleSheet, 
    Image, 
    View, 
    Text, 
    TouchableOpacity,
    Modal,
    Picker,
    Platform 
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
import Button from 'apsl-react-native-button'
import DialogBox from 'react-native-dialogbox'
import { Metrics, Images } from '../../themes'



export default class SetTimeModal extends Component {
    constructor(props){
        super(props);          
        this.state = {
            startTime:{
                hour: this.props.data.start.h != '' ? this.props.data.start.h : '1',
                min: this.props.data.start.m != '' ? this.props.data.start.m : '00',
                state: this.props.data.start.state != '' ? this.props.data.start.state : 'AM'
            },
            endTime: {
                hour: this.props.data.end.h != '' ? this.props.data.end.h : '1',
                min: this.props.data.end.m != '' ? this.props.data.end.m : '00',
                state: this.props.data.end.state != '' ? this.props.data.end.state : 'AM'
            }                
        }
    }

    showDialogBox(msg){
        this.dialogbox.tip({
            title:'Whoops!',
            content: msg,
            btn :{
                text:'OK'
            }
        })
    }

    checkStartAndEndTimeStatus(){
        if(this.state.startTime.state == this.state.endTime.state){
            if(parseInt(this.state.startTime.hour) < parseInt(this.state.endTime.hour)){
                return true
            }else if(parseInt(this.state.startTime.hour) == parseInt(this.state.endTime.hour)){
                if(parseInt(this.state.startTime.min) < parseInt(this.state.endTime.min)){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        }else{
            if(this.state.startTime.state == 'PM' && this.state.endTime.state == 'AM'){
                return false
            }else{
                return true
            }
        }
    }

    renderTimeItems(){
        let pickerItems = []
        for(var i = 1 ; i < 13 ; i++){
            let val = i.toString()
            pickerItems.push(
                <Picker.Item key={i} label={val} value={val} />
            )
        } 
        return pickerItems
    }

    renderMinItems(){
        let pickerItems = []
        for(var i = 0 ; i < 60 ; i++){
            let val = ""
            if(i < 10) val = "0" + i.toString()
            else val = i.toString()

            pickerItems.push(
                <Picker.Item key={i} label={val} value={val} />
            )
        }
        return pickerItems
    }

    renderStateItems() {
        let pickerItems = []
        pickerItems.push(
            <Picker.Item key={0} label={"AM"} value={"AM"} />
        )
        pickerItems.push(
            <Picker.Item key={1} label={"PM"} value={"PM"} />
        )
        return pickerItems
    }

    render() {       
        return(
            <Modal
                ref={ref => this.modal = ref}
                animationType="fade"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {console.log("Modal has been closed.")}}
                >
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={{paddingTop:19 * Metrics.scaleHeight, fontSize:17, color:'rgba(2, 6, 33, 0.9)', fontWeight:'600'}}>{this.props.status == 1 ? 'Set Start Time' : 'Set End Time'} </Text>
                        <View style={styles.pickerBody}>
                            <View style={[{width:'30%'}, Platform.OS == 'android' && {width: '33.33%'}]}>
                                <Picker
                                    selectedValue={this.props.status == 1 ? this.state.startTime.hour : this.state.endTime.hour}                                    
                                    onValueChange={(value, index) => {
                                        let timeObj;
                                        if(this.props.status == 1){
                                            timeObj = this.state.startTime
                                            timeObj.hour = value
                                            this.setState({startTime: timeObj})
                                        }else{
                                            timeObj = this.state.endTime
                                            timeObj.hour = value
                                            this.setState({endTime: timeObj})
                                        }
                                    }}
                                    >
                                    {
                                        this.renderTimeItems()
                                    }
                                </Picker>
                            </View>
                            
                            <View style={[{width:'30%'}, Platform.OS == 'android' ? {width: '33.33%'} : {paddingLeft: '5%'}]}>
                                <Picker
                                    selectedValue={this.props.status == 1 ? this.state.startTime.min : this.state.endTime.min}                                    
                                    onValueChange={(value, index) => {
                                        let timeObj
                                        if(this.props.status == 1){
                                            timeObj = this.state.startTime
                                            timeObj.min = value
                                            this.setState({startTime: timeObj})
                                        }else {
                                            timeObj = this.state.endTime
                                            timeObj.min = value
                                            this.setState({endTime : timeObj})
                                        }                                        
                                    }}
                                    >
                                    {
                                        this.renderMinItems()
                                    }
                                </Picker>
                            </View>
                            
                            <View style={[{width:'30%'}, Platform.OS == 'android' ? {width: '33.33%'} : {paddingLeft: '5%'}]}>
                                <Picker
                                    selectedValue={this.props.status == 1 ? this.state.startTime.state : this.state.endTime.state}                                    
                                    onValueChange={(value, index) => {
                                        let timeObj
                                        if(this.props.status == 1){
                                            timeObj = this.state.startTime
                                            timeObj.state = value
                                            this.setState({startTime: timeObj})
                                        }else {
                                            timeObj = this.state.endTime
                                            timeObj.state = value
                                            this.setState({endTime: timeObj})
                                        }
                                    }}
                                    >
                                    {
                                        this.renderStateItems()
                                    }
                                </Picker>
                            </View>
                        </View>
                        
                        <View style={{paddingTop:20 * Metrics.scaleHeight}} />

                        <View style={styles.btnBody}>
                            <TouchableOpacity style={[styles.button, {backgroundColor:'#3d3bee'}]} onPress={() => {
                                let data = {}
                                if(this.props.status == 1){
                                    if(this.checkStartAndEndTimeStatus()){
                                        data = {
                                            h: this.state.startTime.hour,
                                            m: this.state.startTime.min,
                                            state: this.state.startTime.state
                                        }
                                        this.props.closeModal(true, this.props.status, data)
                                    }else{
                                        this.showDialogBox("The end time can't be equal or less than the start time.")
                                    }    
                                }else{
                                    
                                    if(this.checkStartAndEndTimeStatus()){
                                        data = {
                                            h: this.state.endTime.hour,
                                            m: this.state.endTime.min,
                                            state: this.state.endTime.state
                                        }
                                        this.props.closeModal(true, this.props.status, data)
                                    }else{
                                        this.showDialogBox("The end time can't be equal or less than the start time.")
                                    }                                    
                                }
                            }}>
                                <Text style={{fontSize:16, color:'#fff'}}>Set</Text>
                            </TouchableOpacity>
                            <View style={{width:'10%'}} />
                            <TouchableOpacity style={[styles.button, {borderColor:'rgba(87, 99, 112, 0.3)', borderWidth:1}]} onPress={() => {   
                                this.props.closeModal(false, this.props.status, null)
                            }}>
                                <Text style={{fontSize:16, color:'rgba(2, 6, 33, 0.4)'}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <DialogBox ref={dialogbox => {this.dialogbox = dialogbox}} />
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,  
        backgroundColor:'rgba(0,0,0,0.3)',
        alignItems:'center',
        justifyContent:'center'
    },    
    content:{    
        width:'90%',
        height: Platform.OS == 'ios' ? '50%' : '30%',       
        backgroundColor:'#fff',
        borderRadius:10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems:'center'
    },    
    pickerBody: {
        flexDirection:'row',
        paddingHorizontal:20,
        width:'100%'
    },
    btnBody: {
        flexDirection:'row',
        paddingHorizontal: 19,
        width:'100%'
    },
    button: {
        height: 50 * Metrics.scaleHeight,
        width:'45%',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'       
    }
})