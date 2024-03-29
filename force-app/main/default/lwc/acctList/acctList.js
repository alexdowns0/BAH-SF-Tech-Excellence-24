import { LightningElement, api, wire } from 'lwc';
import getTopAccounts from '@salesforce/apex/AccountController.getTopAccounts';
import RecordModal from 'c/recordModal';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';

export default class AcctList extends LightningElement {
    @api recordId;
    // this will be the property to hold the account records
    accs = [];
    // this will be the property to hold the provisioned object from wire service
    results;
    accsToDisplay = false;
    @api accountId;
    selectedId;
    selectedName;
    showOne = false;

    // use wire service to create a MessageContext object required by publish method 
    @wire(MessageContext)
    msgContext;

    
    // create method that user can invoke to open recordModal comp and create new acct
    newAccount() {
        RecordModal.open({
            // if u don't pass in record id. then u just create a new account
            size: 'small',
            objectApiName: 'Account',
            // could be readonly, view, edit
            formMode: 'edit',
            layoutType: 'Full',
            headerLabel: 'New Account'
        })
        
        .then((result) => {
            console.log(result);
            // check to see if modal window closed
            if (result) {
                if (result.type === 'success') {
                    const myToastEvent = new ShowToastEvent({
                        title: 'Account Created Successfully',
                        message: 'Account ' + result.detail.fields.Name.value + ' was created successfully!',
                        variant: 'success',
                        mode: 'dismissible'
                    });

                    // dispatch toast notification
                    this.dispatchEvent(myToastEvent);
                    this.refreshRecords();
                }
            }
        })
        .catch((error) => console.log(error));
    }
    
    // use wire service to invoke the getTopAccounts function/method to return account records
    @wire(getTopAccounts)
    wiredAccounts(accRecs) {
        // move provisioned object into property so I can refresh the cache later
        this.results = accRecs;
        
        //this.rank = this.accs.indexOf + 1;
        

        // if data returned, populate accs with data
        if (this.results.data) {
            console.log(this.results.data);
            this.accs = this.results.data;
            this.selectedId = this.accs[0].Id;
            this.selectedName = this.accs[0].Name;
            this.sendMessageService(this.selectedId, this.selectedName);
            this.accsToDisplay = true; 

            
        }

        // if error, log error
        if (this.results.error) {
            
            this.accsToDisplay = false;
        }
        
    }
   
            
    refreshRecords() {
        // pass the property holding the provisioned object to refreshApex
        // refresh wire service to obtain new cache of records
        refreshApex(this.results);
    }

    // create a method to publish the account Id and name to message channel
    sendMessageService(acctId, acctName) {
        // invoke publish method to publish the account info to the message channel
        publish(this.msgContext, AccountMC, { recordId: acctId, accountName: acctName});
        console.log(acctId, acctName);
    }
    
    // create method to handle oppselected event
    handleAcctEvent(event) {
        console.log('Yay');
        if (event.detail.accid != this.selectedId) {
            this.showOne = true;
            this.selectedId = event.detail.accid;
            this.selectedName = event.detail.accname;
            console.log('Something');
        }

        else{
            this.showOne = false;
            console.log('this is not viewable');
        }
        
        
    }

    // create method to handle event raised by account card
    handleSelection(event) {
        this.selectedId = event.detail.accid;
        this.selectedName = event.detail.accname;
        console.log(JSON.stringify(event.detail));
        this.sendMessageService(this.selectedId, this.selectedName);
    }



}