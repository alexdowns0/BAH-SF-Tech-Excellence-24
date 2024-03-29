import { LightningElement, api } from 'lwc';
import RecordModal from 'c/recordModal';    // import my custom recordModal component
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class IntCard extends NavigationMixin(LightningElement) {
    // public properties
    @api intId;
    @api intName;
    @api intInterviewer
    @api intPosition;
    @api recordId;
    @api objectApiName;
  

    // create a method to navigate to the full application record page for the current opp
    viewRecord() {
        // make a call to the Navigate method from NavigationMixin and pass in some params and attributes
        // this is a reference to opp card, navigation mixin is class and navigate is method
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.intId,
                actionName: 'view'       
            }
        });
    }

    // create a method that dispatches a custom event with the app ID and Name in the detail property
    intSelected() {
        // create a custom event
        const myEvent = new CustomEvent('intselected', { detail: {intid: this.intId, intname: this.intName} });
        console.log('Int Id' , this.intId);
        // dispatch my custom event
        this.dispatchEvent(myEvent);
        this.viewRecord();
        
    }

    // create a method that a user can invoke to pen the recordModal component and edit the app record
    editInt() {
        // open modal window, open method returns a promise that is resolved whenever the user closes the window
        RecordModal.open({
            size: 'small',
            recordId: this.intId,
            objectApiName: 'Interviewer__c',
            formMode: 'edit',
            layoutType: 'Full',
            headerLabel: 'Edit Interviewer'  
        })  
            .then((result) => {
                console.log(result);
                // check to see how the modal window was closed
                if (result) {
                    // check to see if the result is a success, and is so, dispatch toast event notification
                    if (result.type === 'success') {
                        const myToastEvent = new ShowToastEvent({
                            title: 'Interviewer Saved Successfully',
                            message: 'This application ' + result.detail.fields.Name.value + ' was saved successfully!',
                            variant: 'success',
                            mode: 'dismissible'

                        });
                        // dispatch the toast notification
                        this.dispatchEvent(myToastEvent);
                    }
                }
            })
            .catch((error) => console.log(error));
            
    }
}