trigger OppMasterTrigger on Opportunity (before insert, after insert, 
                                         before update, after update,
                                         before delete, after delete,
                                         after undelete) {
    // if statements help determine what event is firing off once DML statements execute
    if (trigger.isBefore) {
        if (trigger.isInsert) {
            OppHandler.applyNamingConvention(trigger.new);

        }
        
        if (trigger.isUpdate) {
            OppHandler.applyNamingConvention(trigger.new);
        }

        if (trigger.isDelete) {

        }

    }

    if (trigger.isAfter) {
        if (trigger.isInsert) {
            OppHandler.CreateInvoiceFromOpportunity(trigger.new);
        }
        
        if (trigger.isUpdate) {
            OppHandler.CreateInvoiceFromOpportunity(trigger.new, trigger.oldMap);
        }

        if (trigger.isDelete) {
            
        }

        if (trigger.isUndelete) {

        }

    }
                                        

}