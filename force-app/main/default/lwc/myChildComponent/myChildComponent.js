import { LightningElement, api} from 'lwc';

export default class MyChildComponent extends LightningElement {
    @api childName;
    @api age;

    // private property to bind the value of the input
    childSaid = false;

    // create method that dispatches a custom event to the parent component
    respondToParent() {
        this.childSaid = !this.childSaid;

        // create a custom event
        const myEvent = new CustomEvent('crying', { detail: this.childSaid});

        // dispatch my custom event
        this.dispatchEvent(myEvent);
    }

    // constructor fires when component is created
    constructor() {
        super();
        console.log('CHild component constructor fired...');
    }

    // connectedCallback fires when component is inserted into the DOM
    connectedCallback() {
        console.log('Child component connectedCallback fired...');
    }

    disconnectedCallback() {
        console.log('Child component discounnectedCallack fired....');
    }

    // rerenderedCallback fires when component has finished rendering
    renderedCallback() {
        console.log('Child component renderedCallback fired....');
    }
}