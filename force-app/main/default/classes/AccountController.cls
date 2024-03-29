public with sharing class AccountController {
    @AuraEnabled
    public static List<Account> getAccounts(){
        List<Account> acctsToReturn = [SELECT Id, Name, AnnualRevenue, Phone FROM Account LIMIT 5];
        return acctsToReturn;
    }

    // cacheable needs to be set to true to invoke records in wire service
    @AuraEnabled (cacheable=true)
    public static List<Account> getTopAccounts() {
        List<Account> highestAnnRev = [SELECT Id, Phone, Name, AnnualRevenue FROM Account WHERE AnnualRevenue != NULL ORDER BY AnnualRevenue DESC LIMIT 5];
        return highestAnnRev;
    }
}

