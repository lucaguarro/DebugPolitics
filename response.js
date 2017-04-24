/*var cssId = 'myCss';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = '/assets/font-awesome.min.css';
    link.media = 'all';
    head.appendChild(link);
}*/

function readTweets(parentElements){
    var tweets = [];
    //var tweetElements = document.getElementsByClassName("TweetTextSize");
    for(var i = 0; i < parentElements.length; i++){
        tweetElement = findClass(parentElements[i],"TweetTextSize");
        tweets.push(tweetElement.textContent);
    }
    return tweets
}

function injectFactCheck(){
    console.log("yessss");
    var theButton = document.createElement('a');
    theButton.style.cssText = "color: #aab8c2; display: inline-block; font-size: 16px; line-height: 1; padding: 0 2px; position: relative"
    var iconContainer = document.createElement('div');
    iconContainer.style.cssText = "display: inline-block";

	var insertionarea = document.getElementsByClassName("ProfileTweet-actionList");
    console.log(insertionarea);

    var tweetParentsArray = document.getElementsByClassName("js-stream-tweet");

    for(var i = 0; i < tweetParentsArray.length; i++){
        var actionContainer = document.createElement('div');
        actionContainer.style.cssText = "display: inline-block; min-width: 80px; border: 2px solid red"
        var insertionpoint = findClass(tweetParentsArray[i], "ProfileTweet-actionList").parentNode; //insertionarea[i].parentNode
        insertionpoint.appendChild(actionContainer);        
    }
    readTweets(tweetParentsArray);
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.greeting == "fire") {
			console.log("yolo swag tits");
			injectFactCheck();		
			sendResponse({farewell: "fired"});
		}
	}
);

function findClass(element, className) {
    var foundElement = null, found;
    function recurse(element, className, found) {
        for (var i = 0; i < element.childNodes.length && !found; i++) {
            var el = element.childNodes[i];
            var classes = el.className != undefined? el.className.split(" ") : [];
            for (var j = 0, jl = classes.length; j < jl; j++) {
                if (classes[j] == className) {
                    found = true;
                    foundElement = element.childNodes[i];
                    break;
                }
            }
            if(found)
                break;
            recurse(element.childNodes[i], className, found);
        }
    }
    recurse(element, className, false);
    return foundElement;
}