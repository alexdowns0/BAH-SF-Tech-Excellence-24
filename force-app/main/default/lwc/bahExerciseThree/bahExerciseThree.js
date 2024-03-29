import { LightningElement } from 'lwc';
// need to import each specific method
import getAccounts from '@salesforce/apex/AccountController.getAccounts'
import relatedOpps from '@salesforce/apex/OpportunityController.relatedOpps';

export default class BahExerciseThree extends LightningElement {
    showOne = false;
    showTwo = false;
    loadingAccounts = false;
    loadingOpps = false;
    // importing AccountController to populate the 5 accounts queried from acctController
    accounts = [];
    opps = [];


    // create a method to toggle the boolean property showContacts
    toggleSectionOne() {
        if (this.showOne) {
            this.showOne =false;
        }
        else {
            this.loadingAccounts = true;
            // invoke getAccounts, promise object returned when it is invoked
            getAccounts()
                // => passes data to function
                .then((data) => {
                    console.log(data);
                    this.accounts = data;
                    this.showOne = true;
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    console.log('Finally got accounts...');
                    this.loadingAccounts = false;
                });
        }
        
    }

    toggleSectionTwo() {
        
       /*  getAccounts()
             // => passes data to function
             .then((data) => {
                console.log(data);
                this.accounts = data;
                //this.showOne = true;
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                console.log('Finally got accounts...');
                //this.loadingAccounts = false;
            });

             */
        
        if (this.showTwo) {
            this.showTwo =false;
        }
        else {
            if(this.accounts[0]){

            
                this.loadingOpps = true;
                // invoke relatedOpps, promise object returned when it is invoked
                relatedOpps({accId: this.accounts[0].Id})
                    // => passes data to function
                    .then((data) => {
                        console.log(data);
                        this.opps = data;
                        this.showTwo = true;
                    })
                    .catch((err) => {
                        console.error(err);
                    })
                    .finally(() => {
                        console.log('Finally got Opportunities...');
                        this.loadingOpps = false;
                    });
            }
        }
    }
}