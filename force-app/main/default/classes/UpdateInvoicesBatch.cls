global class UpdateInvoicesBatch implements Database.Batchable<SObject>{
    // get all invoices in the org so that they can be updated
    global Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator('SELECT ID FROM Invoice__c WHERE Due_Date__c < date.today()');



    }

    // causes the before update event to then call APPLYLATEFEE method
    global void execute(Database.BatchableContext bc, List<Invoice__c> inv) {

        Database.update(inv, false);
        
    }

    // do stuff on completion as needed
    global void finish(Database.BatchableContext bc) {
        System.debug('Batch process: ' + bc.getJobId() + ' complete');
    }
}