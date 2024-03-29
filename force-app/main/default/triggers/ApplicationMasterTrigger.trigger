trigger ApplicationMasterTrigger on Application__c (before insert, after insert,
                                                   before update, after update) {
    if (trigger.isBefore) {
        if (trigger.isInsert) {

        }

        if (trigger.isUpdate) {

        }
    }

    if (trigger.isAfter) {
        if (trigger.isInsert) {

        }

        if (trigger.isUpdate) {
            applicationTriggerHandler.createReviewRecordOnApplicationUpdate(trigger.new, trigger.oldMap);

        }
    }

}