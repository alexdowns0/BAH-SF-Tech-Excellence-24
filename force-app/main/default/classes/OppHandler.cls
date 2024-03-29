public with sharing class OppHandler {

    public static void applyNamingConvention(List<Opportunity> triggerNew) {
        //trigger.new will be a List<Opportunity> that need to be processed
        //The naming convention is Account Name - Opportunity Type - ClosedMonth/ClosedYear

        //Part One - Gather Ingredients
        //Retrieve any Account Names that we need

        Map<Id, Account> parentAccounts = new Map<Id,Account>();
        Set<Id> parentIds = new Set<Id>();
        for(Opportunity o : triggerNew){
            parentIds.add(o.AccountId);
        }
        for(Account a : [Select Id, Name From Account Where Id IN :parentIds]){
            parentAccounts.put(a.Id,a);
        }

        //Part Two - Do the work
        //Update all the opportunities so that the name field matches the convention
        for(Opportunity o : triggerNew){
            o.Name = parentAccounts.get(o.AccountId).Name + ' - ' + o.Type + ' - ' +
            String.valueOf(o.CloseDate.month()) + '/' + String.valueOf(o.CloseDate.year());
        }
    }

    public static Invoice__c CreateInvoice(Opportunity o) {
        Invoice__c newInvoice = new Invoice__c();
        newInvoice.Opportunity__c = o.id;
        newInvoice.Amount__c = o.Amount;
        newInvoice.Account__c = o.AccountId;
        newInvoice.Due_Date__c = o.CloseDate.addDays(30);
        return newInvoice;

    }
    public static void CreateInvoiceFromOpportunity(List<Opportunity> triggerNew, Map<Id, Opportunity> triggerOldMap) {
        List<Invoice__c> invoiceRecords = new List<Invoice__c>();

        //  && !triggerOldMap.get(o.Id).isWon
        for (Opportunity o : triggerNew) {
            //o.isWon && !trigger.oldMap.get(o.Id).isWon
            if (o.isWon  && !triggerOldMap.get(o.Id).isWon) {
                invoiceRecords.add(CreateInvoice(o));
            }

        }

        if (!invoiceRecords.isEmpty()) {
            Database.insert(invoiceRecords, false);

        }
    }

    public static void CreateInvoiceFromOpportunity(List<Opportunity> triggerNew) {
        List<Invoice__c> invoiceRecords = new List<Invoice__c>();

        //  && !triggerOldMap.get(o.Id).isWon
        for (Opportunity o : triggerNew) {
            //o.isWon && !trigger.oldMap.get(o.Id).isWon
            if (o.isWon) {
                invoiceRecords.add(CreateInvoice(o));
            }

        }

        if (!invoiceRecords.isEmpty()) {
            Database.insert(invoiceRecords, false);

        }
    }
}