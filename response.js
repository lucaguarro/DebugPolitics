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



var buzzWords = ["obama", "trump", "obamacare", "north korea", "politics", "china", "terrorism", "dems", "democrats", "healthcare", "president"];

function getCNNlink(queryParams){
    theUrl = 'https://services.cnn.com/newsgraph/search/'
    fetch('https://services.cnn.com/newsgraph/search/').then(function(res){ 
        return res.text() 
        }).then(function(dataText){
            tweets = JSON.parse(dataText);
        }
    )
}

function findPoliticalTweets(tweets){
    var politicalTweets = [];
    loop1:
    for(var i = 0; i < tweets.length; i++){
        var words = tweets[i].split(" ");
    loop2:
        for(var j = 0; j < words.length; j++){
    loop3:
            for(var k = 0; k < buzzWords.length; k++){
                
                if(words[j].toLowerCase()===buzzWords[k]){
                    
                    politicalTweets.push([tweets[i],i]);
                    break loop2;
                }
            }
        }
    }
    return politicalTweets
}

function readTweets(parentElements){
    var tweets = [];
    //var tweetElements = document.getElementsByClassName("TweetTextSize");
    for(var i = 0; i < parentElements.length; i++){
        tweetElement = findClass(parentElements[i],"TweetTextSize");
        tweets.push(tweetElement.textContent);
    }
    return tweets;
}

function injectFactCheck(){

    var iconContainer = document.createElement('div');
    iconContainer.style.cssText = "display: inline-block";

	var insertionarea = document.getElementsByClassName("ProfileTweet-actionList");

    var tweetParentsArray = document.getElementsByClassName("js-stream-tweet");
    var tweets = readTweets(tweetParentsArray);
    var politicalTweets = findPoliticalTweets(tweets);
    console.log("kobe", politicalTweets[0][1]);
    for(var i = 0; i < politicalTweets.length; i++){
        var actionContainer = document.createElement('div');
        actionContainer.style.cssText = "position: relative; display: inline-block;"
        var button = document.createElement('button');
        button.addEventListener('click', myFunction);
        //button.className = "debugPoliticsButton";
        button.style.cssText = "padding: 10px; font-size: 16px; border: 5px solid green; cursor: pointer;"
        var items = document.createElement('div');
        items.style.cssText = "position: inherit; background-color: #f9f9f9; min-width: 10px; z-index: 1;"
        var list1 = document.createElement('a');
        list1.style.cssText = "position: inherit; padding: 10px 10px; text-decoration: none; display: inline-block;"
        var list2 = document.createElement('a');
        list1.style.cssText = "position: inherit; padding: 10px 10px; text-decoration: none; display: inline-block;"
        var list3 = document.createElement('a');
        list1.style.cssText = "position: inherit; padding: 10x 10px; text-decoration: none; display: inline-block;"
        var insertionpoint = findClass(tweetParentsArray[politicalTweets[i][1]], "ProfileTweet-actionList").parentNode; //insertionarea[i].parentNode
        insertionpoint.appendChild(actionContainer);
        actionContainer.appendChild(button);
        button.appendChild(items);
        items.appendChild(list1);
        items.appendChild(list2);
        items.appendChild(list3); 
    }
    /*for(var i = 0; i < tweetParentsArray.length; i++){
        var actionContainer = document.createElement('div');
        actionContainer.style.cssText = "display: inline-block; min-width: 80px; border: 2px solid red"
        var insertionpoint = findClass(tweetParentsArray[i], "ProfileTweet-actionList").parentNode; //insertionarea[i].parentNode
        insertionpoint.appendChild(actionContainer);        
    }*/
    //var url = createSearchUrl(words);
    //var url = "https://eventregistry.org/json/article?ignoreKeywords=&keywords=Donald%20Trump&action=getArticles&resultType=articles&callback=JSON_CALLBACK&apiKey=6f51b1a6-3665-4487-97d2-1c72a2d6b617";
    //guardian-key: a1928b80-4fac-4c41-82fe-4950f60933ad
    //console.log(httpGet(url));

    /*fetch(url)
        .then(checkStatus)
        .then(getJSON)
        .then(function(data){
            console.log('DATA', data);
        })
        .catch(function(err){
            console.log('ERROR', err);
        });*/
}

var myFunction = function(){
    console.log("yolo swag kobeeee");
}

function createSearchUrl(words){
    var url = "http://content.guardianapis.com/search?q=";
    for(var i = 0; i < words.length; i++){
        if(i != words.length - 1){
            url = url + words[i] + "%20";
        } else{
            url = url + words[i]
        }   
    }
    url = url + "&api-key=a1928b80-4fac-4c41-82fe-4950f60933ad";
    return url; 
}

function checkStatus(response){
    if(response.status === 200){
        return Promise.resolve(response);
    } else{
        return Promise.reject(
            new Error(response.statusText)
        );
    }
}

function getJSON(response){
    return response.json();
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
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