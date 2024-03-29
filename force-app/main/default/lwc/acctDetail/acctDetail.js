import { LightningElement, wire } from 'lwc';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AcctDetail extends LightningElement {

    accountId;          // property to hold the Account ID received from the message channel
    accountName;        // property to hold the Account Name received from the message channel  
    subscription = {};  // property to hold the subscription object returned from subscribe

    // getter method to display a label in the Detail component
    get detailLabel() {
        return 'Details for ' + this.accountName;
    }


    // create the MessageContext object
    @wire(MessageContext)
    msgContext;

    // create a method to subscribe to the message channel
    subscribeToMessageChannel() {
        // use the subscribe method to subscribe to the AccountMessageChannel and store the returned subscription
        // object into my property
        // subscribe method- returns subscription option that is being stored in this.subscription 
        // so that when we use unsubscribe method, this.subscription will be passed as param
        this.subscription = subscribe(this.msgContext, AccountMC, (message) => this.handleMessage(message));

    }
    // create a method to unsubscribe from message channel
    unsubscribeFromMessageChannel() {
        unsubscribe(this.subscription);
    }

    // method to handle the message channel message when received
    handleMessage(message) {
        
        console.log(message.recordId);
        this.accountId = message.recordId;
        this.accountName = message.accountName;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeFromMessageChannel();
    }

    detailSaved(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Account Updated',
            message: 'Account ' + event.detail.fields.Name.value + ' was saved successfully!',
            variant: 'success',
            mode: 'dismissible'

        }));
    }
}