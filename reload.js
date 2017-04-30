chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
	if (changeInfo.status == 'complete' && tab.active) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {greeting: "fire"});
        });
    }
})

chrome.webRequest.onCompleted.addListener(function(details) { 
	if (true) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {greeting: "kobe"});
        });
    }
    console.log(); },{urls:["*://*.twitter.com/*"]
});