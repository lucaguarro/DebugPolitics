var cssId = 'myCss';  // you could encode the css path itself to generate id..
/*if (!document.getElementById(cssId))
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

function injectFactCheck(){

    console.log("yessss");
    var theButton = document.createElement('a');
    theButton.style.cssText = "color: #aab8c2; display: inline-block; font-size: 16px; line-height: 1; padding: 0 2px; position: relative"
    var iconContainer = document.createElement('div');
    iconContainer.style.cssText = "display: inline-block";

	var insertionarea = document.getElementsByClassName("ProfileTweet-actionList");
    console.log(insertionarea);

    for(var i = 0; i < insertionarea.length; i++){
        var actionContainer = document.createElement('div');
        actionContainer.style.cssText = "display: inline-block; min-width: 80px; border: 2px solid red"
        console.log(i, insertionarea[i]);
        var insertionpoint = insertionarea[i].parentNode;
        insertionpoint.appendChild(actionContainer);        
    }

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