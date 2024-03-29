import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import RecordModal from 'c/interviewerRecordModal'; 
export default class PositionCard extends LightningElement {
    // public properties
    @api posId;
    @api posName;
    @api posSalary;
    @api posStatus;
    @api posNumApplications;
    @api posUrgency
    @api rank;
    
    // event for when position record is selected
    positionSelected() {
        const myEvent = new CustomEvent('posselected', { detail: {posid: this.posId, posname: this.posName}});
        this.dispatchEvent(myEvent);
    }

     // getter method to return the account ranking
    get ranking() {
        return this.rank + 1;
    }

    addInterviewer() {
        RecordModal.open({
            size: 'small',
            objectApiName: 'Interviewer__c',
            formMode: 'edit',
            layoutType: 'Full',
            headerLabel: 'Add Interviewer',
            positionRecord: this.posId
        })
            .then((result) => {
                console.log(result);
                // check to see if modal window closed
                if (result) {
                    if (result.type === 'success') {
                        const myToastEvent = new ShowToastEvent({
                            title: 'Interviewer Created Successfully',
                            message: 'Interviewer ' + result.detail.fields.Name.value + ' was Added Successfully!',
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
     

 
}