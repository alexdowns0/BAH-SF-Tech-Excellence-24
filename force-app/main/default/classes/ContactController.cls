public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String accountId){
        List<Contact> contactsToReturn = [SELECT AccountId, Id, Name, Email, Title FROM Contact WHERE AccountId = :accountId WITH SECURITY_ENFORCED];
        return contactsToReturn;
    }
    
        
    
}