global class applyFeesToOverDueInvoices implements Schedulable {

    //implement execute method to schedule batch class (this will be a daily run to check for invoices that have not been paid)
    global void execute(SchedulableContext sc){
        Id batchInstanceId = Database.executeBatch(new invoiceOverDueBatch());
        System.Debug('BatchId: '+batchInstanceId);
    }
}