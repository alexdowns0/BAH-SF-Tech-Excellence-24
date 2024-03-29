import { LightningElement, api, wire } from 'lwc';
import relatedApps from '@salesforce/apex/ApplicationController.relatedApps';
import { refreshApex } from '@salesforce/apex';

export default class RelatedAppsComponent extends LightningElement {

    // public property to inherit the Position ID from the position record page
    @api recordId;
    @api objectApiName;
    // property to determine whether to display the lightning-record-form or not
    showOne = false; 
    // property to hold the related app records       
    apps = [];              

    // property to hold the provisioned object from the wire service
    results;      
    // property to display the opp ID received in the event          
    selectedId;  
     // property to display the opp Name received in the event           
    selectedName;          

    // use the wire service to invoke relatedApps Apex method
    @wire(relatedApps, { posId: '$recordId'})
    wiredOpps(appRecs) {
        // without this statement you cannot refresh apex
        this.results = appRecs;

        // if data is returned, populate apps with data
        if (this.results.data) {
            this.apps = this.results.data;
        }

        // if error returned, log the error
        if (this.results.error) {
            console.error(error);
        }
    }

    // create method to handle appselected event
    handleAppEvent(event) {
        if (event.detail.appid != this.selectedId) {
            this.showOne = true;
            
            this.selectedId = event.detail.appid;
            this.selectedName = event.detail.appname;
            console.log('Selected Id', this.selectedId);
        }
        
        else {
            this.showOne = false;
        }
    }

     // method to invoke relatedApps that will return a list of related app records for the position ID
    connectedCallback() {
        // invoke relatedApps apex method
        relatedApps({ posId: this.recordId })
            .then((data) => {
                this.apps = data;
                console.log('got the apps');
            })
            .catch((error) => {
                console.error(error);
                this.apps = undefined;
            })
            .finally(() => {
                console.log('Finally returned app records....');
            });
    } 

    // method to retrieve app records
    getRelatedApps() {
        relatedApps({ posId: this.recordId })
            .then((data) => {
                this.apps = data;
            })
            .catch((error) => {
                console.error(error);
                this.apps = undefined;
            })
            .finally(() => {
                console.log('Finally returned app records....');
            });
    }

    refreshRecords() {
        // pass the property holding the provisioned object to refreshApex
        // refresh wire service to obtain new cache of records
        refreshApex(this.results);      
    }
}