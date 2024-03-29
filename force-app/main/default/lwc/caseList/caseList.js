// this component is used on the Account record page to display a list of related opp records
// I need the account ID to pass to the wire adapter function
// I need to use the wire service to invoke the getRelatedListRecords function
// I need to determine if any records were returned

import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class CaseList extends LightningElement {
    // public property to inherit the account ID
    @api recordId;

    records;                // property to hold the related records returned from the wire service
    results;                // property to hold the object that is provisioned from the wire service
    casesToDisplay = false; // property to determine if we have case records returned
    status = 'All';
    allRecords;
    totalRecords;
    
    comboOptions = [
        { label: 'All', value: 'All'},
        { label: 'New', value: 'New'},
        { label: 'Working', value: 'Working'},
        { label: 'Escalated', value: 'Escalated'},
        { label: 'Closed', value: 'Closed'}
    ];






    // use the wire service to invoke the wire adapter function
    @wire(getRelatedListRecords, { parentRecordId: '$recordId', relatedListId: 'Cases',
        fields: ['Case.Id', 'Case.CaseNumber', 'Case.Subject', 'Case.Status', 'Case.Priority']})
    wiredCases(caseRecords){
    this.results = caseRecords;

    if (this.results.data) {
        this.allRecords = this.results.data.records;
        this.records = this.results.data.records;
        this.casesToDisplay = this.records.length > 0 ? true : false;
        this.updateList();
        // send this to accountRelated to show total number of cases per account
        this.dispatchEvent(new CustomEvent('casecount', { detail: this.allRecords.length}))
        
    }

    if (this.results.error) {
        console.error('Error retrieving cases...');
        this.casesToDisplay = false;
        }
    };

    // create method to handle the selection in combobox
    handleChange(event) {
        this.status = event.detail.value;               // take the value selected from the combobox
        this.updateList();
    }
    

    // create a method to update the list of records to display in the UI based on the value of status
    updateList() {
        // clear out the array of records displaying in the UI
        this.records = [];
        let currentRecord = {};
        // determine which records meet the filter criteria, and move them into records
        if (this.status === 'All') {
            this.records = this.allRecords; // move full array of allRecords into records
        }

        else {
            for (let i = 0; i < this.allRecords.length; i++) {
                // move the current reccord into currentRecord
                currentRecord = this.allRecords[i];
                // check the records against the status 
                if (this.status === 'New') {          
                    if (currentRecord.fields.Status.value == 'New') {
                        this.records.push(currentRecord);
                    }
                } else if (this.status === 'Working') {    
                    if (currentRecord.fields.Status.value == 'Working') {
                        this.records.push(currentRecord);
                    }                     
                } else if (this.status === 'Escalated') { 
                    if (currentRecord.fields.Status.value == 'Escalated') {
                        this.records.push(currentRecord);
                    }                                                      
                } else if (this.status === 'Closed') {      
                    if (currentRecord.fields.Status.value == 'Closed') {
                        this.records.push(currentRecord);
                    }              
                }
            }
        
        }
        // calculate total record count and amount
        this.totalRecords = this.records.length;
        // reduce method on array object allows us to invoke a callback funtion foreach element in array
        // and perform some type of logic returning the val

        // determine if I have records to display
        this.casesToDisplay = this.records.length > 0 ? true : false;
    }    
}