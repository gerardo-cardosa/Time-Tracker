/*Background js for Time Tracker*/

/* Windows events that open the extenssion and prevent the user from reopen it many times*/
var created = true;
var windowId =0;
var MAIN_HTML = 'popup.html';
var wind = chrome.windows.create({url:chrome.extension.getURL(MAIN_HTML), type: 'panel', width: 350, height:500}, windowCreated);

chrome.browserAction.onClicked.addListener(function(tab) {

		if(!created)
		{
		wind =chrome.windows.create({url:chrome.extension.getURL(MAIN_HTML), type: 'panel', width: 350, height:500}, windowCreated);
		created = true;
	}
	else{
		chrome.windows.update(windowId, { state: "docked" } );
	}

});


function windowCreated(window_created)
{	
	windowId = window_created.id;
}

chrome.windows.onRemoved.addListener(function callback(){
	created = false;
});




