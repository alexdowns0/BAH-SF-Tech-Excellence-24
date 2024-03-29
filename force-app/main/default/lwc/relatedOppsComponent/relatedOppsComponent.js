import { LightningElement, api, wire } from 'lwc';
import relatedOpps from '@salesforce/apex/OpportunityController.relatedOpps';
import { refreshApex } from '@salesforce/apex';

export default class RelatedOppsComponent extends LightningElement {

    // public property to inherit the Account ID from the account record page
    @api recordId;
    @api objectApiName;
    showOne = false;        // property to determine whether to display the lightning-record-form or not
    opps = [];              // property to hold the related opp records

    results;                // property to hold the provisioned object from the wire service
    selectedId;             // property to display the opp ID received in the event
    selectedName;           // property to display the opp Name received in the event

    // use the wire service to invoke relatedOpps Apex method
    @wire(relatedOpps, { accountId: '$recordId'})
    wiredOpps(oppRecs) {
        // withojut this statement you cannot refresh apex
        this.results = oppRecs;

        // if data is returned, populate opps with data
        if (this.results.data) {
            this.opps = this.results.data;
        }

        // if error returned, just log error
        if (this.results.error) {
            console.error(error);
        }

    }

    // create method to handle oppselected event
    handleOppEvent(event) {
   
        if (event.detail.oppid != this.selectedId) {
            this.showOne = true;
            this.selectedId = event.detail.oppid;
            this.selectedName = event.detail.oppname;
        }
        
        else {
            this.showOne = false;
        }
    }

    // method to invoke relatedOpps that will return a list of related opp records for the account ID
    // getRelatedOpps() {
    connectedCallback() {
        // invoke relatedOpps apex method
        relatedOpps({ accountId: this.recordId })
            .then((data) => {
                this.opps = data;
            })
            .catch((error) => {
                console.error(error);
                this.opps = undefined;
            })
            .finally(() => {
                console.log('Finally returned opp records....');
            });
    }

    // method to retrieve opp records
    getRelatedOpps() {
        relatedOpps({ accountId: this.recordId })
            .then((data) => {
                this.opps = data;
            })
            .catch((error) => {
                console.error(error);
                this.opps = undefined;
            })
            .finally(() => {
                console.log('Finally returned opp records....');
            });
    }

    refreshRecords() {
        // this.getRelatedOpps();
        refreshApex(this.results);      // pass the property holding the provisioned object to refreshApex
                                        // refresh wire service to obtain new cache of records
    }
}