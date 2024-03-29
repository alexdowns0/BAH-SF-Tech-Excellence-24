public with sharing class InterviewerHandler {
    /*
    // As a recruiter, when I attach an interviewer to a specific position,
    // I need review records to be generated for each applicant in the interviewing stage
    // so that the designated interviewer can see who they need to meet with
    public static List<Review__c> createRevRecWhenAddingInterToPos(Interviewer__c inter, Position__c pos) {
        // retrieve all applicants for specific position
        //List<Application__c> appsOnPos = [SELECT Id from Application__c WHERE 
         //                               Position__c.id LIKE :pos.id];
        // associate review records on these applicants if they are in the interiewing stage,
        List<Review__c> reviewList = new List<Review__c>();
        for (Application__c a : [SELECT Id from Application__c WHERE 
                                Position__c.id LIKE :pos.id]) {
            if (a.StageName == 'Interviewing') {                       
                Review__c rev = new Review__c();    
                rev.Application__c = a;
                rev.Interviewer = inter;
                reviewList.add(rev);     
            }               
        }
        return reviewList;

    }*/
}
