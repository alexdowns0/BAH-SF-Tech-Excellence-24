trigger masterInterviewTrigger on Interviewer__c (before insert, after insert,
                                                before update, after update) {
if (trigger.isBefore) {
if (trigger.isInsert) {

}

if (trigger.isUpdate) {

}
}

if (trigger.isAfter) {
if (trigger.isInsert) {
    interviewerTriggerHandler.createReviewRecordOnInterviewerInsert(trigger.new);

}

if (trigger.isUpdate) {

}
}

}
