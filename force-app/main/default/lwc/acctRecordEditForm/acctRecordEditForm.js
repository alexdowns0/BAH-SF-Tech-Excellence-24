import { LightningElement , api } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import ANNUAL_REV_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';

export default class AcctRecordEditForm extends LightningElement {
    @api recordId;
    @api objectApiName;

    editMode = false;

    // Name, Industry, AnnualRevenue, and Phone fields
    nameField = NAME_FIELD;
    industryField = INDUSTRY_FIELD;
    annualRevField = ANNUAL_REV_FIELD;
    phoneField = PHONE_FIELD;

    toggleMode() {
        this.editMode = !this.editMode;
    }

}