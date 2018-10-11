

import { Platform } from 'react-native'
import request from 'superagent';
import axios from 'axios'
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import SocketIOClient from 'socket.io-client';
import Sound from 'react-native-sound';
import base64 from 'base-64'
import moment from 'moment'

import { localStorage } from './'
import { GlobalVals } from '../global'

export default class Client {  
  
  static login(domain, email, password, deviceToken) {
    let deviceDescription = DeviceInfo.getDeviceName() + " - " + DeviceInfo.getModel() + " - " + Platform.OS + " " + DeviceInfo.getSystemVersion();
    let devicePlatform = Platform.OS;
    let deviceModel = DeviceInfo.getModel();
    let deviceVersion =  DeviceInfo.getSystemVersion();

    let encodePassword = password
    if(Platform.OS == 'android')
      encodePassword = encodeURIComponent(password)

    
    var urlcall = GlobalVals.propertis.apiBaseUrl + 'authenticate/checkUserLogin?email=' + email + '&domain=' + domain + '&password=' + encodePassword + '&deviceToken=' + deviceToken + '&deviceDescription=' + deviceDescription + '&devicePlatform=' + devicePlatform + '&deviceModel=' + deviceModel + '&deviceVersion=' + deviceVersion;
    // console.log(urlcall)
    
    return  new Promise((resolve, reject) => { 
      fetch(urlcall, {
        method: 'POST',
        headers: {
          Accept: 'application/json',         
        },
        body: null
      })
      .then(res => {
        if(res.ok){
          let d = {}
          d.status = res.status
          res.json()
					.then(data => {
            d.body = data
            resolve(d)
					}).catch(error => {
            d.body = error
            resolve(d)
					});
        }else{
          reject('error')
        }
      })
      .catch(err => {
        reject(err)
      })
    })
  }

  static auth(data){
    let url = GlobalVals.propertis.apiBaseUrl + "oauth/token?grant_type=client_credentials";
    return request
            .get(url)
            .set('Authorization', 'Basic ' + data.apiToken)            
  }

  static prepareUser(url, bearer, clientId){  
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)            
  }

  static forgetPassword(domain, email){
    let url = GlobalVals.propertis.apiBaseUrl + "authenticate/forgotPassword?email=" + email + "&domain=" + domain;
    return request
            .get(url)
            .set('Accept', 'application/json')              
  }

  static clearDeviceToken(email, token, bearer, clientId){
    let url = GlobalVals.propertis.apiBaseUrl + 'device/delete?email=' + email + '&token=' + token;
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)  
  }

  static getAllBadges(bearer, clientId){
    let url = GlobalVals.propertis.apiBaseUrl + 'badge/list?userId=' + GlobalVals.user.id;
    // console.log(url)
    let headers = {
      Authorization: 'Bearer ' + bearer,
      Accept: 'application/json',
      clientId: clientId
    }
    // console.log(headers)
    return request
              .get(url)
              .set('Authorization', 'Bearer ' + bearer)
              .set('Accept', 'application/json')
              .set('clientId', clientId)  
  }

  static getUpdates(bearer, clientId){
    let url = GlobalVals.propertis.apiBaseUrl + 'dataRefresh/getUpdates';
    
    return  new Promise((resolve, reject) => { 
              request
                .get(url)
                .set('Authorization', 'Bearer ' + bearer)
                .set('Accept', 'application/json')
                .set('clientId', clientId) 
                .end((err, res) => {
                  if(err){
                    reject(res.body)
                  }else{
                    // console.log(res.body)


                    // Source refresh
                    localStorage.get('sourceRefresh').then((_sourceRefresh) => {
                      const sourceRefresh = _sourceRefresh
                      localStorage.get('sources').then((sources) => {
                        if(!sourceRefresh || !sources || sourceRefresh < res.body.sourceRefresh || GlobalVals.forceDataRefresh){
                          this.ticketSourceAll(bearer, clientId)
                            .end((err, sources) => {
                              GlobalVals.sources = sources.body;
                              if(res.body.sourceRefresh) localStorage.set('sourceRefresh', res.body.sourceRefresh);
                              localStorage.set('sources', JSON.stringify(sources.body));
                                                            
                            })
                        }else{
                          localStorage.get('sources').then((sources) => {
                            GlobalVals.sources = JSON.parse(sources)
                          })
                        }
                      })
                    })

                    // Status refresh
                    localStorage.get('statusRefresh').then((_statusRefresh) => {
                      let statusRefresh = _statusRefresh;
                      localStorage.get('statuses').then((statuses) => {
                        if(!statusRefresh || !statuses || statusRefresh < res.body.statusRefresh || GlobalVals.forceDataRefresh){
                          this.ticketStatusAll(bearer, clientId)
                            .end((err, statuses) =>{
                              // console.log(statuses.body)
                              GlobalVals.statuses = statuses.body;
                              localStorage.set('statuesRefresh', res.body.statusRefresh);  
                              localStorage.set('statuses', JSON.stringify(statuses.body))
                            })
                        }else{
                          localStorage.get('statuses').then((statuses) => {
                            // alert(statuses)
                            GlobalVals.statuses = statuses;
                          })
                        }
                      })
                    })

                    // Type refresh
                    localStorage.get('typeRefresh').then((_typeRefresh) => {
                      let typeRefresh = _typeRefresh;
                      localStorage.get('types').then((types) => {
                        if(!typeRefresh || !types || typeRefresh < res.body.typeRefresh || GlobalVals.forceDataRefresh){
                          this.ticketTypesAll(bearer, clientId)
                            .end((err, types) => {
                              GlobalVals.types = types.body;
                              localStorage.set('typeRefresh', res.body.typeRefresh);
                              localStorage.set('types', JSON.stringify(types.body));
                            })
                        }else{
                          localStorage.get('types').then((types) =>{
                            GlobalVals.types = JSON.parse(types);
                          })
                        }
                      })
                    })

                    // Area refresh
                    localStorage.get('areaRefresh').then((_areaRefresh) => {
                      let areaRefresh = _areaRefresh;
                      localStorage.get('areas').then((areas) => {
                        if(!areaRefresh || !areas || areaRefresh < res.body.areaRefresh || GlobalVals.forceDataRefresh){
                          this.ticketAreasAll(bearer, clientId)
                            .end((err, areas) => {
                              // console.log(areas.body)
                              GlobalVals.areas = areas.body;
                              localStorage.set('areaRefresh', res.body.areaRefresh);
                              localStorage.set('areas', JSON.stringify(areas.body));
                            })
                        }else{
                          localStorage.get('areas').then((areas) => {
                            GlobalVals.areas = JSON.parse(areas);
                          })
                        }
                      })
                    })

                    // Group refresh
                    localStorage.get('groupRefresh').then((_groupRefresh) => {
                      let groupRefresh = _groupRefresh;
                      localStorage.get('groups').then((groups) => {
                        if(!groupRefresh || !groups || groupRefresh < res.body.groupRefresh || GlobalVals.forceDataRefresh){
                          this.ticketGroupsAll(bearer, clientId)
                            .end((err, groups) => {
                              GlobalVals.groups = groups.body;
                              localStorage.set('groupRefresh', res.body.groupRefresh);
                              localStorage.set('groups', JSON.stringify(groups.body))
                            })
                        }else{
                          localStorage.get('groups').then((groups) => {
                            GlobalVals.groups = JSON.parse(groups);
                          })
                        }
                      })
                    })

                    //Agents refresh
                    localStorage.get('agentRefresh').then((_agentRefresh) => {
                      let agentRefresh = _agentRefresh;
                      localStorage.get('agents').then((agents) => {
                        if(!agentRefresh || !agents || agentRefresh < res.body.agentRefresh || GlobalVals.forceDataRefresh){
                          this.allForAssignation(bearer, clientId)
                            .end((err, agents) => {
                              GlobalVals.agents = agents.body;
                              localStorage.set('agentRefresh', res.body.agentRefresh);
                              localStorage.set('agents', JSON.stringify(agents.body));
                            })
                        }else{
                          localStorage.get('agents').then((agents) => {
                            GlobalVals.agents = JSON.parse(agents);
                          })
                        }
                      })
                    })

                    // Ticket CustomField refresh
                    localStorage.get('ticketCustomFieldRefresh').then((_ticketCustomFieldRefresh) =>{
                      let ticketCustomFieldRefresh = _ticketCustomFieldRefresh;
                      localStorage.get('ticketCustomFields').then((ticketCustomFields) =>{
                        if(!ticketCustomFieldRefresh || !ticketCustomFields || ticketCustomFieldRefresh < res.body.ticketCustomFieldRefresh || GlobalVals.forceDataRefresh){
                          this.allForTicket(bearer, clientId)
                            .then((ticketCustomFields) => {
                              if(ticketCustomFields){
                                GlobalVals.ticketCustomFields = ticketCustomFields;
                                localStorage.set('ticketCustomFieldRefresh', res.body.ticketCustomFieldRefresh);
                                localStorage.set('ticketCustomFields', JSON.stringify(ticketCustomFields))
                              }
                            })                            
                        }else{
                          localStorage.get('ticketCustomFields').then((ticketCustomFields) => {
                            GlobalVals.ticketCustomFields = JSON.parse(ticketCustomFields);
                          })
                        }
                      })
                    })

                    // Customer CustomField refresh
                    localStorage.get('customerCustomFieldRefresh').then((_customerCustomFieldRefresh) => {
                      let customerCustomFieldRefresh = _customerCustomFieldRefresh;
                      localStorage.get('customerCustomFields').then((customerCustomFields) => {
                        if(!customerCustomFieldRefresh || !customerCustomFields || customerCustomFieldRefresh < res.body.customerCustomFieldRefresh || GlobalVals.forceDataRefresh){
                          this.allForCustomer(bearer, clientId)
                            .then((customerCustomFields) => {
                              if(customerCustomFields){                                
                                GlobalVals.customerCustomFields = customerCustomFields;
                                localStorage.set('customerCustomFieldRefresh', res.body.customerCustomFieldRefresh);
                                localStorage.set('customerCustomFields', JSON.stringify(customerCustomFields))
                              }
                            })
                        }else{
                          localStorage.get('customerCustomFields').then((customerCustomFields) => {
                            GlobalVals.customerCustomFields = JSON.parse(customerCustomFields);
                          })                          
                        }
                      })
                    })

                    // Reply Template refresh
                    localStorage.get('replyTempleteRefresh').then((_replyTemplateRefresh) => {
                      let replyTemplateRefresh = _replyTemplateRefresh;
                      localStorage.get('replyTemplates').then((replyTemplates) => {
                        if(!replyTemplateRefresh || !replyTemplates || replyTemplateRefresh < res.body.replyTemplateRefresh || GlobalVals.forceDataRefresh){
                          this.replyTemplateAll(bearer, clientId)
                            .end((err, replyTemplates) => {
                              GlobalVals.replyTemplates = replyTemplates.body;
                              localStorage.set('replyTempleteRefresh', res.body.replyTemplateRefresh);
                              localStorage.set('replyTemplates', JSON.stringify(replyTemplates.body));

                            })
                        }else{
                          localStorage.get('replyTemplates').then((replyTemplates) => {
                            GlobalVals.replyTemplates = JSON.parse(replyTemplates);
                          })
                        }
                      })
                    })

                    GlobalVals.forceDataRefresh = false;
                    resolve("OK");
                  }
              }) 
            })
            
  }

  static ticketSourceAll(bearer, clientId){
    let url = GlobalVals.propertis.apiBaseUrl + 'ticketSource/getAllForCombo';
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static ticketStatusAll(bearer, clientId){
    let url = GlobalVals.propertis.apiBaseUrl + 'ticketStatus/getAllForCombo';
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static ticketTypesAll(bearer, clientId){
    let url = GlobalVals.propertis.apiBaseUrl + 'ticketType/getAllForCombo';
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static ticketAreasAll(bearer, clientId){
    let url = GlobalVals.propertis.apiBaseUrl + 'ticketArea/getAllForCombo';
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static ticketGroupsAll(bearer, clientId){
    let url = GlobalVals.propertis.apiBaseUrl + 'ticketGroup/getAllForCombo';
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static allForAssignation(bearer, clientId){
    let url = GlobalVals.propertis.apiBaseUrl + 'agent/assignToList';
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static allForTicket(bearer, clientId){
    let customer = false;
    if(GlobalVals.user.role == 'CUSTOMER') customer = true;

    let url = GlobalVals.propertis.apiBaseUrl + 'customField/getAllForTicket?customer=' + customer;
    return  new Promise((resolve, reject) => { 
              request
                  .get(url)
                  .set('Authorization', 'Bearer ' + bearer)
                  .set('Accept', 'application/json')
                  .set('clientId', clientId)
                  .end((err, res) => {
                    if(err){
                      reject(res.body)
                    }else{
                      let result = res.body;      
                      if(result){                
                        result.map((field, key) => {
                          if(field.linkedValues != null){
                            let newLinkedValues = [];
                            
                            for (parentKey in field.linkedValues) {                             
                                field.linkedValues[parentKey].map((linkedValue, key) => {
                                  var value = {
                                    parentKey: parentKey,
                                    value: linkedValue
                                  }
                                  newLinkedValues.push(value);
                                })                              
                            }                              

                            field.linkedValues = newLinkedValues;
                          }
                        })
                      }

                      resolve(result)
                    }
                  })
            });
  }

  static allForCustomer(bearer, clientId){
    let url = GlobalVals.propertis.apiBaseUrl + 'customField/getAllForCustomer';
    return  new Promise((resolve, reject) => {  
              request
                .get(url)
                .set('Authorization', 'Bearer ' + bearer)
                .set('Accept', 'application/json')
                .set('clientId', clientId)
                .end((err, res) => {
                  if(err){
                    reject(res.body)
                  }else{
                    let result = res.body;                      
                    _.forEach(result, (field, key) => {
                      if(field.linkedValues != null){
                        var newLinkedValues = []
                        _.forEach(field.linkedValues, (linkedValues, parentKey) => {
                          _.forEach(linkedValues, (linkedValue, key) => {
                            var value = {
                              parentKey: parentKey,
                              value: linkedValue
                            }

                            newLinkedValues.push(value)
                          })
                        })

                        field.linkedValues = newLinkedValues
                      }
                    })
                    resolve(result)
                  }
              })
            })

  }

  static replyTemplateAll(bearer, clientId){
    let url = GlobalVals.propertis.apiBaseUrl + 'replyTemplate/getAllForCombo'
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static searchCustomer(bearer, clientId, query){
    let url = GlobalVals.propertis.apiBaseUrl + 'customer/autocomplete?query=' + query;
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static allCompanies(bearer, clientId, page){
    let url = GlobalVals.propertis.apiBaseUrl + 'company/list?page=' + page +"&sort=company_ASC";
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static allCustomers(bearer, clientId, page, search){
    let query = "page=" + page + "&sort=name_ASC";
    
    if(search.query != null){
      query += "&text=" + search.query;
    }else if(search.filter != null){
      query += "&range=" + search.filter
    }

    let url = GlobalVals.propertis.apiBaseUrl + 'customer/list?' + query;    

    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static getCustomer(bearer, clientId, customerId){
    let url = GlobalVals.propertis.apiBaseUrl + 'customer/' + customerId;
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static getCompany(bearer, clientId, companyId){
    let url = GlobalVals.propertis.apiBaseUrl + 'company/' + companyId;
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static getByCompany(bearer, clientId, companyId, page){
    let url = GlobalVals.propertis.apiBaseUrl + 'customer/list?page=' + page + '&company._id=' + companyId;
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static getCustomerOpenedVsClosed(bearer, clientId, customerId){
    let url = GlobalVals.propertis.apiBaseUrl + 'customer/openedVsClosed/' + customerId;         

    return axios({
          method: 'get',
          url: url,
          headers:{
            'Authorization': 'Bearer ' + bearer,
            'Accept': 'application/json',
            'clientId': clientId
          },
          timeout: 100000,
          transformResponse: [(data) => {
            let res = {};
            res.msg = data
            return res;
          }],
        });
  }

  static getTicketsSearchByCustomer(bearer, clientId, page, query){
    let url = GlobalVals.propertis.apiBaseUrl + 'ticket/list?page=' + page + '&openedBy._id=' + query
    return request
        .get(url)
        .set('Authorization', 'Bearer ' + bearer)
        .set('Accept', 'application/json')
        .set('clientId', clientId)
  }

  static getTicketAll(bearer, clientId, page, filter){
    let archived = false
    let query = "?limit=25&page=" + page + "&archived=" + archived

    
    if (filter.standard) {
      query += "&sort=insertDate_DESC&" + filter.standard;
      if (filter.standard == "toReply") {
        if (GlobalVals.user.role == "AGENT") {
          query += "&toReply";
        } else if (GlobalVals.user.role == "CUSTOMER") {
          query += "&toReplyCustomer";
        }

      }

      if (GlobalVals.user.role == "AGENT" && !GlobalVals.permissions.viewAll) {
        query += "&assignedTo._id=" + GlobalVals.user.id + "&currentAgent=" + GlobalVals.user.id;
      } else if (GlobalVals.user.role == "AGENT") {
        query += "&currentAgent=" + GlobalVals.user.id;
      }

      if (GlobalVals.user.role == "CUSTOMER") {
        query += "&openedBy._id=" + GlobalVals.user.id;
      }

    } else if (filter.name) {

      if (filter.order && filter.order != "" && filter.order != "null" && filter.order != null) {
        query += "&sort=" + filter.order;
      }

      if (filter.assignedTo && filter.assignedTo != "" && filter.assignedTo != "null" && filter.assignedTo != null) {
        query += "&assignedTo._id=" + filter.assignedTo;
      }

      if (filter.openedById && filter.openedById != "" && filter.openedById != "null" && filter.openedById != null) {
        query += "&openedBy._id=" + filter.openedById;
      }

      if (filter.source && filter.source != "" && filter.source != "null" && filter.source != null) {
        query += "&source.source=" + filter.source;
      }

      if (filter.status && filter.status != "" && filter.status != "null" && filter.status != null) {
        query += "&status.status=" + filter.status;
      }

      if (filter.type && filter.type != "" && filter.type != "null" && filter.type != null) {
        query += "&type._id=" + filter.type;
      }

      if (filter.area && filter.area != "" && filter.area != "null" && filter.area != null) {
        query += "&area._id=" + filter.area;
      }

      if (filter.group && filter.group != "" && filter.group != "null" && filter.group != null) {
        query += "&group._id=" + filter.group;
      }

      if (filter.priority && filter.priority != "" && filter.priority != "null" && filter.priority != null) {
        query += "&priority";
      }

      if (filter.tags && filter.tags != "" && filter.tags != "null" && filter.tags != null) {
        query += "&tags=";
        for(var i = 0 ; i < filter.tags.length ; i++){
          query += filter.tags[i].text + ","
        }
      }

      if (filter.customFields && filter.customFields != "" && filter.customFields != "null" && filter.customFields != null) {
        for(var key in filter.customFields){
          query += "&customFields.name=" + key + "&customFields.value=" + filter.customFields[key];
        }
      }

      if (filter.query && filter.query != "" && filter.query != "null" && filter.query != null) {
        query += "&text=" + filter.query;
      }

    }
    var url = GlobalVals.propertis.apiBaseUrl + 'ticket/list' + query;
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static getTicketSearchAll(bearer, clientId, page, filter){
    let archived = false;

    let query = "?limit=25&page=" + page + "&archived=" + archived;
    if(filter.standard){
      

      if(filter.standard == 'toReply'){
        if(GlobalVals.user.role == 'AGENT'){
          query += "&toReply";
        }else if(GlobalVals.user.role == 'CUSTOMER'){
          query += "&toReplyCustomer"
        }
      }else {
        query += "&sort=insertDate_DESC&" + filter.standard
      }

      if(GlobalVals.user.role == 'AGENT' && !GlobalVals.permissions.viewAll){
        query += "&assignedTo._id=" + GlobalVals.user.id + "&currentAgent=" + GlobalVals.user.id
      }else if(GlobalVals.user.role == 'AGENT'){
        query += "&currentAgent=" + GlobalVals.user.id
      }

      if(GlobalVals.user.role == 'CUSTOMER'){
        query += "&openedBy._id=" + GlobalVals.user.id
      }

    }else if(filter.name){
      if (filter.order && filter.order != "" && filter.order != "null" && filter.order != null) {
        query += "&sort=" + filter.order;
      }

      if (filter.assignedTo && filter.assignedTo != "" && filter.assignedTo != "null" && filter.assignedTo != null) {
        query += "&assignedTo._id=" + filter.assignedTo;
      }

      if (filter.openedById && filter.openedById != "" && filter.openedById != "null" && filter.openedById != null) {
        query += "&openedBy._id=" + filter.openedById;
      }

      if (filter.source && filter.source != "" && filter.source != "null" && filter.source != null) {
        query += "&source.source=" + filter.source;
      }

      if (filter.status && filter.status != "" && filter.status != "null" && filter.status != null) {
        query += "&status.status=" + filter.status;
      }

      if (filter.type && filter.type != "" && filter.type != "null" && filter.type != null) {
        query += "&type._id=" + filter.type;
      }

      if (filter.area && filter.area != "" && filter.area != "null" && filter.area != null) {
        query += "&area._id=" + filter.area;
      }

      if (filter.group && filter.group != "" && filter.group != "null" && filter.group != null) {
        query += "&group._id=" + filter.group;
      }

      if (filter.priority && filter.priority != "" && filter.priority != "null" && filter.priority != null) {
        query += "&priority";
      }

      if (filter.tags && filter.tags != "" && filter.tags != "null" && filter.tags != null) {
        query += "&tags=";
        for(var i = 0 ; i < filter.tags.length ; i++){
          query += filter.tags[i].text + ","
        }
      }

      if (filter.customFields && filter.customFields != "" && filter.customFields != "null" && filter.customFields != null) {
        for(var key in filter.customFields){
          query += "&customFields.name=" + key + "&customFields.value=" + filter.customFields[key];
        }
      }

      if (filter.query && filter.query != "" && filter.query != "null" && filter.query != null) {
        query += "&text=" + filter.query;
      }
    }

    let url = GlobalVals.propertis.apiBaseUrl + 'ticket/list' + query;
    // console.log(url)    
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)

  }

  static getTicket(bearer, clientId, ticketId){
    let query = ticketId;
    if(GlobalVals.user.role == 'AGENT'){
      query += "?currentAgent" + GlobalVals.user.id;
    }

    let url = GlobalVals.propertis.apiBaseUrl + 'ticket/' + query;
    // console.log(url)
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static getReplyTemplatesUse(bearer, clientId, id, ticketId){
    let url = GlobalVals.propertis.apiBaseUrl + 'replyTemplate/' + id + '/' + ticketId;
    return axios({
        method: 'get',
        url: url,
        headers:{
          'Authorization': 'Bearer ' + bearer,
          'Accept': 'application/json',
          'clientId': clientId
        },
        timeout: 100000,
        transformResponse: [(data) => {
          let res = {};
          res.msg = data
          return res;
        }],
      });
  }

  static ticketSendReply(bearer, clientId, userId, reply, ticketId){
    if(GlobalVals.user.role == 'AGENT'){
      reply.replyFromOperator = {
        id: userId
      }
    }else if(GlobalVals.user.role == 'CUSTOMER'){
      reply.replyFromCustomer = {
        id: userId
      }
    }
    let url = GlobalVals.propertis.apiBaseUrl + 'ticket/postReply/' + ticketId;
    return request
            .post(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
            .send(reply)
  }
    
  static getSearchCompany(bearer, clientId, query){
    let url = GlobalVals.propertis.apiBaseUrl + 'company/autocomplete?query=' + query;
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }  

  static createCustomer(bearer, clientId, newCustomer){
    let url = GlobalVals.propertis.apiBaseUrl + 'customer/insert';
    return request
            .post(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
            .send(newCustomer)
  }

  static updateAgent(bearer, clientId, agent){
    let url = GlobalVals.propertis.apiBaseUrl + 'agent/update/' + agent.id;
    return request
            .put(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
            .send(agent)
  }

  static updateCustomer(bearer, clientId, customer){
    let url = GlobalVals.propertis.apiBaseUrl + 'customer/update/' + customer.id;
    return request
            .put(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
            .send(customer)
  }

  static removeCustomer(bearer, clientId, customerId){
    let url = GlobalVals.propertis.apiBaseUrl + 'customer/delete/' + customerId
    return request
            .delete(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static createCompany(bearer, clientId, newCompany){
    let url = GlobalVals.propertis.apiBaseUrl + 'company/insert';
    return request
            .post(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
            .send(newCompany) 
  }

  static updateCompany(bearer, clientId, company){
    let url = GlobalVals.propertis.apiBaseUrl + 'company/update/' + company.id;
    return request
            .put(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
            .send(company)
  }

  static removeCompany(bearer, clientId, companyId){
    let url = GlobalVals.propertis.apiBaseUrl + 'company/delete/' + companyId
    return request
            .delete(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  
  }

  static createTicket(bearer, clientId, newTicket){
    let query = ""
    if(GlobalVals.user.role == 'AGENT'){
      query = "?fromAgent=" + GlobalVals.user.id
    }else if(GlobalVals.user.role == 'CUSTOMER'){
      query = "?fromCustomer=" + GlobalVals.user.id
    }

    if(typeof newTicket.chatSesionId !== 'undefined'){
      query += "&chatSesionId=" + newTicket.chatSesionId
      delete newTicket.chatSesionId
    }

    let url = GlobalVals.propertis.apiBaseUrl + 'ticket/insertFromApp' + query; 
    return request
            .post(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
            .send(newTicket) 

  }

  static updateTicket(bearer, clientId, ticket){
    let url = GlobalVals.propertis.apiBaseUrl + 'ticket/update/' + ticket.id;  
    // console.log(url, bearer, clientId)
    return request
            .put(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
            .send(ticket)
  }

  static removeTicket(bearer, clientId, ticketId){
    let url = GlobalVals.propertis.apiBaseUrl + 'ticket/delete/' + ticketId
    return request
            .delete(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  } 

  static forwardTicket(bearer, clientId, forward){
    let url = GlobalVals.propertis.apiBaseUrl + 'ticket/forward?ticketId=' + forward.id + "&forwardTo=" + forward.forwardTo + "&currentInCc=" + forward.currentInCc + "&note=" + forward.note + "&currentAgent=" + GlobalVals.user.id
    return request
            .post(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static removeTicketAttachment(bearer, clientId, ticketId, documentId){
    var url = GlobalVals.propertis.apiBaseUrl + 'ticket/attachedDocument/delete?ticketId=' + ticketId + '&documentId=' + documentId
    return request
            .delete(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static allScenarios(bearer, clientId){
    let url = GlobalVals.propertis.apiBaseUrl + 'scenario/list';
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static getScenarios(bearer, clientId, id){
    let url = GlobalVals.propertis.apiBaseUrl + 'scenario/' + id;
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static executeScenarios(bearer, clientId, id, ticketId){
    let url = GlobalVals.propertis.apiBaseUrl + 'scenario/execute/' + ticketId + "/" + id;
    return request
            .get(url)
            .set('Authorization', 'Bearer ' + bearer)
            .set('Accept', 'application/json')
            .set('clientId', clientId)
  }

  static sendFeedback(bearer, clientId, userId, userRole, feedback){
    let url = GlobalVals.propertis.apiBaseUrl + 'email/feedback?clientId=' + clientId + "&userId=" + userId + "&userType=" + userRole + 
              "&subject=" + encodeURI(feedback.subject) + "&text=" + encodeURI(feedback.text) + "&deviceToken=undefined" + "&deviceDescription=undefined" + "&appVersion=" + GlobalVals.appVersion
    // console.log(url)
    return axios({
      method: 'post',
      url: url,
      headers:{
        'Authorization': 'Bearer ' + bearer,
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'clientId': clientId,
        'charset': 'utf-8'
      },
      timeout: 100000,
      transformResponse: [(data) => {
        let res = {};
        res.msg = data
        return res;
      }],
    });

  }

  static chatAuth(clientId, userId){    
    let parameters = {
      clientId: clientId,
      userId: userId
    }

    let url = GlobalVals.propertis.authURL + 'auth/'
    return request
          .post(url)
          .send(parameters)          
  }

  static connect(){
    localStorage.get('clientId').then((clientId) => {
      localStorage.get('chatUserId').then((chatUserId) => {
        let parameters = "token=" + GlobalVals.token + "&clientId=" + clientId + "&chatUserId=" + chatUserId
                        + "&browser=Deskero+Mobile+App&userAgent=&ipAddress=&referrer="
        GlobalVals.chatSocket = SocketIOClient(GlobalVals.propertis.socketURL + "chat", { 
          transports: ['websocket'],
          query: parameters,
          reconnection:true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          forceNew: true
        });
        GlobalVals.chatConnected = "PROGRESS"
        GlobalVals.showTyping = false
      })
    })
  } 

  static socketStatusCheck(currentObj, page){    
    let otherUserId;
    let currentChatSessionId;
    let prevText;    

    GlobalVals.chatSocket.on('connect', () => {
    }).on('reconnect_failed', () => {     
      if(GlobalVals.ws) GlobalVals.ws.close()
      if(GlobalVals.client){
          GlobalVals.client.disconnect(() => {
              GlobalVals.chatConnected = "ERROR"
          })
      }      
      GlobalVals.chatConnected = "ERROR"
      changeSocketStatus()
    }).on("CHAT_INIT", (obj) => {   
      if(GlobalVals.currentPage == 'dashboard' || GlobalVals.currentPage == 'chat'){
        GlobalVals.chatConnected = "OK"
        changeChatStatus(obj.chatStatus)   
        buildOnlineUsersList(obj.mobileOnlineUsers)
      }       
      changeSocketStatus()
    })
    .on("CHANGE_CHAT_STATUS", (obj, id) => {
      if(GlobalVals.currentPage == 'chat'){
        changeChatStatus(obj.chatStatus);
      }
      changeSocketStatus()
    })
    .on("USER_CHANGE_STATUS", (obj, id) => {
      localStorage.get('chatUserStatus').then((chatUserStatus) => {
        if(chatUserStatus != "OFFLINE"){
            buildOnlineUsersList(obj.mobileOnlineUsers)
        }
        updateUserStatus(obj.fromId, obj.chatStatus);
      }) 
      changeSocketStatus()
    })
    .on("CHECK_USER_STATUS", (message, id) => {
    })
    .on("INIT_CHAT_CONVERSATION", (obj, id) => {      
      if(GlobalVals.currentPage == 'session'){        
        composeChatWindow(obj.chatSessionBean);  
      }      
      changeSocketStatus() 
    })
    .on("INIT_CHAT_CONVERSATION_WITH_TEXT", (message, id) => {          
    })
    .on("INIT_CHAT_CONVERSATION_MAXIMIZED", (message, id) => {
    })
    .on("GET_CHAT_CONVERSATION", (message, id) => {
    })
    .on("CLOSE_CHAT_CONVERSATION", (obj, id) => {
      if(GlobalVals.currentPage == 'session'){
        closeChatWindow(obj.chatSessionId);  
      }      
      changeSocketStatus()
    })
    .on("CHAT_SEND", (obj, id) => {
      // console.log(JSON.stringify(obj))
      if(GlobalVals.currentPage == page){
        
        addNewChatLine(obj.chatSessionBean.chatSessionId, obj.chatLogLineBean);
      }
      changeSocketStatus()
    })
    .on("CHAT_TYPING", (obj, id) => {
      if(GlobalVals.currentPage == 'session'){
        showTyping(obj.chatSessionId);
      }      
      changeSocketStatus()
    })
    .on("CHAT_TYPING_CANCEL", (obj, id) => {
      if(GlobalVals.currentPage == 'session'){
        cancelTyping(obj.chatSessionId);
      }      
      changeSocketStatus()
    })
    .on("CHAT_CURRENT_ACTION", (obj, id) => {
      if(GlobalVals.currentPage == 'session'){
        if (typeof chatSession !== 'undefined') {            
          if (typeof chatSession.handleCurrentAction == 'function') {  
            if (obj.fromId != null) {
              chatSession.handleCurrentAction(obj.fromId, obj.chatCurrentAction);
            }  
          }  
        }
      }      
      changeSocketStatus()
    })
    .on("CHAT_DISCONNECT_CONCURRENT_USER", (message, id) => {
    })
    .on("GET_USERS_LIST", (message, id) => {
    })

    // Sound.setCategory('Playback');
    let effect = new Sound("chat_notification.mp3", Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        // console.log(error)
      }
    })
  

    ////////////////////////////////////////////////////

    let changeChatStatus = (chatStatus) => {
      localStorage.set('chatUserStatus', chatStatus)
      GlobalVals.chatUserStatus = chatStatus
    }

    let buildOnlineUsersList = (onlineUsers) => {
      if (onlineUsers !== null && typeof onlineUsers !== 'undefined') {
        GlobalVals.onlineUsers = onlineUsers;
        localStorage.set('chat-onlineUsers', JSON.stringify(onlineUsers));
        
        if (onlineUsers.visitors === null || typeof onlineUsers.visitors === 'undefined') {
            GlobalVals.badges['online_visitors'] = 0;
        } else {
            GlobalVals.badges['online_visitors'] = onlineUsers.visitors.length;
        }

        if (typeof onlineUsers.customers === 'undefined') {
            GlobalVals.badges['online_customers'] = 0;
        } else {            
            if (GlobalVals.user.role == "CUSTOMER") {
                var badgeToCount = onlineUsers.customers.length;
                _.forEach(onlineUsers.customers, (customer, key) => {
                    if (customer.chatUserId == GlobalVals.user.chatUserId) {
                        badgeToCount = badgeToCount - 1;
                        return;
                    }
                });
                GlobalVals.badges['online_customers'] = badgeToCount;
            } else {
                GlobalVals.badges['online_customers'] = onlineUsers.customers.length;
            }            
        }
        
        if (typeof onlineUsers.agents === 'undefined') {
            GlobalVals.badges['online_agents'] = 0;
        } else {
            if (GlobalVals.user.role == "AGENT") {
                var badgeToCount = onlineUsers.agents.length;
                _.forEach(onlineUsers.agents, (agent, key) => {
                    if (agent.chatUserId == GlobalVals.user.chatUserId) {
                        badgeToCount = badgeToCount - 1;
                        return;
                    }
                });
                GlobalVals.badges['online_agents'] = badgeToCount;
            } else {
                GlobalVals.badges['online_agents'] = onlineUsers.agents.length;
            }
        }            
        localStorage.set('badges', JSON.stringify(GlobalVals.badges))   
      }
    }

    let updateUserStatus = (userId, status) =>{}

    let composeChatWindow = (chatSessionObj) => {
      if (typeof GlobalVals.chatSessions === "undefined") {
          GlobalVals.chatSessions = [];
      }
    
      localStorage.get('chatUserId').then((chatUserId) => {
          if(chatUserId == chatSessionObj.chatSessionTo.chatUserId){
              chatSessionObj.showFrom = true;
              otherUserId = chatSessionObj.chatSessionFrom.chatUserId;
          }else{
              chatSessionObj.showTo = true;
              otherUserId = chatSessionObj.chatSessionTo.chatUserId;
          }
          currentChatSessionId = chatSessionObj.chatSessionId;        
          if (typeof GlobalVals.chatBadges[otherUserId] !== 'undefined') {
              let badgeToDec = GlobalVals.chatBadges[otherUserId];
              
              GlobalVals.chatBadges[otherUserId] = 0;
              if (typeof GlobalVals.badges.chat_unread !== 'undefined') {                  
                GlobalVals.badges.chat_unread -= badgeToDec;
                if (GlobalVals.badges.chat_unread < 0) {
                    GlobalVals.badges.chat_unread = 0;
                }
              }
              localStorage.set('badges', JSON.stringify(GlobalVals.badges))
              localStorage.set('chatBadges', JSON.stringify(GlobalVals.chatBadges))
          }
          
          GlobalVals.chatSessions[chatSessionObj.chatSessionId] = chatSessionObj;  
          let chatSession = JSON.parse(JSON.stringify(chatSessionObj));  
          if (typeof chatSession.logLines === 'undefined' || chatSession.logLines.length == 0) {  
  
          }
    
          _.forEach(chatSession.logLines, (line, key) => {  
              if (line) {  
                  line.text = base64.decode(line.text);  
                  localStorage.get('chatUserId').then((chatUserId) => {
                      if(chatUserId == line.user.chatUserId){
                          line.me = true
                      }else line.me = false
                  })
                  let calendarDate = moment(line.date).calendar()
                  line.formattedDate = calendarDate.split('at')[0]
                  line.status = "delivered";
              }
          });
          GlobalVals.currentChatSession = chatSession;  
      }) 
            
    }

    let closeChatWindow = (chatSessionId) => {
      if (currentChatSessionId == chatSessionId) {
        if (typeof GlobalVals.currentChatSession !== "undefined") {
            GlobalVals.currentChatSession.closed = true;
        }
      }
    }

    let addNewChatLine = (chatSessionId, chatLogLineBean) => {    
      if (GlobalVals.currentPage != "session" || (GlobalVals.currentPage == "session" && currentChatSessionId != chatSessionId)) {
        if (typeof GlobalVals.badges.chat_unread === 'undefined') {
          GlobalVals.badges.chat_unread = 1;
        } else {
          GlobalVals.badges.chat_unread = GlobalVals.badges.chat_unread + 1;
        }
        localStorage.set('badges', JSON.stringify(GlobalVals.badges))
        
        localStorage.get('chatUserId').then((chatUserId) => {
          if(chatUserId != chatLogLineBean.user.chatUserId){
            if (typeof GlobalVals.chatBadges[chatLogLineBean.user.chatUserId] === 'undefined') {
              GlobalVals.chatBadges[chatLogLineBean.user.chatUserId] = 1;
            } else {
              GlobalVals.chatBadges[chatLogLineBean.user.chatUserId] = GlobalVals.chatBadges[chatLogLineBean.user.chatUserId] + 1;
            }
            localStorage.set('chatBadges', JSON.stringify(GlobalVals.chatBadges))
          }
        })         
      }
  
      if (typeof GlobalVals.chatSessions !== 'undefined' && typeof GlobalVals.chatSessions[chatSessionId] !== 'undefined') {

        let flag = false
        for(var i = 0 ; i < GlobalVals.chatSessions[chatSessionId].logLines.length ; i++){
          if(GlobalVals.chatSessions[chatSessionId].logLines[i].date == chatLogLineBean.date){
            flag = true
            break
          }
        }
        if(!flag){
          GlobalVals.chatSessions[chatSessionId].logLines.push(chatLogLineBean);
        }              
        
        let chatSession = JSON.parse(JSON.stringify(GlobalVals.chatSessions[chatSessionId]));  
        _.forEach(chatSession.logLines, (line, key) => {  
          if (line) {  
            line.text = base64.decode(line.text);
            localStorage.get('chatUserId').then((chatUserId) => {
              if(chatUserId == line.user.chatUserId) line.me = true
              else line.me = false
            })       
            let calendarDate = moment(line.date).calendar()
            line.formattedDate = calendarDate.split('at')[0]
            line.status = "delivered";
          }  
        });
        
        if (currentChatSessionId == chatSession.chatSessionId) {
          GlobalVals.currentChatSession = chatSession;          
        }

        localStorage.get('chatUserId').then((chatUserId) => {
          if(chatUserId == chatLogLineBean.user.chatUserId){
            GlobalVals.showTyping = false;
            effect.play((success) => {
              if (!success) {
                // console.log('Sound did not play')
              }
            })
          }
        })

        
      }
    }

    let showTyping = (id) => {          
      if (id == currentChatSessionId) {    
        GlobalVals.showTyping = true;    
      }
    }

    let cancelTyping = (id) => {          
      if (id == currentChatSessionId) {    
        GlobalVals.showTyping = false;    
      }
    }

    let changeSocketStatus = () => {
      setTimeout(() => {       
        currentObj.changeSocketStatus(currentChatSessionId, otherUserId)  
      }, 100)
    }
    
  }

  static sendChangeStatus(clientId, chatUserId, chatStatus){
    let chatMessage = {
      clientId: clientId,
      toId: chatUserId,
      chatCommand: 'CHANGE_CHAT_STATUS',
      chatStatus: chatStatus
    }

    GlobalVals.chatSocket.emit('CHANGE_CHAT_STATUS', chatMessage)
  }

  static sendInitChatConversation(clientId, fromChatUserId, toChatUserId){
    let chatMessage = {
      clientId: clientId,
      toId: toChatUserId,
      chatCommand: 'INIT_CHAT_CONVERSATION',
      fromId: fromChatUserId,
      minimized: true
    }

    GlobalVals.chatSocket.emit("INIT_CHAT_CONVERSATION", chatMessage)
  }

  static sendChatMessage(text, currentChatSessionId, otherUserId, guid){
    let encodedText = base64.encode(text)

    let uniqueId =  guid
    localStorage.get('userId').then((userId) => {
      localStorage.get('userName').then((userName) => {
        localStorage.get('userRole').then((userRole) => {
          localStorage.get('chatUserId').then((chatUserId) => {            
            let chatLogLineBean = {
              id: uniqueId,
              text: text,
              date: new Date(),
              status: 'sent',
              me: true,
              user: {
                id: userId,
                name: userName,
                type: userRole,
                chatUserId: chatUserId
              }
            }

            GlobalVals.currentChatSession.logLines.push(chatLogLineBean)
          })
        })
      })
    })


    localStorage.get('clientId').then((clientId) => {
      localStorage.get('chatUserId').then((chatUserId) => {
        let chatMessage = {
          clientId: clientId,
          chatSessionId: currentChatSessionId,
          text: encodedText,
          chatCommand: 'CHAT_SEND',
          fromId: chatUserId,
          toId: otherUserId,
          uniqueId: uniqueId 
        }

        GlobalVals.chatSocket.emit('CHAT_SEND', chatMessage)
      })
    })
    
  }

  static sendChatTyping(chatSessionId, toId){
    // console.log('send', )
    let chatMessage = {
      chatSessionId: chatSessionId,
      chatCommand: 'CHAT_TYPING',
      toId: toId
    }

    GlobalVals.chatSocket.emit("CHAT_TYPING", chatMessage)
  }

  static sendCancelChatTyping(chatSessionId, toId){
    let chatMessage = {
      chatSessionId: chatSessionId,
      chatCommand: 'CHAT_TYPING_CANCEL',
      toId: toId
    }

    GlobalVals.chatSocket.emit('CHAT_TYPING_CANCEL', chatMessage)
  }

  static sendCloseChatConversation(id){
    delete GlobalVals.currentChatSession
    localStorage.get('clientId').then((clientId) => {
      let chatMessage = {
        clientId: clientId,
        chatSessionId: id,
        chatCommand: 'CLOSE_CHAT_CONVERSATION'  
      }

      GlobalVals.chatSocket.emit('CLOSE_CHAT_CONVERSATION', chatMessage)
    })
    
  }

  static resetNotificationBadges(bearer, clientId, deviceToken){
    let url = GlobalVals.propertis.apiBaseUrl + 'badge/resetNotificationBadges?userId=' + GlobalVals.user.id + "&role=" + GlobalVals.user.role + "&deviceToken=" + deviceToken;
    // console.log(url)
    // console.log(bearer)
    // console.log(clientId)
    return request
              .get(url)
              .set('Authorization', 'Bearer ' + bearer)
              .set('Accept', 'application/json')
              .set('clientId', clientId)         
  }
}

