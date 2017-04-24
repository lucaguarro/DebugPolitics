function injectFactCheck(){
    var actionContainer = document.createElement('div');
    actionContainer.style.cssText = "display: inline-block; min-width: 80px;"
    console.log("yessss");
    var theButton = document.createElement('a');
    theButton.style.cssText = "color: #aab8c2; display: inline-block; font-size: 16px; line-height: 1; padding: 0 2px; position: relative"
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