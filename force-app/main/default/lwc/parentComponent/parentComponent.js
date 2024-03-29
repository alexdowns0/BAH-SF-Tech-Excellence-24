import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {
    // property to hold child crying event
    childSpeak;

    handleFit(event) {
        console.log(event);

        this.childSpeak = event.detail;
        // console.log(JSON.stringify(event.detail));
        // console.log(event.detail.prop1);
    }


    constructor() {
        super();
        console.log('Parent component constructor fired...');
    }

    connectedCallback() {
        console.log('Parent component connectedCallback fired...');
    }

    disconnectedCallback() {
        console.log('Parent component discounnectedCallack fired....');
    }

    // rerenderedCallback fires when component has finished rendering
    renderedCallback() {
        console.log('Parent component renderedCallback fired....');
    }
}
