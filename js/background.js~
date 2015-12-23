/*Background js for Time Tracker*/

/* Windows events that open the extenssion and prevent the user from reopen it many times*/
var created = true;
var windowId =0;
var wind = chrome.windows.create({url:chrome.extension.getURL("background.html"), type: 'panel', width: 300, height:500}, windowCreated);
chrome.browserAction.onClicked.addListener(function(tab) {

		if(!created)
		{
		wind =chrome.windows.create({url:chrome.extension.getURL("background.html"), type: 'panel'}, windowCreated);
		created = true;
	}
	else{
		chrome.windows.update(windowId, { state: "maximized" } );
	}

});


function windowCreated(window_created)
{	
	windowId = window_created.id;
}

chrome.windows.onRemoved.addListener(function callback(){
	created = false;
});




