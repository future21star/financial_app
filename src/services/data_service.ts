import {Injectable} from '@angular/core';  
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
let deployed_server_url = "https://server-for-financial-app-warzi117.c9users.io";
let local_server_url = "http://localhost:3000";
// let current_url = deployed_server_url;
let current_url = local_server_url;
@Injectable()
export class DataService {  

    private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
    private options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {
    }

    login(login_form) { 
        return this.http.post(`${current_url}/authenticate/login`, JSON.stringify(login_form), this.options);
    }

    register(register_form) {
        return this.http.post(`${current_url}/authenticate/register`, JSON.stringify(register_form), this.options);
    }    

    new_bank(bank_form) {
        return this.http.post(`${current_url}/bank/new`, JSON.stringify(bank_form), this.options);
    }

    get_bank(bank_id) {
        return this.http.get(`${current_url}/bank/${bank_id}`).map(res => res.json());
    }

    get_banks_for_user(user_id) {
        return this.http.get(`${current_url}/bank/allbanksforuser/${user_id}`).map(res => res.json());
    }

    update_bank(bank_form) {
        return this.http.put(`${current_url}/bank/update`, JSON.stringify(bank_form), this.options);
    }

    remove_bank(bank_id) {
        return this.http.delete(`${current_url}/bank/${bank_id}`);
    }

    change_notification_setting(notification_form) {
        return this.http.put(`${current_url}/notification/${notification_form._id}`, JSON.stringify(notification_form), this.options);
    }

    create_notification_setting(notification_form) {
        return this.http.post(`${current_url}/notification/new`, JSON.stringify(notification_form), this.options);
    }

    get_notification_setting(user_id) {
        return this.http.get(`${current_url}/notification/${user_id}`).map(res => res.json());
    }

    getBanks() {
        return this.http.get('assets/data/banks.json').map(res => res.json());
    }

    getTransactionHistory(access_token) {
        // return this.http.get(`${current_url}/transaction/${bank_id}`).map(res => res.json());
        return this.http.get(`${current_url}/bank/get_transactions/${access_token}`).map(res => res.json());
    }

    getAvailableFinancialInstitutions() {
        return this.http.get(`${current_url}/bank/get_available_banks`).map(res => res.json());
    }

    sendMFA(access_token, answer) {
        return this.http.post(`${current_url}/bank/dispute_mfa/${access_token}/${answer}`, this.options);
    }

}