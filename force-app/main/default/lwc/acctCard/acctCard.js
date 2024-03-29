import { LightningElement, api, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
export default class AcctCard extends LightningElement {

    // public properties
    @api accId;
    @api accName;
    @api phone;
    @api annRev;
    @api rank;
    @api checkboxChecked = false;
    contacts = [];
    





    
    // rankNum;
   
    // @api
    // set rankNum(rank) {
    //     this.rankNum = toString(this.rank + 1);
    //     return this.rankNum;
    // }
    acctSelected(){
        const myEvent = new CustomEvent('acctselected', { detail: {accid: this.accId, accname: this.accName} });
        this.dispatchEvent(myEvent);
    }

    
     // getter method to return the account ranking
    get ranking() {
        return this.rank + 1;
    }
 

    // use wire service to invoke the getTopAccounts function/method to return account records
    returnContacts() {
        this.checkboxChecked = !this.checkboxChecked;
        if (this.checkboxChecked == true) {
            getContacts({ accountId: this.accId })
                .then((data) => {
                    this.contacts = data;
                    console.log(data);
                })
                .catch((error) => {
                    console.error(error);
                    this.contacts = undefined;
                })
                .finally(() => {
                    console.log('Finally returned contact records....');
                });
        }
    }
 
}