import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class AppList extends LightningElement {
    // public property to inherit the position ID
    @api recordId;
    // property to hold the related records to display in UI
    records;   
    // property to hold the object that is provisioned from the wire service             
    results;      
    // property to determine if we have opp records returned         
    appsToDisplay = false; 
    allRecords;

    // use the wire service to invoke the wire adapter function
    // when using wire method, need to pull specific fields and put field.value.... in appList html
    @wire(getRelatedListRecords, { parentRecordId: '$recordId', relatedListId: 'Applications__r',
    fields: ['Application__c.Id', 'Application__c.Name', 'Application__c.Candidate__r.Name', 
    'Application__c.Num_of_Reviews__c', 'Application__c.Status__c', 'Application__c.Review_Score__c']})
    relatedApps(appRecords){
        console.log('Display App Records', appRecords);
        this.results = appRecords;

        if (this.results.data) {
            this.allRecords = this.results.data.records;
            this.records = this.results.data.records;
            this.appsToDisplay = this.records.length > 0 ? true : false;
            // send this to posRelated to show total number of applications per record
            this.dispatchEvent(new CustomEvent('appcount', { detail: this.allRecords.length}))
        }

        if (this.results.error) {
            console.error('Error retrieving applications...');
            this.appsToDisplay = false;
        }
    };

    renderedCallback() {
        console.log(this.records);
    } 
}