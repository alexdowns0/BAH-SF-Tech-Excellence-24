import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class IntList extends LightningElement {
    // public property to inherit the position ID
    @api recordId;
    // property to hold the related records to display in UI
    records;   
    // property to hold the object that is provisioned from the wire service             
    results;      
    // property to determine if we have opp records returned         
    intsToDisplay = false; 
    allRecords;

    // use the wire service to invoke the wire adapter function
    // when using wire method, need to pull specific fields and put field.value.... in appList html
    @wire(getRelatedListRecords, { parentRecordId: '$recordId', relatedListId: 'Interviewers__r',
    fields: ['Interviewer__c.Id', 'Interviewer__c.Name', 'Interviewer__c.Interviewer__r.Name' ]})
    relatedApps(intRecords){
        console.log('Display Int Records', intRecords);
        this.results = intRecords;

        if (this.results.data) {
            this.allRecords = this.results.data.records;
            this.records = this.results.data.records;
            this.intsToDisplay = this.records.length > 0 ? true : false;
            // send this to posRelated to show total number of applications per record
            this.dispatchEvent(new CustomEvent('intcount', { detail: this.allRecords.length}))
        }

        if (this.results.error) {
            console.error('Error retrieving applications...');
            this.intsToDisplay = false;
        }
    };

    renderedCallback() {
        console.log(this.records);
    } 
}