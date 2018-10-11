import request from 'superagent'
import axios from 'axios'


const baseURL = "https://mechaniku-staging.herokuapp.com/api/v1/"

export default class Client{
    
    static login(body){
        let url = baseURL + 'users/sign_in';
        return request
                .post(url)
                .set('Accept', 'application/json')
                .send(body)
    }

    static resetPassword(body){
        let url = baseURL + 'users/reset_password';
        return request
                .post(url)
                .set('Accept', 'application/json')
                .send(body)
    }

    static signUp(body){
        let url = baseURL + 'users';        
        return request
                .post(url)
                .set('Accept', 'application/json')
                .send(body)
    }

    static createAddress(token, body){
        let url = baseURL + 'addresses';
        return request
                .post(url)
                .set('Accept', 'application/json')
                .set('authentication_token', token)
                .send(body)
    }

    static unavailableDates(){
        let url = baseURL + 'appointments/unavailable_dates';
        return request
                .get(url)
                .set('Accept', 'application/json')
    }

    static unsvailableTimes(date){
        let url = baseURL + 'appointments/unavailable_times?date=' + date
        return request
                .get(url)
                .set('Accept', 'application/json')
    }

    static timeSlot(){
        let url = baseURL + 'appointments/time_slot'
        return request
                .get(url)
                .set('Accept', 'application/json')
    }

    static createAppointment(body){
        let url = baseURL + 'appointments'
        return request
                .post(url)
                .set('Accept', 'application/json')
                .send(body)
    }    

    static getAllAdminAppointments(token, page){
        let url = baseURL + 'admin/appointments?page=' + page
        return request
                .get(url)
                .set('Accept', 'application/json')
                .set('Authentication-Token', token)
    }
   
    static getPendingAppointments(token, page){
        let url = baseURL + 'mechanic/appointments?page=' + page
        return request
                .get(url)
                .set('Accept', 'application/json')
                .set('Authentication-Token', token)
    }

    static getAcceptedAppointments(token, page){
        let url = baseURL + 'mechanic/my_appointments?page=' + page
        return request
                .get(url)
                .set('Accept', 'application/json')
                .set('Authentication-Token', token)
    }

    static deleteAppointment(token, id){    
        let url = baseURL + "admin/appointments/" + id
        return request
                .delete(url)
                .set('Accept', 'application/json')
                .set('Authentication-Token', token)
    }

    static getAllMechanics(token){
        let url = baseURL + 'users?authentication_token=' + token
        return request
                .get(url)
                .set('Accept', 'application/json')
    }

    static activeMechanic(body){
        let url = baseURL + 'users/' + body.id + "/active"
        return request
                .post(url)
                .set('Accept', 'application/json')
                .send(body)
    }

    static suspendMechanic(body){
        let url = baseURL + 'users/' + body.id + "/suspend"
        return request
                .post(url)
                .set('Accept', 'application/json')
                .send(body)
    }

    static deleteMechanic(body){
        let url = baseURL + 'users/' + body.id
        return request
                .delete(url)
                .set('Accept', 'application/json')
                .send(body)
    }

    static linkBankAccount(body){               
        let url = baseURL + 'users/' + body.id + '/link_bank_account'; 
        return request
                .post(url)
                .set('Accept', 'application/json')
                .send(body)
    }

    static setTimeSlot(body){
        let url = baseURL + 'users/' + body.id + '/set_time_slot'
        return request
                .post(url)
                .set('Accept', 'application/json')
                .send(body)
    }

    static unavailableDatesByAdmin(token){
        let url = baseURL + 'unavailable_dates?authentication_token=' + token
        return request
                .get(url)
                .set('Accept', 'application/json')
    }

    static setUnavailableDateByAdmin(body){
        let url = baseURL + 'unavailable_dates'
        return request
                .post(url)
                .set('Accept', 'application/json')
                .send(body)
    }

    static changeUnavailableDate(body){
        let url = baseURL + 'unavailable_dates/' + body.id
        return request
                .patch(url)
                .set('Accept', 'application/json')
                .send(body)
    }

    static deleteUnavailableDate(body){
        let url = baseURL + 'unavailable_dates/' + body.id
        return request
                .delete(url)
                .set('Accept', 'application/json')   
                .send(body)             
    }

    static acceptAppointment(token, body){
        let url = baseURL + 'mechanic/appointments/' + body.id + '/accept'
        return request
            .post(url)
            .set('Accept', 'application/json')
            .set('Authentication-Token', token)
            .send(body)
    }

    static rejectAppointment(token, body){
        let url = baseURL + 'mechanic/appointments/' + body.id + '/reject'
        return request
            .post(url)
            .set('Accept', 'application/json')
            .set('Authentication-Token', token)
            .send(body)
    }

    static finishAppointment(token, body){
        let url = baseURL + 'mechanic/my_appointments/' + body.id + '/finish'
        return request
            .post(url)
            .set('Accept', 'application/json')
            .set('Authentication-Token', token)
            .send(body)
    }

    static findAppointment(body){
        let url = baseURL + 'appointments/find?license_plate_state=' + body.license_plate_state + '&license_plate_number=' + body.license_plate_number
        return request
            .get(url)
            .set('Accept', 'application/json')
    }

    static setNotification(body, token){
        let url = baseURL + 'users/set_notification'
        return request
            .post(url)
            .set('Accept', 'application/json')
            .set('authentication_token', token)
            .send(body)
    }

    static checkFeeStatus(id){
        let url = baseURL + 'appointments/' + id + '/fee_state'
        return request
            .get(url)
            .set('Accept', 'application/json')
    }

    static cancelAppointment(body){
        let url = baseURL + 'appointments/' + body.id + '/cancel'
        return request
            .post(url)
            .set('Accept', 'application/json')
            .send(body)
    }

    static getAllAddresses(){
        let url = baseURL + 'appointments/addresses'
        return request
            .get(url)
            .set('Accept', 'application/json')
    }    

}