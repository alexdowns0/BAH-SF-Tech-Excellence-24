// this component is used on the Account record page to display a list of related opp records
// I need the account ID to pass to the wire adapter function
// I need to use the wire service to invoke the getRelatedListRecords function
// I need to determine if any records were returned

import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class OppList extends LightningElement {

    // public property to inherit the account ID
    @api recordId;
    @api oppTotalRec;
    @api oppTotalAmt;
    records;                // property to hold the related records to display in UI
    results;                // property to hold the object that is provisioned from the wire service
    oppsToDisplay = false; // property to determine if we have opp records returned
    status = 'All';                // property to hold the val displayed in combobox
    allRecords;            // property to hold ALL related records returned from wire service
    totalRecords;          // property to display the record count for each filter status selected
    totalAmount;           // property to display the total amount for the filter status selected

    comboOptions = [
        { label: 'All', value: 'All'},
        { label: 'Open', value: 'Open'},
        { label: 'Closed', value: 'Closed'},
        { label: 'Closed Won', value: 'ClosedWon'},
        { label: 'Closed Lost', value: 'ClosedLost'}
    ];

    


    // use the wire service to invoke the wire adapter function
    @wire(getRelatedListRecords, { parentRecordId: '$recordId', relatedListId: 'Opportunities',
    fields: ['Opportunity.Id', 'Opportunity.Name', 'Opportunity.StageName', 
    'Opportunity.CloseDate', 'Opportunity.Amount', 'Opportunity.IsWon', 'Opportunity.IsClosed']})
    relatedOpps(oppRecords){
        console.log(oppRecords);
        this.results = oppRecords;

        if (this.results.data) {
            this.allRecords = this.results.data.records;
            this.records = this.results.data.records;
            this.oppsToDisplay = this.records.length > 0 ? true : false;
            this.updateList();
            // send this to accountRelated to show total number of opportunities per account
            this.dispatchEvent(new CustomEvent('oppcount', { detail: this.allRecords.length}))
        }

        if (this.results.error) {
            console.error('Error retrieving opportunities...');
            this.oppsToDisplay = false;
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
         // calculate total record count and amount
         this.totalRecords = this.records.length;
         // reduce method on array object allows us to invoke a callback funtion foreach element in array
         // and perform some type of logic returning the val
         this.totalAmount = this.records.reduce((prev, curr) => prev + curr.fields.Amount.value, 0);
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
                if (this.status === 'Open') {
                    if(!currentRecord.fields.IsClosed.value) {
                        this.records.push(currentRecord);
                    }

                } else if (this.status === 'Closed') {
                    if (currentRecord.fields.IsClosed.value) {
                        this.records.push(currentRecord);
                    }

                } else if (this.status === 'ClosedWon') {
                    if (currentRecord.fields.IsWon.value) {
                        this.records.push(currentRecord);
                    }
                } else if (this.status === 'ClosedLost') {
                    if (currentRecord.fields.IsClosed.value && !currentRecord.fields.IsWon.value) {
                        this.records.push(currentRecord);
                    }
                }
            }
           
        }
        // calculate total record count and amount
        this.totalRecords = this.records.length;
        this.oppTotalRec = 'Opportunities (' , this.totalRecords , ')';
        // reduce method on array object allows us to invoke a callback funtion foreach element in array
        // and perform some type of logic returning the val
        this.totalAmount = this.records.reduce((prev, curr) => prev + curr.fields.Amount.value, 0);
       
       
        // determine if I have records to display
        this.oppsToDisplay = this.records.length > 0 ? true : false;
    }

    renderedCallback() {
        console.log(this.records);
    } 
    
}