import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class RecordModal extends LightningModal{
    // public properties to hold values for displaying/editing/creating a record
    // create a few public properties to pass in vals 
    @api recordId;
    @api objectApiName;
    @api formMode;
    @api layoutType;
    @api headerLabel;

    handleCancel() {
        this.close('modcancel');
    }

    handleSuccess(event) {
        this.close(event);
    }


}