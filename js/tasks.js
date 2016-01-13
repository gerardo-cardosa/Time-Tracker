/* 
 * TODO.
 */
var someObj = {
    Task_ID: "",
    Date_Submitted: null,
    Start_Time: '00:00:00',
    End_Time: null,
    running: false,
    Total_Effort: 0
};

///////////{}////////////////////////////////////This variable is for testing and should be removed for the final implementation
var info = new Array();

/**
 * Exception hook
 */
function onError(tx, error) {
    alert(error.message);
}


var tasks = {

    insert: function(task, start_time, end_time, total_effort) {


        //task.Task_ID = task.Task_d;
        task.Start_Time = start_time;
        task.End_Time = end_time;
        task.Total_Effort = total_effort;


        jsonObj = $.toJSON(task);
        console.log('insert ' + jsonObj);

        //  $.post(APP_URL + ADD_NEW_TASK,{'json' : jsonObj},function(res) {
        //taskInterface.index();
        //  });

        return task;
    }
}


/**
 * Time tracking user interface Javascript
 */
var taskInterface = {

    intervals: new Array,

    bind: function() {
        // create new task
        $(".create").live("click", function(e) {
            e.preventDefault();

            var task = someObj;
            task.Task_ID = taskInterface.nextID();
            var out = "";
            out += '<p class="item' + (task.running == true ? ' running' : '') + '" id="item' + task.Task_ID + '" rel="' + task.Task_ID + '">';
            //out += '<label for="task-id" style="width:60px;line-height:20px;">' + "Task ID" + '</label>';
            out += '<input type="text" value="" name="' + task.Task_ID + '" id="task-id' + task.Task_ID + '" class="text" placeholder="Task Id..." />';

            //var start = new Date(task.Start_Time);
           // var dif = Number(task.Total_Effort) + Math.floor((new Date().getTime() - start.getTime()) / 1000)
            //out += '<span class="timer">' + taskInterface.hms(0) + '</span>';
            out += '<span class="timer">' + taskInterface.hms(0) + '</span>';

            out += '<a href="#" class="power play ' + (task.running == true ? 'running' : '') + '" title="Timer on/off" rel="' + task.Task_ID + '"  ></a>';
            out += '</p>';


            var formlist = $('#form-list');
            formlist.prepend(out);
            var child = $(formlist.children()[0]);
            child.change('task-id' + task.Task_ID, function(e) {
                setID(e.data, false);
            });




            console.log("create new task############" + $.toJSON(task));
        });




    },

    index: function() {
            

        
        	        var data = info;
        			console.log("show task list############" + data);
        			
        			var len = data.length, i;
        			
        			if (len > 0) {

        				for (i = 0; i < len; i++) {
                            var out = "";
        					var task = data[i];
        			
        					out += '<p class="item' + (task.running == true ? ' running' : '') + '" id="' + task.Task_ID + '" rel="' + task.Task_ID + '">';
        					//out += '<label for="task-id" style="width:60px;line-height:20px;">' + "Task ID" + '</label>';
        					out += '<input type="text" value="' + task.Task_ID + '" id="task-id'  + task.Task_ID +  '" class="text" disabled="true"/>';
        			
        					if (task.running == true) {
        						var start = new Date(task.Date_Submitted);
        						var dif =  Math.floor((new Date().getTime() - start.getTime()) / 1000) + taskInterface.sec(task.Start_Time);
                                console.log('index................................' + dif)
        						out += '<span class="timer">' + taskInterface.hms(dif) + '</span>';
        					} else {
        						out += '<span class="timer">' + task.End_Time + '</span>';
        					}

        					out += '<a href="#" class="power play ' + (task.running == true ? 'running' : '') + '" title="Timer on/off" rel="' + task.Task_ID + '"></a>';
        					out += '</p>';

        					if (task.running == true) {
        						taskInterface.startTask(task); // start task
        					}
                            
                            var formlist = $('#form-list');
                            formlist.prepend(out);
                            var child = $(formlist.children()[0]);
                            setID('task-id'+ task.Task_ID, true);
                            child.change('task-id' + task.Task_ID, function(e) {
                                setID(e.data, false);
                            });
        				}
        			} else {
        				//out = "<p class=\"notask\"><label>No tasks</label></p>"
        			}
        			
        			
        	
    },

    init: function() {
        this.bind();
        //this.index();
        this.toggleRunText();
    },


    toggleTimer: function(id) {

        // Success code to make the app work without call to the API
        var data;
        console.log('toggle id: ' + id);
        data = getItem(id)

        if (data == undefined) {
            datas = {};
            datas.Task_ID = id;
            datas.Date_Submitted = new Date();
            datas.Start_Time = $('#' +id + ' .timer').text();
            datas.End_Time = null;
            datas.running = false;
            datas.Total_Effort = 0;

            info.push(datas);
            data = info[info.length - 1];
        }

        $('#' + data.Task_ID).children('input').attr('disabled', true);
        if (data) {
            
            if (data.running) {
                taskInterface.stopTask(data);
                data.running = false;
                $.ajax({
                    type: "POST",
                    url: APP_URL + STOP_WATCH,
                    data: JSON.stringify({
                        "endTime": $('#' +data.Task_ID + ' .timer').text(),
                        "startTime": data.Start_Time,
                        "ldap": LDAP,
                        "submitted": dateToDDMMYYYY(data.Date_Submitted),
                        "taskID": data.Task_ID
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(response) {

                        console.log("success!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ----- " + response.task_ID);
                        var data_response = getItem(response.task_ID);
                        $('#' + data_response.Task_ID).toggleClass('running');
                        $('#' + data_response.Task_ID + ' .power').toggleClass('running');
                        localStorage.isSubmitted = false;
                        
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        alert(xhr.status);
                        alert(thrownError);
                        taskInterface.startTask(data);
                        taskInterface.toggleRunText();
                        data.running = true;
                    }
                });
                
            } else {
                data.Start_Time = $('#' +id + ' .timer').text();
                $('#' + data.Task_ID).toggleClass('running');
                $('#' + data.Task_ID + ' .power').toggleClass('running');
                taskInterface.startTask(data);
                taskInterface.toggleRunText();
                data.running = true;


            }

        } else {
            var task = tasks.insert(id, '00:00:00', null, 0);
        }

        localStorage.info = JSON.stringify(info);

    },

    //////////////////////////////////////////////////////////////////////////////
    // start task
    //////////////////////////////////////////////////////////////////////////////

    startTask: function(task) {

        console.log('star task: ' + $.toJSON(task));
        window.clearInterval(taskInterface.intervals[task.Task_ID]); // remove timer
        task.Date_Submitted = new Date();


       // task.Start_Time = new Date();

        /*	var start = new Date(); // set start to NOW
		if (task.running == true) {
			//start = new Date(task.Start_Time);
		} else {
			task.running = false;
	//		var task = tasks.insert(task.Task_ID,new Date(task.Start_Time),new Date(), new Date().getTime() - new Date(task.Start_Time).getTime());	
		}
*/
        // setup interval for counter
        taskInterface.intervals[task.Task_ID] = window.setInterval(function() {
           // var dif = Number(task.Total_Effort) + Math.floor((new Date().getTime() - task.Start_Time.getTime()) / 1000)
            var text = $('#' + task.Task_ID + ' .timer').text();
            var val =  taskInterface.sec(text)+1;

            $('#' + task.Task_ID + ' .timer').text(taskInterface.hms(val));

        }, 1000);
	localStorage.isSubmitted = false;

    },

    //////////////////////////////////////////////////////////////////////////////
    // stop task
    //////////////////////////////////////////////////////////////////////////////

    stopTask: function(task) {
        window.clearInterval(taskInterface.intervals[task.Task_ID]); // remove timer
        var start, stop, dif = 0;
        var end = $('#' + task.Task_ID + ' .timer').text();
        var task = tasks.insert(task, task.Start_Time, end, end);// task.Total_Effort + Math.floor((new Date().getTime() - task.Start_Time.getTime()) / 1000));
        var item = getItem(task.Task_ID);
        if (item != undefined) {
            item = task;
        }

    },


    //////////////////////////////////////////////////////////////////////////////
    // toggle RUN text on icon
    //////////////////////////////////////////////////////////////////////////////

    toggleRunText: function() {
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

    hms: function(secs) {
        //secs = secs % 86400; // fix 24:00:00 overlay
        var time = [0, 0, secs],
            i;
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

    sec: function(hms) {
        var t = String(hms).split(":");
        return Number(parseFloat(t[0] * 3600) + parseFloat(t[1]) * 60 + parseFloat(t[2]));
    },

    nextID: function() {
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
