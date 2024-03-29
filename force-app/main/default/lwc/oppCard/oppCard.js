
import { LightningElement, api } from 'lwc';
import RecordModal from 'c/recordModal';    // import my custom recordModal component
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';



export default class OppCard extends NavigationMixin(LightningElement) {

    // public properties
    @api oppId;
    @api oppName;
    @api oppAmount;
    @api stage;
    @api closeDate;
    @api recordId;
    @api objectApiName;

    // create a method to navigate to the full opportunity record page for the current opp
    viewRecord() {
        // make a call to the Navigate method from NavigationMixin and pass in some params and attributes
        // this is a reference to opp card, navigation mixin is class and navigate is method
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.oppId,
                actionName: 'view'

                
            }
        });
    }

    // create a method that dispatches a custom event with the opp ID and Name in the detail property
    oppSelected() {
        // create a custom event
        const myEvent = new CustomEvent('oppselected', { detail: {oppid: this.oppId, oppname: this.oppName} });

        // dispatch my custom event
        this.dispatchEvent(myEvent);
        this.viewRecord();
    }

    // create a method that a user can invoke to pen the recordModal component and edit the opportunity record
    editOpp() {
        // open modal window, open method returns a promise that is resolved whenever the user closes the window
        RecordModal.open({
            size: 'small',
            recordId: this.oppId,
            objectApiName: 'Opportunity',
            formMode: 'edit',
            layoutType: 'Compact',
            headerLabel: 'Edit Opportunity'  
        })  
            .then((result) => {
                console.log(result);
                // check to see how the modal window was closed
                if (result) {
                    // check to see if the result is a success, and is so, dispatch toast event notification
                    if (result.type === 'success') {
                        const myToastEvent = new ShowToastEvent({
                            title: 'Opportunity Saved Successfully',
                            message: 'This opportunity ' + result.detail.fields.Name.value + ' was saved successfully!',
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