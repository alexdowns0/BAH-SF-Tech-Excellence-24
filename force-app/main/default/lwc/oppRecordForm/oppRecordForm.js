import { LightningElement, api } from 'lwc';

export default class OppRecordForm extends LightningElement {

    @api recordId;              // inherits record ID from a record page
    @api objectApiName;         // inherits the Object API Name from a record page
    @api formMode = 'readonly';              // set this property to either readonly, view or edit
    @api layoutType = 'Compact';            // set this property to either Compact or Full

    recordSaved(event) {
        console.log(event);

        // create a custom event
        const myEvent =  new CustomEvent('oppsaved');
        // dispatch the custom event
        this.dispatchEvent(myEvent);
    }

    recordCanceled() {
        const myEvent = new CustomEvent('oppcanceled');
        this.dispatchEvent(myEvent);
    }
}