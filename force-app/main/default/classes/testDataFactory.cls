@isTest
public class testDataFactory {

    public static Account createValidAccount(String aName){
        Account a = new Account();
        a.Name = aName;
        return a;
    }

    public static Opportunity createValidOpportunity(Id accId,
                                              Date cDate,
                                              Decimal amount,
                                              String type,
                                              String stage){
        Opportunity o = new Opportunity();
        o.Name = 'test Opp';
        o.Amount = amount;
        o.Type = type;
        o.StageName = stage;
        o.CloseDate = cDate;
        o.AccountId = accId;
        return o;
    }

    public static Account createSingleAccWithOpp(){
        Account a = createValidAccount('Test Account');
        insert a;

        Opportunity o = createValidOpportunity(a.Id,
                                               Date.today(),
                                               3456,
                                               'New Customer',
                                               'Prospecting');
       insert o;
       return a;
    }

    
    public static List<Invoice__c> createInvoices(Integer createNum){
        List<Invoice__c> newInvoices = new List<Invoice__c>();  
        Account a = createValidAccount('Test Account');
        Opportunity o = new Opportunity();
        o.Name = 'test Opp';
        o.Amount = 40;
        o.Type = 'Existing Customer - Upgrade';
        o.StageName = 'Closed Won';
        o.CloseDate = date.Today();
        o.AccountId = a.id;
        insert o;

        for(Integer i=0; i < createNum; i++){
            Invoice__c newInv = new Invoice__c();
                newInv.Name = 'Test Invoice #'+String.valueOf(i);
                newInv.Amount__c = 10 + i;
                newInv.Due_Date__c = date.today()-1;
                newInv.paid__c = false;
                newInv.Opportunity__r.id = o.id;
                
                newInvoices.add(newInv);
        }
    
        return newInvoices;
    }



}