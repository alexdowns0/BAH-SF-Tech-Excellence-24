public with sharing class ApplicationController {
   
    @AuraEnabled(cacheable=true)
    public static List<Application__c> relatedApps(String posId){
        List<Application__c> appsToReturn = [SELECT Position__c, Name, Id, Status__c, Review_Score__c,
        Num_of_Reviews__c, Candidate__r.Name FROM Application__c  WHERE Position__c = :posId WITH SECURITY_ENFORCED];
        return appsToReturn;
    }
}