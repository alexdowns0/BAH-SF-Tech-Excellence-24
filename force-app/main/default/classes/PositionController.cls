public with sharing class PositionController {
    
    // cacheable needs to be set to true to invoke records in wire service
    @AuraEnabled (cacheable=true)
    public static List<Position__c> getTopPositions() {
        List<Position__c> highestSalary = [SELECT Id, Name, Salary__c, Num_of_Applications__c, Status__c, Urgency__c FROM Position__c  LIMIT 10];
        return highestSalary;
    }
}

