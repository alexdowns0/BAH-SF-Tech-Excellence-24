import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import RecordModal from 'c/recordModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class CaseCard extends NavigationMixin(LightningElement) {

    // public properties
    @api caseId;
    @api caseNumber;
    @api status;
    @api priority;
    @api subject;

    // create method to navigate to full opp record page for current case
    viewRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.caseId,
                actionName: 'view'
            }
        });
    }

    
    // create a method that dispatches a custom event with the case ID and Name in the detail property
    caseSelected() {
        // create a custom event
        const myEvent = new CustomEvent('caseselected',  {detail: {caseid: this.caseId, subject: this.subject} });
        console.log('thing');
        console.log(this.caseId);
        // dispatch my custom event
        this.dispatchEvent(myEvent);
        this.viewRecord();
    }

    // create method that user can invoke to open recordModal comp and edit
    editCase() {
        // open modal window, open method returns promise that is resolved whenever the user closes window
        RecordModal.open({
            size: 'small',
            recordId: this.caseId,
            objectApiName: 'Case', 
            formMode: 'edit',
            layoutType: 'Compact',
            headerLabel: 'Edit Case'
        })
            .then((result) => {
                console.log(result);
                // check to see if modal window closed
                if (result) {
                    if (result.type === 'success') {
                        const myToastEvent = new ShowToastEvent({
                            title: 'Case Saved Successfully',
                            message: 'This case ' + result.detail.fields.CaseNumber.value + ' was saved successfully!',
                            variant: 'success',
                            mode: 'dismissible'
                        });

                        // dispatch toast notification
                        this.dispatchEvent(myToastEvent);
                    }
                }
            })
            .catch((error) => console.log(error));
    }










}