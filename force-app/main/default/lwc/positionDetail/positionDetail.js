import { LightningElement, wire } from 'lwc';
import PositionMC from '@salesforce/messageChannel/PositionMessageChannel__c';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PositionDetail extends LightningElement {
    positionId;
    positionName;
    // property to hold the subscription object returned from subscribe
    subscription = {};

   // getter method to display a label in the Detail component
   get detailLabel() {
        return 'Details for ' + this.positionName;
   }

    // create the MessageContext object
    @wire(MessageContext)
    msgContext;

    // create a method to subscribe to the message channel
    subscribeToMessageChannel() {
        // use the subscribe method to subscribe to the PositionMessageChannel and store the returned subscription
        // object into my property
        // subscribe method- returns subscription option that is being stored in this.subscription 
        // so that when we use unsubscribe method, this.subscription will be passed as param
        this.subscription = subscribe(this.msgContext, PositionMC, (message) => this.handleMessage(message));

    }
    // create a method to unsubscribe from message channel
    unsubscribeFromMessageChannel() {
        unsubscribe(this.subscription);
    }

    // method to handle the message channel message when received
    handleMessage(message) {      
        console.log(message.recordId);
        this.positionId = message.recordId;
        this.positionName = message.positionName;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeFromMessageChannel();
    }

    detailSaved(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Position Updated',
            message: 'Position ' + event.detail.fields.Name.value + ' was saved successfully!',
            variant: 'success',
            mode: 'dismissible'

        }));
    }
}