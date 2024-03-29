public with sharing class aiTherapist {

    public List<String> resp = new List<String>();
    public Integer msgCount = 0;

    public aiTherapist() {
        resp.add('Tell me more about that');
        resp.add('Is there anything deeper going on?');
        resp.add('What do you think might cause your perspective to change?');
    }

    public String talk(String msg) {
        String response = resp[msgCount];
        msgCount++;
        System.Debug('msgCount:' + msgCount);
        if(msgCount>resp.size() - 1) {
            msgCount = 0;
        }
        return response;
    }
}



