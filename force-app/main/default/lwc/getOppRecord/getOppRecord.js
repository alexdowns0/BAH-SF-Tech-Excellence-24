import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import TYPE_FIELD from '@salesforce/schema/Opportunity.Type';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import STAGE_NAME_FIELD from '@salesforce/schema/Opportunity.StageName';
import CLOSE_DATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';

export default class GetOppRecord extends LightningElement {

    // public property to inherit the record ID from the page
    @api recordId;

    // use the wire decorator to decorate a property to hold the response from the wire service
    // you didn't need to store the imports in a property bc we are not binding to our markup
    // the response will be stored in opportunity
    @wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD, TYPE_FIELD, AMOUNT_FIELD, STAGE_NAME_FIELD, CLOSE_DATE_FIELD]}) 
    opportunity;

    // getter methods to return field values
    get name() {
        return this.opportunity.data.fields.Name.value;
    }

    get type() {
        return this.opportunity.data.fields.Type.value;
    }

    get amount() {
        return this.opportunity.data.fields.Amount.value;
    }

    get stageName() {
        return this.opportunity.data.fields.StageName.value;
    }

    get closeDate() {
        return this.opportunity.data.fields.CloseDate.value;
    }

    renderedCallback() {
        console.log(this.opportunity);
    }
}


