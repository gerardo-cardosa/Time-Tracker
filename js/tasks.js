/* 
 * TODO.
 */
var someObj = {
				Task_ID : "",
				Date_Submitted : null,
				Start_Time : new Date(),
				End_Time : null,
				running : true,
				Total_Effort : 0
			};
			
/**
 * Exception hook
 */
function onError(tx, error) {
	alert(error.message);
}


var tasks = {

	insert: function (task_id, start_time,end_time, total_effort) {
	
			var task = someObj;
			task.Task_ID = task_id;
			task.Start_Time = start_time;
			task.End_Time = end_time;
			task.Total_Effort = total_effort;
			
	    	jsonObj = $.toJSON(task);
	    	console.log(jsonObj);
	    	
	        $.post(APP_URL + ADD_NEW_TASK,{'json' : jsonObj},function(res) {
	        	taskInterface.index();
	        });
	        
	        return task;
	}
}


/**
 * Time tracking user interface Javascript
 */
var taskInterface = {

	intervals: new Array,

	bind: function () {
		// create new task
		$(".create").live("click", function (e) {
			e.preventDefault();
			
			var task = someObj;
			task.Task_ID = taskInterface.nextID();
			var out = "";
			out += '<p class="item' + (task.running == true ? ' running' : '') + '" id="item' + task.Task_ID + '" rel="' + task.Task_ID + '">';
			out += '<label for="task-id" style="width:60px;line-height:20px;">' + "Task ID" + '</label>';
			out += '<input type="text" value="" name="' + task.Task_ID + '" id="task-id' + task.Task_ID + '" class="text" />';

			var start = new Date(task.Start_Time);
			var dif = Number(task.Total_Effort) + Math.floor((new Date().getTime() - start.getTime()) / 1000)
			out += '<span class="timer">' + taskInterface.hms(0) + '</span>';
			out += '<span class="timer">' + taskInterface.hms(0) + '</span>';

			out += '<a href="#" class="power play ' + (task.running == true ? 'running' : '') + '" title="Timer on/off" rel="' + task.Task_ID + '"></a>';
			out += '</p>';
			
			console.log("create new task############" + $.toJSON(task));
			
			$('#form-list').prepend(out);
		});


		$(".play").live("click", function (e) {
			
			e.preventDefault();
			taskInterface.toggleTimer($("#task-id" + $(this).attr("rel")).val());
		})

	},

	index: function () {
		
		
		var out = "";
		$.ajax({
			type: "GET",
			url : APP_URL + GET_TASKS,
			data: {},
			success : function(data) {
				
				console.log("show task list############" + data);
				
				var len = data.length, i;
				
				if (len > 0) {
					for (i = 0; i < len; i++) {
						var task = data[i];
				
						out += '<p class="item' + (task.running == true ? ' running' : '') + '" id="item' + task.Task_ID + '" rel="' + task.Task_ID + '">';
						out += '<label for="task-id" style="width:60px;line-height:20px;">' + "Task ID" + '</label>';
						out += '<input type="text" value="' + task.Task_ID + '" id="task-id'  + task.Task_ID +  '" class="text" />';
				
						if (task.running == true) {
							var start = new Date(task.Start_Time);
							var dif = Number(task.Total_Effort) + Math.floor((new Date().getTime() - start.getTime()) / 1000)
							out += '<span class="timer">' + taskInterface.hms(dif) + '</span>';
						} else {
							out += '<span class="timer">' + taskInterface.hms(task.Total_Effort) + '</span>';
						}

						out += '<a href="#" class="power play ' + (task.running == true ? 'running' : '') + '" title="Timer on/off" rel="' + task.Task_ID + '"></a>';
						out += '</p>';

						if (task.running == true) {
							taskInterface.startTask(task); // start task
						}
					}
				} else {
					out = "<p class=\"notask\"><label>No tasks</label></p>"
				}
				
				$("#form-list").empty().append(out).show();
			},
		    error: function (xhr, ajaxOptions, thrownError) {
		        alert(xhr.status);
		        alert(thrownError);
		    }
		});
	},

	init: function () {
		this.bind();
		this.index();
		this.toggleRunText();
	},


	toggleTimer: function (id) {
		
		$.ajax({
			type: "POST",
			url : APP_URL + 'taskTime',
			data: JSON.stringify({Task_ID : id}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success : function(data) {
				if (data) {
					$('#item' + id).toggleClass('running');
					$('#item' + id + ' .power').toggleClass('running');

					if (data.running) {
						taskInterface.stopTask(data);
					} else {
						taskInterface.startTask(data);
						taskInterface.toggleRunText();
					}

				} else {					
					var task = tasks.insert(id,new Date(),null,0);					
				}
				
				
			},
		    error: function (xhr, ajaxOptions, thrownError) {
		        alert(xhr.status);
		        alert(thrownError);
		    }
		});
	},

	//////////////////////////////////////////////////////////////////////////////
	// start task
	//////////////////////////////////////////////////////////////////////////////

	startTask: function (task) {
		window.clearInterval(taskInterface.intervals[task.Task_ID]); // remove timer

		var start = new Date(); // set start to NOW

		if (task.running == true) {
			start = new Date(task.Start_Time);
		} else {
			var task = tasks.insert(task.Task_ID,new Date(task.Start_Time),new Date(), new Date().getTime() - new Date(task.Start_Time).getTime());	
		}

		// setup interval for counter
		taskInterface.intervals[task.Task_ID] = window.setInterval(function () {
			var dif = Number(task.Total_Effort) + Math.floor((new Date().getTime() - start.getTime()) / 1000)
			$('#item' + task.Task_ID + ' .timer').text(taskInterface.hms(dif));
		}, 500);
	},

	//////////////////////////////////////////////////////////////////////////////
	// stop task
	//////////////////////////////////////////////////////////////////////////////

	stopTask: function (task) {
		window.clearInterval(taskInterface.intervals[task.Task_ID]); // remove timer

		var start, stop, dif = 0;
		var task = tasks.insert(task.Task_ID,new Date(task.Start_Time),new Date(), new Date().getTime() - new Date(task.Start_Time).getTime());	
	},


	//////////////////////////////////////////////////////////////////////////////
	// toggle RUN text on icon
	//////////////////////////////////////////////////////////////////////////////

	toggleRunText: function () {
//				if (true) {
//					chrome.browserAction.setBadgeText({
//						text: 'RUN'
//					});
//				} else {
//					chrome.browserAction.setBadgeText({
//						text: ''
//					});
//				}
	},

	//////////////////////////////////////////////////////////////////////////////
	// convert sec to hms
	//////////////////////////////////////////////////////////////////////////////

	hms: function (secs) {
		//secs = secs % 86400; // fix 24:00:00 overlay
		var time = [0, 0, secs], i;
		for (i = 2; i > 0; i--) {
			time[i - 1] = Math.floor(time[i] / 60);
			time[i] = time[i] % 60;
			if (time[i] < 10) {
				time[i] = '0' + time[i];
			}
		}
		return time.join(':');
	},

	//////////////////////////////////////////////////////////////////////////////
	// convert h:m:s to sec
	//////////////////////////////////////////////////////////////////////////////

	sec: function (hms) {
		var t = String(hms).split(":");
		return Number(parseFloat(t[0] * 3600) + parseFloat(t[1]) * 60 + parseFloat(t[2]));
	},

	nextID: function () {
		var id = localStorage['lastid']; // get last id from local storage
		if (id == undefined) {
			id = 1; // generate first ID
		} else {
			id++; // generate next ID
		}
		localStorage['lastid'] = id; // save to localStorage
		return id;
	}

};
