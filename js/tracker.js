/*Constants*/
var APP_URL= 'https://traking-1183.appspot.com/_ah/api/timetracker/v1/';
/*Endpoints*/
var GET_TASKS= 'tasks';
var ADD_NEW_TASK = 'taskInsert';
var STOP_WATCH = 'stopWatch';
var START_TASK = 'start';
var SUBMIT = 'submit';

var LDAP;




var googleAuth = new OAuth2('google', {
  client_id: '419716539860-dfj8h05gackg138jnhls0u4q5l1u5e5q.apps.googleusercontent.com',
  client_secret: 'rqra1MNGHREYt2zYBxRBfvGS',
  api_scope: 'https://www.googleapis.com/auth/plus.profile.emails.read https://www.googleapis.com/auth/drive'
});


function buttonAuthorize(){
	googleAuth.authorize(function() {		
		showContent();
	});
}


$(document).ready(function(){
     console.log('document ready ----------- ');
	if(localStorage.isSubmitted == undefined)
	{
		localStorage['isSubmitted'] = true;	
	}
	else
	{
		if(localStorage.isSubmitted == 'false')
		{
			retrieveStored();
		}
	}
	showContent();
	$('#button_authorize').click(function(){
		buttonAuthorize();
	});

	$('#button-submit').click(function(){
		buttonSubmit();
	});
});

$(window).unload(function(){
	$('.titlename_dps').text('closeeeeeeeeeeeeeeeeeeeeeeeeee');
});

function retrieveStored()
{
	console.log('retrieveStoed------------')
	info = JSON.parse(localStorage.info);
	taskInterface.index();
}

function buttonSubmit()
{
	if(tasksRunning())
	{
		showDialog()
		return;
	}

	if(info.length > 0)
	{
		callSubmitEndpoint();
	}
}

function callSubmitEndpoint()
{
	var logs = new Array();//JSON.stringify(info);

	for(var i = 0; i < info.length; i++)
	{
		var data = info[i];
		logs.push({
                        "endTime": data.End_Time,
                        "startTime": data.Start_Time,
                        "ldap": LDAP,
                        "submitted": dateToDDMMYYYY(data.Date_Submitted),
                        "taskID": data.Task_ID
                    });
	}

	var body = { 'logs':logs};
	$.ajax({
                    type: "POST",
                    url: APP_URL + SUBMIT,
                    data: $.toJSON(body),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(response) {
                    	console.log("submit success!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ----- " + response.message);
                    	if(response.code == 200)
                    		{
                    			clearTasks();
                    			localStorage.info = '';
                    			localStorage.isSubmitted = true;
                    		}
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        alert(xhr.status);
                        alert(thrownError);
                        taskInterface.startTask(data);
                        taskInterface.toggleRunText();
                        data.running = true;
                    }
                });
}

function clearTasks(){
	console.log('Clearing tasks!!!!!');
	for(var i = info.length-1 ; i >= 0 ; i--)
	{
		var task = info[i];
		$('#'+ task.Task_ID).remove();
		info.pop();
	}
}

function showDialog()
{
	console.log('Show dialog!!!!!');
	$(function() {
    $( "#dialog-message" ).dialog({
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  });

}

function tasksRunning()
{

	for(var i = 0; i < info.length ; i++)
	{
		if(info[i].running)
		{
			return true;
		}
	}

	return false;
}

function showContent(){
	if(googleAuth.hasAccessToken() )
	{
		$('#holder').show();
		$('#authorize_login').hide();
		setLdap();
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

function dateToDDMMYYYY(date)
{
	var today = new Date(date);
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    var today = mm+'.'+dd+'.'+yyyy;
    return today;
}

function setLdap()
{

	var storedLDAP = localStorage['LDAP'];

	if(storedLDAP == undefined)
	{
	$.ajax({
  	url: 'https://www.googleapis.com/plus/v1/people/me?fields=emails%2Fvalue',
  	type:'GET',
  	 beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer '+ googleAuth.getAccessToken());},
  	success: function(result){
  		//modifyContent(JSON.stringify(result))
  		LDAP = result.emails[0].value;
  		localStorage['LDAP'] = LDAP;
  	},
  	error: function(xhr,status,error){
  		
  	}
  }); 
	}

	else{
		LDAP =  storedLDAP;
	}
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

function setID(item, isIndex)
{
	console.log("setId function " + item);
	var item = $('#'+item);
	var item_val =  item.val().trim();
	var space = ' ';
	var rep = new RegExp(space, 'g');
	item_val = item_val.replace(rep,'_')
	item.val(item_val);
	var sibling = item.siblings('a');
	if(item.val()!='' && (isIndex || getItem(item.val()) == undefined) && !isRepeated(item))
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
