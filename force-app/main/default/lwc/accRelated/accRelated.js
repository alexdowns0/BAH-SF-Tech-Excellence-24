import { LightningElement, wire, api } from 'lwc';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c'
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService'




export default class AccRelated extends LightningElement {
    accountId;          // property to hold the Account ID received from the message channel
    accountName;        // property to hold the Account Name received from the message channel  
    subscription = {};  // property to hold the subscription object returned from subscribe
    activeSectionMessage = '';
    oppLabel = 'Opportunities';
    caseLabel = 'Cases';

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
        return 'Related Records for ' + this.accountName;
    }

    updateOppLabel(event) {
        this.oppLabel = 'Opportunities (' + event.detail + ')';
    }

    updateCaseLabel(event) {
        this.caseLabel = 'Cases (' + event.detail + ')';
    }

    // create MessageContext object
    @wire(MessageContext)
    msgContext;

    // create a method to subscribe to the message channel
    subscribeToMessageChannel() {
        this.subscription = subscribe(this.msgContext, AccountMC, (message) => this.handleMessage(message));
    }

    unsubscribeFromMessageChannel() {
        unsubscribe(this.subscription);
    }

    // method to handle channel message
    handleMessage(message) {
        console.log(message.recordId);
        console.log("Number of opps " + message.recordId);
        this.accountId = message.recordId;
        this.accountName = message.accountName;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeFromMessageChannel();
    }
}