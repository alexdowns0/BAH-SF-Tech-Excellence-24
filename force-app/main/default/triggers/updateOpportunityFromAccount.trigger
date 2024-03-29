trigger updateOpportunityFromAccount on Account (after update) {
    // if the changes on the account was a change to the Name then we initiate an update to the opportunity
    // trigger.new will tell us which accounts have been changed
    // trigger.oldMap will help us compare the value of the account name before and after
    // loop through trigger.new and see if change occurred, then flag acct id
    Set<Id> accId = new Set<Id>();
    for (Account a : trigger.new) {
        if (a.Name != trigger.oldMap.get(a.Id).Name) {
            accId.add(a.Id);
        }
    }

    // submit work to DB
    List<Opportunity> oppsToUpdate = [SELECT Id FROM Opportunity WHERE AccountId IN : accId];
    List<Database.SaveResult> srList = Database.update(oppsToUpdate, false);
    for(Database.SaveResult sr : srList) {
        System.Debug('Success ?: ' + sr.isSuccess());
    }
}