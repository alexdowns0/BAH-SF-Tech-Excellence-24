import { LightningElement, api } from 'lwc';

export default class FormToggle extends LightningElement {

    // these public properties inherit the record context from a record page
    @api recordId;
    @api objectApiName;

    editMode = false;               // boolean property to determine conditional display of oppRecordForm

    // create a method to handle the click of the button
    toggleMode() {
        this.editMode = !this.editMode;
    }

    // create a method to handle the oppsaved event
    handleOppSaved() {
        this.editMode = false;
    }
}