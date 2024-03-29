@isTest
private class invoicescontrollertest {

    @isTest
    static void testSave() {
        //Gather ingredients
        //need an invoice
        //need a linked opportunity
        //need a linked account
        Account testAccount = new Account(Name='Test');
        insert testAccount;
        List<Opportunity> testOpp = new List<Opportunity>();
        Opportunity o = new Opportunity();
            o.AccountId = testAccount.Id;
            o.Name = 'Test';
            o.Type = 'New Customer';
            o.Amount = 120000;
            o.StageName = 'Closed Lost';
            o.CloseDate = Date.today();
        insert o;
        //need an instance of the class

        ApexPages.StandardSetController testSSC 
                      = new ApexPages.StandardSetController(new List<Opportunity>{o});
        
         Invoice__c testInvoice = new Invoice__c();
            testInvoice.Opportunity__c = o.Id;
            testInvoice.Account__c = o.AccountId;
            testInvoice.Amount__c = o.Amount;
            testInvoice.Due_Date__c = o.CloseDate + 90;
        PageReference testPage = new PageReference('/');
        Test.setCurrentPage(testPage);
        ApexPages.currentPage().getParameters().put('id', o.Id);
        InvoicesController invExt = new InvoicesController(testSSC);
        invExt.newinvoices.add(testInvoice);
        
        TEst.startTest();
        //Do something that needs testing
        PageReference testPR = invExt.save();
        test.stopTest();

        //Checks to see everything worked
        System.assertEquals('/'+o.Id, testPR.getUrl(), 'Incorrect return URL');
        List<Invoice__c> savedInvoices = [SELECT Id FROM Invoice__c];
        System.assertEquals(1,savedInvoices.size() , 'Incorrect number of invoices created');
    }

    @isTest
    static void testCancel() {
        //Gather ingredients
        //need an invoice
        //need a linked opportunity
        //need a linked account
        Account testAccount = new Account(Name='Test');
        insert testAccount;
        List<Opportunity> testOpp = new List<Opportunity>();
        Opportunity o = new Opportunity();
            o.AccountId = testAccount.Id;
            o.Name = 'Test';
            o.Type = 'New Customer';
            o.Amount = 120000;
            o.StageName = 'Closed Lost';
            o.CloseDate = Date.today();
        insert o;
        //need an instance of the class

        ApexPages.StandardSetController testSSC 
                      = new ApexPages.StandardSetController(new List<Opportunity>{o});
        
         Invoice__c testInvoice = new Invoice__c();
            testInvoice.Opportunity__c = o.Id;
            testInvoice.Account__c = o.AccountId;
            testInvoice.Amount__c = o.Amount;
            testInvoice.Due_Date__c = o.CloseDate + 90;
        PageReference testPage = new PageReference('/');
        Test.setCurrentPage(testPage);
        ApexPages.currentPage().getParameters().put('id', o.Id);
        InvoicesController invExt = new InvoicesController(testSSC);
        invExt.newinvoices.add(testInvoice);
        
        TEst.startTest();
        //Do something that needs testing
        PageReference testPR = invExt.cancel();
        test.stopTest();

        //Checks to see everything worked
        System.assertEquals('/'+o.Id, testPR.getUrl(), 'Incorrect return URL');
        List<Invoice__c> savedInvoices = [SELECT Id FROM Invoice__c];
        System.assertEquals(0,savedInvoices.size() , 'Incorrect number of invoices created');


    }

    @isTest
    static void posInvoiceTestCase() {
        //testDataFactory.createInvoices(1);

        List<Invoice__c> newInvoices = new List<Invoice__c>();  
        Account a = testDataFactory.createValidAccount('Test Account');
        insert a;
        Opportunity o = new Opportunity();
        o.Name = 'test Opp';
        o.Amount = 40;
        o.Type = 'Existing Customer - Upgrade';
        o.StageName = 'Closed Won';
        o.CloseDate = date.Today();
        o.AccountId = a.id;
        insert o;

          
        Invoice__c newInv = new Invoice__c();
        newInv.Name = 'Test Invoice #PositiveTest';
        newInv.Amount__c = 10;
        newInv.Due_Date__c = date.today()-5;
        newInv.paid__c = false;
        newInv.Opportunity__c = o.id;
                
        newInvoices.add(newInv);
        
           
        
        Test.startTest();
        invoiceTriggerHandler.applyLateFeeOnUnpaidInvoice(newInvoices);   
        Test.stopTest();
        System.debug(newInvoices[0].Due_Date__c);
        System.assertEquals(newInvoices[0].Amount__c, 11, 'Incorrect Amount');
        
        
    }

    @isTest
    static void negInvoiceTestCase() {
        List<Invoice__c> newInvoices = new List<Invoice__c>();  
        Account a = testDataFactory.createValidAccount('Test Account');
        insert a;
        Opportunity o = new Opportunity();
        o.Name = 'test Opp';
        o.Amount = 40;
        o.Type = 'Existing Customer - Upgrade';
        o.StageName = 'Closed Won';
        o.CloseDate = date.Today() + 100;
        o.AccountId = a.id;
        insert o;

        
        Invoice__c newInv = new Invoice__c();
        newInv.Name = 'Test Invoice #123';
        newInv.Amount__c = 150;
        newInv.Due_Date__c = date.today()+100;
        newInv.paid__c = false;
        newInv.Opportunity__c = o.id;
                
        newInvoices.add(newInv);

        

        Test.startTest();
        invoiceTriggerHandler.applyLateFeeOnUnpaidInvoice(newInvoices);  
        Test.stopTest();
        System.assertEquals(newInvoices[0].Amount__c, 150, 'Incorrect Amount');     
    }

    @isTest
    static void bulkInvoiceTestCase() {
        List<Invoice__c> newInvoices = new List<Invoice__c>();  
        Account a = testDataFactory.createValidAccount('Test Account for Bulk');
        insert a;
        Opportunity o = new Opportunity();
        o.Name = 'test Opp for Bulk';
        o.Amount = 40;
        o.Type = 'Existing Customer - Upgrade';
        o.StageName = 'Closed Won';
        o.CloseDate = date.Today() + 100;
        o.AccountId = a.id;
        insert o;

        for(Integer i = 0; i < 120; i++){
            Invoice__c newInv = new Invoice__c();
            newInv.Name = 'Test Invoice Bulk #' + String.valueof(i);
            newInv.Amount__c = 150;
            newInv.Due_Date__c = date.today()-100;
            newInv.paid__c = false;
            newInv.Opportunity__c = o.id;
                    
            newInvoices.add(newInv);
        }

        Test.startTest();
        invoiceTriggerHandler.applyLateFeeOnUnpaidInvoice(newInvoices);
        Test.stopTest();

        System.assertEquals(newInvoices[11].tenPercentAdded__c, true, 'Bulk Test Failed');


    }

}