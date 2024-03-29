global class UpdateInvoices implements Schedulable{
    
    // implement execute method to schedule batch class
    global void execute(SchedulableContext sc){
        Id batchInstanceId = Database.executeBatch(new UpdateInvoicesBatch());
        System.Debug('BatchId: ' + batchInstanceId);
    }
}