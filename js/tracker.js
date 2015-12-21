/*Constants*/
var URL= 'https://striking-berm-752.appspot.com/_ah/api/';
/*Endpoints*/
var GET_APIS_ENDPOINT= 'discovery/v1/apis';
var POST_QUERYCONFERENCES_ENDPOINT = 'conference/v1/queryConferences';


var googleAuth = new OAuth2('google', {
  client_id: '419716539860-dfj8h05gackg138jnhls0u4q5l1u5e5q.apps.googleusercontent.com',
  client_secret: 'rqra1MNGHREYt2zYBxRBfvGS',
  api_scope: 'https://www.googleapis.com/auth/plus.profile.emails.read https://www.googleapis.com/auth/drive'
});

googleAuth.authorize(function() {
   driveAjax();
});

$(document).ready(function(){
	$('#first').fadeOut('slow');
});

function driveAjax(){

	$.ajax({
  	url: 'https://www.googleapis.com/plus/v1/people/me',
  	type:'GET',
  	 beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer '+ googleAuth.getAccessToken());},
  	success: function(result){
  		modifyContent(JSON.stringify(result))
  	},
  	error: function(xhr,status,error){
  		modifyContent(error)
  	}
  }); 
}

/* Test of Jquery */
$('#button').click(function(){
	$('#content').fadeOut('slow');
});

function modifyContent(resp, xhr)
{
	var content = $('#content');
	//var string = JSON.stringify(resp.items[0]);
	content.html(resp);
}


function getApis(){
	var request = {
		'method': 'GET',
		'parameters': {'alt':'json'}
	};
		
}