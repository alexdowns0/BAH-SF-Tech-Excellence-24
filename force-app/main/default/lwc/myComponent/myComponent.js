import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {

    // private boolean property
    showContacts =  true;

    contacts = [
        {Id: '111', Name: 'Alex', Title: 'CEO'},
        {Id: '222', Name: 'Dolly', Title: 'CFO'},
        {Id: '333', Name: 'Jane', Title: 'CIO'}
    ];

    // create a method to toggle the boolean property showContacts
    toggleView() {
        // invert the boolean val
        this.showContacts = !this.showContacts;
    }

}