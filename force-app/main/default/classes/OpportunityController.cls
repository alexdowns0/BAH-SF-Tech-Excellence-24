public with sharing class OpportunityController {
    
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> relatedOpps(String accId){
        List<Opportunity> oppsToReturn = [SELECT AccountId, Account.Name, Id, Name, Amount, CloseDate, StageName FROM Opportunity  WHERE AccountId = :accId WITH SECURITY_ENFORCED];
        return oppsToReturn;
    }
    
        
    
}