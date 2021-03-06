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
var startTweetIndex = 0;

var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('font-awesome-4.7.0/css/font-awesome.min.css');
(document.head||document.documentElement).appendChild(style);



var buzzWords = ["russia", "obama", "trump", "obamacare", "korea", "politics", "china", "terrorism", "dems", "democrats", "healthcare", "president"];

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
    for(var i = startTweetIndex; i < tweets.length; i++){
        var tweet = tweets[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()—"]/g,"")
        var words = tweet.split(" ");
        words.pop(); //Should probably change this later
    loop2:
        for(var j = 0; j < words.length; j++){
    loop3:
            for(var k = 0; k < buzzWords.length; k++){

                if(words[j].toLowerCase()===buzzWords[k]){

                    politicalTweets.push([words,i]);
                    break loop2;
                }
            }
        }
    }
    console.log("Political", politicalTweets);
    startTweetIndex = tweets.length;
    
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
    var tweetParentsArray = document.getElementsByClassName("js-stream-tweet");
    if(tweetParentsArray.length == 0){return;}

    var tweets = readTweets(tweetParentsArray);
    var politicalTweets = findPoliticalTweets(tweets);
    for(var i = 0; i < politicalTweets.length; i++){       
        let url = createSearchUrl(politicalTweets[i][0]);
        var http = new Http();
        http.makeRequest('GET', url, i).then(
            function (response){
                var actionContainer = document.createElement('div');
                actionContainer.style.cssText = "position: relative; display: inline-block; float: right;"
                var button = document.createElement('button');
                button.addEventListener('click', hideShowList);
                button.style.cssText = "cursor: pointer;"

                var icon = document.createElement('i');
                icon.style.cssText = "font-size: 20px; color: #005689;"
                icon.className += "fa fa-check-circle-o";
                icon.setAttribute("aria-hidden", "true");

                button.appendChild(icon);

                var listContainer = document.createElement('div');
                listContainer.style.cssText = "position: inherit; background-color: #f9f9f9; min-width: 10px; z-index: 1; padding-top: 5px"
                listContainer.style.height = '0';
                listContainer.style.width = '0';
                listContainer.style.visibility = 'hidden';

                var searchContainer = document.createElement('div');
                var searchInput = document.createElement('input');
                searchInput.value = "Search the Guardian";
                searchInput.addEventListener("click", function( e ){
                    e = window.event || e; 
                    if(this === e.target) {
                        e.stopPropagation();
                        if(this.value === "Search the Guardian")
                            this.value = '';
                    }
                });
                var spacer1 = document.createElement('span');
                var spacer2 = document.createElement('span');
                spacer1.style.cssText = "width: 10px; display: inline-block;";
                spacer2.style.cssText = "width: 10px; display: inline-block;";
                var searchSubmitBtn = document.createElement('button');
                searchSubmitBtn.style.cssText = "background-color: #005689; border: none;color: white;padding: 6px 10px;text-align: center;text-decoration: none;display: inline-block;font-size: 14px; border-radius: 5px;";
                searchSubmitBtn.addEventListener("click", onSearch);
                searchSubmitBtn.innerHTML = "Search";

                searchContainer.appendChild(spacer1);
                searchContainer.appendChild(searchInput);
                searchContainer.appendChild(spacer2);
                searchContainer.appendChild(searchSubmitBtn);

                listContainer.appendChild(searchContainer);

                var unorderedList = document.createElement('ul');
                var guardianUrl = chrome.extension.getURL("./guardian2.png");
                console.log(guardianUrl);
                unorderedList.style.listStyleImage = "url(" + guardianUrl + ")";
                actionContainer.appendChild(button);
                actionContainer.appendChild(button);

                var responseJSON = JSON.parse(response[1]);
                var results = responseJSON.response.results;

                var numItems; //How many links to put in the dropdown
                if(results.length < 3){
                    numItems = results.length;
                } else{
                    numItems = 3;
                }
                for(var j = 0; j < numItems; j++){
                    var listItem = document.createElement('li');
                    //listItem.style.cssText = 'url('./theguardian1.jpg')';
                    listItem.style.cssText = 'background-image: ' + guardianUrl + ';';
                    var link = document.createElement('a');
                    link.href = results[j].webUrl;
                    link.innerHTML = results[j].webTitle;
                    link.target = "_blank";
                    link.style.cssText = "position: inherit; padding: 10px 10px; text-decoration: none; display: inline-block;"
                    listItem.appendChild(link);
                    unorderedList.appendChild(listItem);
                }
                listContainer.appendChild(unorderedList);
                index = politicalTweets[response[0]][1];
                var insertionpoint = findClass(tweetParentsArray[index], "ProfileTweet-actionList");
                var insertionPointList = insertionpoint.parentNode; //insertionarea[response[0]].parentNode
                insertionPointList.appendChild(listContainer);
                insertionpoint.appendChild(actionContainer);
            }, function(error){
                console.log("Failed!", error);
            }
        );
    }
}
//sections: world us-news
function createSearchUrl(words){
    var url = "https://content.guardianapis.com/search?section=world%7COR%7Cus-news&q=";
    var numWords = words.length;

    if(words[numWords-1].substring(0,4) === "pic."){
        numWords = numWords - 1;
    }

    for(var i = 0; i < numWords; i++){
        word = words[i];
        var lC = word.length - 1;
        if(word[0] == '@'){
            continue;
        } else if(word[0] === '#'){         
            word = word.slice(1);        
        } else if(word[lC] === '.' | word[lC] === ',' | word[lC] === '!'){
            word = word.slice(0, -1);
        }
        if(i != words.length - 1){
            url = url + words[i] + "%20";
        } else{
            url = url + words[i]
        }
    }
    url = url + "&api-key=a1928b80-4fac-4c41-82fe-4950f60933ad";
    return url;
}

var onSearch = function(){
    var input = this.parentNode.childNodes[1].value;
    //console.log(input);
    var listContainer = this.parentNode.parentNode.childNodes[1];
    let url = createSearchUrl(input.split(' '));
    var http = new Http();
    http.makeRequest('GET', url).then(
        function (response){
            var responseJSON = JSON.parse(response[1]);
            var results = responseJSON.response.results;
            for(var i = 0; i < listContainer.childNodes.length; i++){
                listContainer.childNodes[i].childNodes[0].href = results[i].webUrl;
                listContainer.childNodes[i].childNodes[0].innerHTML = results[i].webTitle;
            }
        }
    );
}



var hideShowList = function(){
    var targetElement = event.target || event.srcElement;
    if(targetElement.nodeName == "I"){
        targetElement = targetElement.parentNode;
    }
    parentElement = targetElement.parentNode.parentNode.parentNode;
    //listContainer = parentElement .getElementsByTagName('div');
    listContainer = (parentElement.childNodes)[5];
    if (listContainer.style.visibility === 'hidden'){
        listContainer.style.visibility = 'visible';
        listContainer.style.height = 'auto';
        listContainer.style.width = 'auto';
    }else{
        listContainer.style.visibility = 'hidden';
        listContainer.style.height = '0';
        listContainer.style.width = '0';
    }
}


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

var prevUrl;
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
        var boiiii = checkPrevTab(window.location.href);
		if (request.greeting == "fire" && boiiii) {
            prevUrl = window.location.href;
			injectFactCheck();		
			sendResponse({farewell: "fired"});
		} else if (request.greeting == "kobe"){
            console.log("Start", startTweetIndex);
            injectFactCheck();
            sendResponse({farewell: "fired2"});
        }
	}
);

function checkPrevTab(theurl){
    var splitPrevUrl;
    var splitCurrUrl = theurl.split('/');
    if(prevUrl){
        splitPrevUrl = prevUrl.split('/');
    }else{return true;}
    if((splitPrevUrl.length == 4 && splitCurrUrl.length == 6) ||
        (splitPrevUrl.length == 6 && splitCurrUrl.length == 4)){
        prevUrl = theurl;
        return false;
    } else{
        return true
    }
}


function Http () {
    /**
     * Helper for http calls
     * @param method
     * @param url
     * @param data
     * @returns {Promise}
     */
    function makeRequest(method,url,data) {
        // Return a new promise.
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open(method, url);

            req.onload = function() {
                if (req.status == 200) {
                    var giveBack = [data, req.response];
                    resolve(giveBack);
                }
                else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = function() {
                reject(Error("Something went wrong ... "));
            };
            req.send(data);
        });
    }
    this.makeRequest = makeRequest;
}