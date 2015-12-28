/*Constants*/
var APP_URL= 'localhost:8081/';
/*Endpoints*/
var GET_TASKS= 'tasks';
var ADD_NEW_TASK = 'taskInsert';
var STOP_TASK = 'stop';
var START_TASK = 'start';



var googleAuth = new OAuth2('google', {
  client_id: '419716539860-dfj8h05gackg138jnhls0u4q5l1u5e5q.apps.googleusercontent.com',
  client_secret: 'rqra1MNGHREYt2zYBxRBfvGS',
  api_scope: 'https://www.googleapis.com/auth/plus.profile.emails.read https://www.googleapis.com/auth/drive'
});


function buttonAuthorize(){
	googleAuth.authorize(function() {
		showContent()
	});
}


$(document).ready(function(){
	showContent();
	$('#button_authorize').click(function(){
		buttonAuthorize();
	});
});

function showContent(){
	if(googleAuth.hasAccessToken())
	{
		$('#holder').show();
		$('#authorize_login').hide();
	}
	else
	{
		$('#authorize_login').show();
		$('#holder').hide();
	}
}

function driveAjax(){

	$.ajax({
  	url: 'https://www.googleapis.com/plus/v1/people/me',
  	type:'GET',
  	 beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer '+ googleAuth.getAccessToken());},
  	success: function(result){
  		//modifyContent(JSON.stringify(result))
  	},
  	error: function(xhr,status,error){
  		//modifyContent(error)
  	}
  }); 
}


function modifyContent(resp, xhr)
{
	//var content = $('#content');
	//var string = JSON.stringify(resp.items[0]);
	//content.html(resp);
}


function getTasks(){
		
}
