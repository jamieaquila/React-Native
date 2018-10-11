'use strict'

import React, { Component } from 'react'
import  { 
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    ListView,
    ScrollView,
    TextInput
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Button from 'apsl-react-native-button'

import { Metrics, Images } from '../../themes'

export default class TypeOfOilScreen extends Component{   
    constructor(props){
        super(props)

        this.state = {
            selectOption:'',
            date: this.props.date,
            time: this.props.time,
            location: this.props.location,
            vehicle: this.props.vehicle
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        
    }
    onNavigatorEvent(event){
        if(event.id === 'back'){
            this.props.navigator.pop()
        }
    }

    goToAppointmentScreen(){     
        // console.log(this.state.selectOption)           
        this.props.navigator.push({
            title: "Your Appointment",            
            screen: "mechaniku.AppointmentScreen",   
            passProps: {
                status: 'confirm',
                date: this.state.date,
                time: this.state.time,
                location: this.state.location,
                vehicle: this.state.vehicle,
                selectOption: this.state.selectOption
            },         
            navigatorStyle:{
                navBarHidden: false,
                navBarBackgroundColor:'rgba(248,248,248,0.82)',
                navBarNoBorder:true,
                navBarTitleTextCentered:true
            },
            navigatorButtons: {
                leftButtons: [
                    {
                        id:'back',
                        icon: Images.backBtnIcon
                    }
                    
                ]
            }
        })
    }


    renderBrands(){
        let brands = this.state.brands.map((brand, i) => {
            return (
                <TouchableOpacity 
                    key={i}
                    style={[styles.brand, i > 0 ? this.state.selectedBrandIdx == i ? {marginLeft:10 * Metrics.scaleWidth, borderColor:'#53AAF3', borderWidth:2} : {marginLeft:10 * Metrics.scaleWidth} : this.state.selectedBrandIdx == i ? {borderColor:'#53AAF3', borderWidth:2} : {}]}
                    onPress={() => {
                        this.setState({selectedBrandIdx: i})
                    }}>
                    <Image style={{width: brand.height * Metrics.scaleHeight * brand.scale, height: brand.height * Metrics.scaleHeight}} source={brand.img}/>
                </TouchableOpacity>
            )
        })
        return brands
    }

    render() {
        return (
            <View style={styles.container}> 
                <View style={[styles.content, {}]}>
                    <View style={{paddingTop:15 * Metrics.scaleHeight}} />

                    <TouchableOpacity style={[styles.optionView, this.state.selectOption == 'standard' ? {borderColor:'#53AAF3', borderWidth:2} : {}]}
                            onPress={() => {
                                this.setState({selectOption: 'standard'})
                            }}
                        >
                        <Text style={{fontSize:34, color:'rgb(0,0,0)', paddingTop:6, textAlign:'center'}}>Standard</Text>
                        <Text style={{fontSize:34, color:'rgb(61, 59, 238)', fontWeight:'bold'}}>$60</Text>
                        
                    </TouchableOpacity>

                    <View style={{width:Metrics.screenWidth, paddingTop:15 * Metrics.scaleHeight}} />

                    <TouchableOpacity style={[styles.optionView, this.state.selectOption == 'premium' ? {borderColor:'#53AAF3', borderWidth:2} : {}]}
                            onPress={() => {
                                this.setState({selectOption: 'premium'})
                            }}
                        >
                        <Text style={{fontSize:34, color:'rgb(0,0,0)', paddingTop:6, textAlign:'center'}}>Premium</Text>            
                        <Text style={{fontSize:34, color:'rgb(61, 59, 238)', fontWeight:'bold'}}>$80</Text>
                    </TouchableOpacity>

                    <Button 
                        style={styles.confirmButton}
                        isDisabled={this.state.selectOption == '' ? true : false}
                        onPress={() => {
                            this.goToAppointmentScreen()
                        }}
                        >
                        <Text style={{fontSize:16, color:'#ffffff'}}>Confirm!</Text>
                    </Button>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,         
    },    
    content:{        
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor:'rgba(239, 241, 245, 0.74)',
        paddingHorizontal:16 * Metrics.scaleWidth
    }, 
    brand:{
        width:120 * Metrics.scaleHeight, 
        height:120 * Metrics.scaleHeight, 
        backgroundColor:'#ffffff',   
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,             
    },
    confirmButton:{        
        marginTop:44 * Metrics.scaleHeight,
        marginBottom:24 * Metrics.scaleHeight,
        marginHorizontal:22,
        height:50 * Metrics.scaleHeight,
        backgroundColor:'rgb(61, 59, 238)',
        borderWidth:0,
    },
    optionView: {
        marginLeft:4, 
        marginRight:4, 
        marginTop:16, 
        width:'100%', 
        height: 200 * Metrics.scaleHeight, 
        backgroundColor:'#ffffff', 
        borderRadius:10, 
        alignItems:'center', 
        justifyContent:'center'
    }
   
})