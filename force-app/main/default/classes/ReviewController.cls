public with sharing class ReviewController {
    @AuraEnabled(cacheable=true)
    public static List<Review__c> getReviews(String applicationId){
        List<Review__c> reviewsToReturn = [SELECT Application__c, Id, Name, Interviewer__r.Interviewer__r.Name, Recommend_for_Hire__c, Cultural_Fit__c, Review_Score__c FROM Review__c WHERE Application__c = :applicationId WITH SECURITY_ENFORCED];
        return reviewsToReturn;
    }
}



