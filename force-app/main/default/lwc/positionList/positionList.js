import { LightningElement, api, wire } from 'lwc';
import getTopPositions from '@salesforce/apex/PositionController.getTopPositions';
import RecordModal from 'c/recordModal';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import PositionMC from '@salesforce/messageChannel/PositionMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';


export default class PositionList extends LightningElement {
    @api recordId;
    @api posTotalRec;
    // property to hold position records
    pos = [];
    // property to hold provisioned object from wire service
    results;
    records;
    posToDisplay = false;
    @api posId;
    selectedId;
    selectedName;
    status = 'All';
    allRecords;
    totalRecords;

    comboOptions = [
        { label: 'All', value: 'All' },
        { label: 'New', value: 'New' },
        { label: 'Open', value: 'Open' },
        { label: 'Closed', value: 'Closed' }
    ];

    // use wire service to create a MessageContext object required by publish method
    @wire(MessageContext)
    msgContext;

    // create a method to update the list of records to display in the UI based on the value of status
    updateList() {
        this.records = [];
        let currentRecord = [];
        // // determine which records meet the filter criteria, and move them into records
        if (this.status === 'All') {
            this.records = this.pos;
            console.log(this.records, 'all records');
        }
        else {
            for (let i = 0; i < this.pos.length; i++) {
                // move the current reccord into currentRecord
                currentRecord = this.pos[i];

                console.log('Current Record', currentRecord.Status__c);
                // check the records against the status 
                if (this.status === 'Open') {
                    if (currentRecord.Status__c === 'Open') {
                        this.records.push(currentRecord);
                        console.log(this.records, ' are the records that are open', currentRecord);
                    }

                } else if (this.status === 'New') {
                    if (currentRecord.Status__c === 'New') {
                        this.records.push(currentRecord);
                        console.log(this.records);
                        console.log('This is new');
                        console.log(this.records, ' are the records that are new', currentRecord);
                    }
                }

                else {
                    if (currentRecord.Status__c === 'Closed') {
                        this.records.push(currentRecord);
                        console.log('This is closed');
                        console.log(this.records);
                        console.log(this.records, ' are the records that closed', currentRecord);
                    }
                }
            }
        }
        //calculate total record count, and display if they exist
        this.totalRecords = this.records.length;
        this.posToDisplay = this.records.length > 0 ? true : false;
    }

    // create method to handle the selection in combobox
    handleChange(event) {
        // take the value selected from the combobox
        this.status = event.detail.value;
        this.updateList();
        console.log('Handle Change called');
    }

    renderedCallback() {
        console.log(this.records);
    }

    // create a method that user can invoke to open recordModal comp and create new position
    newPosition() {
        RecordModal.open({
            size: 'small',
            objectApiName: 'Position__c',
            formMode: 'edit',
            layoutType: 'Full',
            headerLabel: 'New Postion'
        })
            .then((result) => {
                console.log(result);
                // check to see if modal window closed
                if (result) {
                    if (result.type === 'success') {
                        const myToastEvent = new ShowToastEvent({
                            title: 'Position Created Successfully',
                            message: 'Position ' + result.detail.fields.Name.value + ' was Created Successfully!',
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

    // use wire service to getTopPositions function to return position records
    @wire(getTopPositions)
    wirePositions(posRecs) {
        // move provisioned object into property for refreshing later
        this.results = posRecs;
        console.log(this.results);
        // if data returned, populate pos property with data 
        if (this.results.data) {
            this.pos = this.results.data;
            this.records = this.results.data.records;

            this.selectedId = this.pos[0].Id;
            this.selectedName = this.pos[0].Name;
            this.sendMessageService(this.selectedId, this.selectedName);
            this.posToDisplay = true;
        }

        // log error if it exists
        if (this.results.error) {
            this.posToDisplay = false;
        }
        this.updateList();
    }

    refreshRecords() {
        // pass the property holding the provisioned object to refreshApex
        // refresh wire service to obtain new cache of records
        refreshApex(this.results);
    }

    // create a method to publish the position Id and name to message channel
    sendMessageService(posId, posName) {
        // invoke publish method to publish the position info to the message channel
        publish(this.msgContext, PositionMC, { recordId: posId, positionName: posName });
        console.log(posId, posName);
    }

    // create method to handle the appSelected event
    handlePosEvent(event) {
        if (event.detail.posid != this.selectedId) {
            this.selectedId = event.detail.posid;
            this.selectedName = event.detail.posname;
            console.log('Assigned Ids successfully')
        }

        else {
            console.log('This is not viewable')
        }
    }

    // create method to handle event raised by position card
    handleSelection(event) {
        this.selectedId = event.detail.posid;
        this.selectedName = event.detail.posname;
        console.log(JSON.stringify(event.detail));
        this.sendMessageService(this.selectedId, this.selectedName);
    }
}