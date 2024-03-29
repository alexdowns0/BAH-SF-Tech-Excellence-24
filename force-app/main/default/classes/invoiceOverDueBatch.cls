global class invoiceOverDueBatch implements Database.Batchable<sObject> {


    global Database.QueryLocator start (Database.BatchableContext bc){
        // cutoffDate will be used to compare Due_Date__c to check for overdue invoices
        Date cutoffDate = Date.today();
        // querying all invoices whose due date is before today's date, isFee__c will check if the new invoice has already been
        // created as a result of a late payment (new invoice that is 10% of the original)
        // Late_Fee_Applied__c will determine if the original invoice has resulted in the creation of the new 10% invoice
        String query = 'SELECT ID, Account__c, Opportunity__c, Amount__c, Late_Fee_Applied__c FROM Invoice__c ' +
        'WHERE Due_Date__c < :cutoffDate AND isFee__c = false ' +
        'AND Paid__c = false AND Late_Fee_Applied__c = false';
        
        return Database.getQueryLocator(query);
    }
    

    global void execute(Database.BatchableContext bc, List<Invoice__c> invs){
        List<Invoice__c> feeInvoices = new List<Invoice__c>();
        // for all invoices who have not been paid by today, create a net new invoice that will be the value of 
        // ten percent of the original invoice that has not been paid.  Set the due date to today
        for (Invoice__c i : invs){
            i.Late_Fee_Applied__c = true;
            Invoice__c feeInv = new Invoice__c();
                feeInv.Account__c = i.Account__c;
                feeINv.Opportunity__c = i.Opportunity__c;
                feeInv.Amount__c = i.Amount__c / 10;
                feeInv.isFee__c = true;
                feeInv.Due_Date__c = Date.today();
            feeInvoices.add(feeInv);
        }

        // DML statements to insert the new invoices
        // (DML statements exist outside of the invoice to avoid going over Govenor Limits)
        Database.insert(feeInvoices,false);
        Database.update(invs,false);
    }

    // Return batch ID to the log to confirm completion
    global void finish(Database.BatchableContext bc){
        system.debug('Batch process: '+bc.getJobId() + ' completed');
    }

}