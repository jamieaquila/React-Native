'use strict'
import React, { Component} from 'react'

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
    ActivityIndicator,
    Image
  } from 'react-native'
// import Image from 'react-native-image-progress'
import { Avatar } from 'react-native-elements';
import UserAvatar from 'react-native-user-avatar';
import ProgressBar from 'react-native-progress/Circle'
import Button from 'apsl-react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import InfiniteScroll from 'react-native-infinite-scroll';

import { GlobalVals  } from '../../global'
import { Images, Metrics, Locale } from '../../themes'


export default class TicketMenus extends Component {
    constructor(props){
        super(props)
       
    }

   
    componentDidMount(){      
       
    }  

    render() {
        return (            
            <View style={[this.props.styles.content, {marginBottom:0}]}>
                <View style={{backgroundColor:'#fff'}}>
                    <TouchableOpacity style={this.props.styles.item} onPress={()=>{
                        this.props.selectMenuBtn('toReply')
                        }}>
                        <Text style={[this.props.styles.labelText, {color:'rgb(86, 85, 85)', width:'90%', backgroundColor:'transparent'}]}>{Locale.t('DASHBOARD.TICKETS_TO_REPLY')}</Text>
                        {
                            GlobalVals.user.role == 'AGENT' ?
                                <View style={[this.props.styles.badge, this.props.badges['tickets_toReply'] <= 0 && this.props.styles.badgeEmpty, this.props.badges['tickets_toReply'] >= 100 && this.props.styles.bigBadge]}>
                                    <Text style={this.props.styles.badgeText}>{this.props.badges['tickets_toReply']}</Text>
                                </View>
                            :
                                <View style={[this.props.styles.badge, this.props.badges['tickets_toReplyCustomer'] <= 0 && this.props.styles.badgeEmpty, this.props.badges['tickets_toReplyCustomer'] >= 100 && this.props.styles.bigBadge]}>
                                    <Text style={this.props.styles.badgeText}>{this.props.badges['tickets_toReplyCustomer']}</Text>
                                </View>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity style={this.props.styles.item} onPress={()=>{
                        this.props.selectMenuBtn('priority')                                              
                        }}>
                        <Text style={[this.props.styles.labelText, {color:'rgb(86, 85, 85)', width:'90%'}]}>{Locale.t('DASHBOARD.TICKETS_PRIORITY')}</Text>
                        <View style={[this.props.styles.badge, this.props.badges['tickets_priority'] <= 0 && this.props.styles.badgeEmpty, this.props.badges['tickets_priority'] >= 100 && this.props.styles.bigBadge]}>
                            <Text style={this.props.styles.badgeText}>{this.props.badges['tickets_priority']}</Text>
                        </View>
                    </TouchableOpacity>

                    {
                        GlobalVals.user.role == "AGENT" &&
                        <TouchableOpacity style={this.props.styles.item} onPress={()=>{
                            this.props.selectMenuBtn('topClients')                                                       
                            }}>
                            <Text style={[this.props.styles.labelText, {color:'rgb(86, 85, 85)', width:'90%'}]}>{Locale.t('DASHBOARD.TICKETS_TOP_CLIENTS')}</Text>
                            <View style={[this.props.styles.badge, this.props.badges['tickets_topClients'] <= 0 && this.props.styles.badgeEmpty, this.props.badges['tickets_topClients'] >= 100 && this.props.styles.bigBadge]}>
                                <Text style={this.props.styles.badgeText}>{this.props.badges['tickets_topClients']}</Text>
                            </View>
                        </TouchableOpacity>
                    }

                    <TouchableOpacity style={this.props.styles.item} onPress={()=>{
                        this.props.selectMenuBtn('all')                                             
                        }}>
                        <Text style={[this.props.styles.labelText, {color:'rgb(86, 85, 85)', width:'90%'}]}>{Locale.t('DASHBOARD.TICKETS_ALL')}</Text>
                        <View style={[this.props.styles.badge, this.props.badges['tickets_total'] <= 0 && this.props.styles.badgeEmpty, this.props.badges['tickets_total'] >= 100 && this.props.styles.bigBadge]}>
                            <Text style={this.props.styles.badgeText}>{this.props.badges['tickets_total']}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
