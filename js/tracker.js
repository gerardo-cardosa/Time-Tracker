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

$(window).unload(function(){
	$('.titlename_dps').text('closeeeeeeeeeeeeeeeeeeeeeeeeee');
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

function getItem(id)
{
	for(var i = 0 ; i< info.length; i++)
		{
			if( info[i].Task_ID != undefined &&  info[i].Task_ID ==  id)
			{
				return  info[i];
			}
		}
	return undefined;
}

function isRepeated(item)
{
	var value = false;
	console.log('is repeated ' + item.val() );
	var par =  item.parent()
	par.siblings().each(function(){ 
		console.log($(this).children().first().val());
		if($(this).children('input').first().val() == item.val())
		{
			value = true;
			console.log('value: ' + value );
		}
	});
	return value;
}

function setID(item)
{
	console.log("setId function " + item);
	var item = $('#'+item);
	var sibling = item.siblings('a');
	if(item.val()!='' && getItem(item.val()) == undefined && !isRepeated(item))
	{	
		var parent = item.closest('p');
		parent.attr('id', item.val());		
		sibling.css('display','block');	
		sibling.unbind('click');	
		sibling.click(item.val(), function (e) {			
			e.preventDefault();
			console.log("e.data " + e.data);	
			taskInterface.toggleTimer(e.data);
		});

	}
	else
	{
		sibling.css('display','none');
	}
	
}


function getTasks(){
		
}
