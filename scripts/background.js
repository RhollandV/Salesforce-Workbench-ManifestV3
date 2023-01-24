chrome.action.onClicked.addListener((tab) =>{
    var urlTail;

    chrome.cookies.getAll({'url':tab.url,'name':'sid'},function (cookie){
        //console.log(JSON.stringify(cookie[0]));
        var sessionId = cookie[0].value;
        var domain = cookie[0].domain
        // If the domain is .salesforce.com, pass to workbench
        if(domain.indexOf('.salesforce.com') > -1) {
            urlTail = urlTail || '';
            urlTail = '/login.php?serverUrlPrefix=' + 'https://'+ domain + '&sid=' + sessionId
            var urlToOpen = 'http://localhost/workbench/' + urlTail;
            console.log(urlToOpen)
            chrome.tabs.create({'url': urlToOpen});
        // Otherwise, use the first 15 chars of the SID to find the salesforce.com SID cookie
        } else {
            var orgID = sessionId.substring(0,15);
            chrome.cookies.getAll({'name':'sid'}, function(cookie) {
                for (i=0; i<cookie.length; i++) {
                    sessionId = cookie[i].value;
                    domain = cookie[i].domain;
                    if (sessionId.indexOf(orgID)>-1 && domain.indexOf('.salesforce.com') > -1) {
                        urlTail = urlTail || '';
                        urlTail = '/login.php?serverUrlPrefix=' + 'https://'+ domain + '&sid=' + sessionId
                        var urlToOpen = 'http://localhost/workbench/' + urlTail;
                        console.log(urlToOpen)
                        chrome.tabs.create({'url': urlToOpen});
                    }
                }
            });
        }
    });
})