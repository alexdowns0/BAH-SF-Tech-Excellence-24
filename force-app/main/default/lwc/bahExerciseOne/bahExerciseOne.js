import { LightningElement } from 'lwc';
import GenWattStyle from '@salesforce/resourceUrl/GenWattStyle';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class BahExerciseOne extends LightningElement {
    // Create 3 private properties called firstName, lastName, and jobTitle
    // populate them with string values
    firstName = 'Alex';
    lastName = 'Downs';
    jobTitle = 'Developer';

    // Import the GenWattStyle static resource and 
    // use the constructor to load the style sheet.
    constructor() {
        super();
        loadStyle(this, GenWattStyle)
            // If the style sheet loads successfully, log to the console “Styling now!”
            .then(() => {console.log('Styling now!')})
            // If the style sheet has an error loading, log to the console “No styles loaded.”
            .catch((error) => {console.log('No styles loaded.')});
    }
}