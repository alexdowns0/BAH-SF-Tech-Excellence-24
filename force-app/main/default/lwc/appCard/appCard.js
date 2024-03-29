import { LightningElement, api } from 'lwc';
import RecordModal from 'c/recordModal';    // import my custom recordModal component
import getReviews from '@salesforce/apex/ReviewController.getReviews';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class AppCard extends NavigationMixin(LightningElement) {
    // public properties
    @api appId;
    @api appName;
    @api appCandidate;
    @api appStatus;
    @api appNumOfReviews;
    @api appReviewScore;
    @api recordId;
    @api objectApiName;
    reviews;
    showReviews = false;

    // create a method to navigate to the full application record page for the current opp
    viewRecord() {
        // make a call to the Navigate method from NavigationMixin and pass in some params and attributes
        // this is a reference to opp card, navigation mixin is class and navigate is method
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.appId,
                actionName: 'view'       
            }
        });
    }

    // create a method that dispatches a custom event with the app ID and Name in the detail property
    appSelected() {
        // create a custom event
        const myEvent = new CustomEvent('appselected', { detail: {appid: this.appId, appname: this.appName} });
        console.log('App Id' , this.appId);
        // dispatch my custom event
        this.dispatchEvent(myEvent);
        this.viewRecord();
        
    }

    // create a method that a user can invoke to pen the recordModal component and edit the app record
    editApp() {
        // open modal window, open method returns a promise that is resolved whenever the user closes the window
        RecordModal.open({
            size: 'small',
            recordId: this.appId,
            objectApiName: 'Application__c',
            formMode: 'edit',
            layoutType: 'Full',
            headerLabel: 'Edit Application'  
        })  
            .then((result) => {
                console.log(result);
                // check to see how the modal window was closed
                if (result) {
                    // check to see if the result is a success, and is so, dispatch toast event notification
                    if (result.type === 'success') {
                        const myToastEvent = new ShowToastEvent({
                            title: 'Application Saved Successfully',
                            message: 'This application ' + result.detail.fields.Name.value + ' was saved successfully!',
                            variant: 'success',
                            mode: 'dismissible'

                        });
                        // dispatch the toast notification
                        this.dispatchEvent(myToastEvent);
                    }
                }
            })
            .catch((error) => console.log(error));
            
    }
    
    // return review records
    returnReviews() {
        if (this.showReviews) {
            this.showReviews = false;
        }
        else {
            getReviews({ applicationId: this.appId })
                .then((data) => {
                    console.log('App id: ' , this.appId);
                    this.reviews = data;
                    console.log('This is the data' , data);
                    this.showReviews = true;
                    console.log('Reviews: ', this.reviews);
                })
                .catch((error) => {
                    console.error('Error retriving contact records');
                    this.showReviews = false;
                })
                .finally(() => {
                    console.log('Finally returned review records....');
                });
        }  
    }
}