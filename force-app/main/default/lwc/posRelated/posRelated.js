import { LightningElement, wire, api } from 'lwc';
import PositionMC from '@salesforce/messageChannel/PositionMessageChannel__c'
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService'


export default class PosRelated extends LightningElement {
    // property to hold the Position ID received from the message channel
    positionId;     
    // property to hold the Position Name received from the message channel      
    positionName;       
     // property to hold the subscription object returned from subscribe  
    subscription = {}; 
    activeSectionMessage = '';
    appLabel = 'Applications';
    interviewerLabel = 'Interviewers';

    // accordian event handling
    handleSectionToggle(event) {
        const openSections = event.detail.openSections;

        if (openSections.length === 0) {
            this.activeSectionsMessage = 'All sections are closed';
        } else {
            this.activeSectionsMessage =
                'Open sections: ' + openSections.join(', ');
        }
    }

    // getter method to display a label in the Detail component
    get detailLabel() {
        return 'Related Records for ' + this.positionName;
    }

    // update label to display the number of apps provisioned per position object
    updateAppLabel(event) {
        this.appLabel = 'Applications (' + event.detail + ')';
    }

    updateIntLabel(event) {
        this.interviewerLabel = 'Interviewers (' + event.detail + ')';
    }


    // create MessageContext object
    @wire(MessageContext)
    msgContext;

    // create a method to subscribe to the message channel
    subscribeToMessageChannel() {
        this.subscription = subscribe(this.msgContext, PositionMC, (message) => this.handleMessage(message));
    }

    unsubscribeFromMessageChannel() {
        unsubscribe(this.subscription);
    }

    // method to handle channel message
    handleMessage(message) {
        console.log(message.recordId);
        console.log("Number of apps " + message.recordId);
        this.positionId = message.recordId;
        this.positionName = message.positionName;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeFromMessageChannel();
    }
}