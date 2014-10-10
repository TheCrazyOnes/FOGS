$(document).ready(function(){
    
	
});

var userInfo = {
	currentSubject : -1,
	selectedSubject : -1
};

function UniversalKeyUp()
{
    if(event.which == 27 && PopupWindow.IsOpen)
    {
         PopupWindow.Close();
    }
}


function HideAbout()
{
	Animate($("#about-pane"), "slideOutDown", function(){
		$("#about-pane").remove();
	},500,true);
}

function ShowAbout()
{
	
	var html = '<div id = "about-pane" class = "absolute-center layer-4 animated slideInUp">\
	<div onclick="HideAbout()" class = "glyphicon glyphicon-remove"></div>\
	<div id = "login-logo" class="absolute-center">\
		<img src="images/logo-blue.png">\
			<span>FOGS</span>\
		<div id = "caption">Developement Team</div>\
		</div>\
		<div class = "row">\
			<div class="col-xs-4">\
				<div id = "luigi" class="absolute-center">\
					<div class="image" style="background-image: url(images/luigi.png);"></div>\
					<div>Mendoza, Luigi</div>\
					<div class="position">Front-end Developer</div>\
					<div class="note">summis exquisitaque firmissimum efflorescere o incididunt reprehenderit si \
					concursionibus singulis </div>\
				</div>\
			</div>\
			<div class="col-xs-4">\
				<div id = "louie" class="absolute-center">\
					<div class="image" style="background-image: url(images/louie.png);"></div>\
					<div>Almeda, Mark Louie</div>\
					<div class="position">Team Lead</div>\
					<div class="note">"Everyone has his own limit, but he is the one who is setting it."</div>\
				</div>\
			</div>\
			<div class="col-xs-4">\
				<div id = "Rovie" class="absolute-center">\
					<div class="image" style="background-image: url(images/rovie2.png);"></div>\
					<div>Labutap, Rocelle Vie</div>\
					<div class="position">Back-end Developer</div>\
					<div class="note">doctrina an te do eu nisi praetermissum id arbitrantur quamquam imitarentur an quo</div>\
				</div>\
			</div>\
		</div>\
	</div>';
	
	$("body>.inner").append(html);
	
//	PopupWindow.Show({
//		Html: html,
//		Size: {Width: "100%", Height: "100%"}
//	});
}

/*==========================*/
/*=======Grade menu======*/
/*========================*/

function EditGradeSettings()
{
	PopupWindow.Show({ 
		Content: windowContent.Simple, 
		Title: "Edit components", 
		ActionButtons: '<a tabindex=0 onclick = "EditGradeSettingsRequest();" class="btn blue pull-right">Next</a> <a tabindex=0 onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
		Size: {Width: 281, Height: 155}, 
		OnRender:function(){
			var str = "Enter password to confirm <input type = 'password' placeholder='password' style='display: block; width: 100%'>";
			$(".window .body .inner").html(str);    
		}
	});
}

function EditGradeSettingsRequest()
{
	var password = $(".window .inner input").val();

	var vars = {method: "EditGradeSettings"};
	vars.Password = password;
	
	$.post("php/frontend-com.php",vars,function(data){
		data = JSON.parse(data);
		
		if(data.State == "error")
		{
			PopupWindow.Show({ 
				Type: "error",
				Content: windowContent.Simple, 
				Title: "Wrong password", 
				ActionButtons: '<a tabindex=0 onclick = "EditGradeSettings();" class="btn blue pull-right">Ok</a> <a tabindex=0 onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
				Size: {Width: 250, Height: 155},
				OnRender:function(){
					$(".window .body .inner").html("You've entered a wrong password");
				}
			});
		}
		else
		{
			PopupWindow.Show({ 
				Content: windowContent.Simple, 
				Title: "Grade Settings", 
				ActionButtons: '<a tabindex=0 onclick = "SaveGradeSettings();" class="btn blue pull-right">Save</a> <a tabindex=0 onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
				Size: {Width: 250, Height: 265},
				OnRender:function(){
					
					var btns = "";
					for(var key in userInfo.SubjectDetails.Component)
					{

						btns += "<div class='switch "+(userInfo.SubjectDetails.Component[key].locked == "false" ? "" : "on") +"' data-key='"+key+"' onclick='toggleSwitch(this)'>"+key+"</div>";
					}
					
					$(".window .body .inner").html("<div id = 'base'>Base: "+userInfo.SubjectDetails.Base+"</div><input onchange='ShowBaseTicks(this)' type='range' max = '70' min = '0' step = '10' value = '"+userInfo.SubjectDetails.Base+"'> Lock terms" + btns);
				}
			});
			
		}
		
	});
}

function toggleSwitch(sender)
{
	$(sender).toggleClass("on");
}

function ShowBaseTicks(sender)
{
	$(sender).siblings("#base").html("Base: " + sender.value);
}

function SaveGradeSettings()
{
	var base = $(".window .inner input").val();
	
	var switches = {};
	$(".window .inner .switch").each(function(i,e){
		switches[$(e).attr("data-key")] = $(e).hasClass("on");
	});
		
	for(var key in userInfo.SubjectDetails.Component)
	{
		userInfo.SubjectDetails.Component[key].locked = switches[key];
	}
	

	var vars = {method: "SaveGradeSettings"};
	vars.Base = base;
	vars.Component = userInfo.SubjectDetails.Component;
	$.post("php/frontend-com.php",vars,function(data){
		
		data = JSON.parse(data);
		ImplementSubject(data);
		PopupWindow.Close();
	});	
}

/*==========================*/
/*=======Reports menu======*/
/*========================*/

function DownloadReport()
{
	$.post("php/frontend-com.php",{method:"ViewSubjectRecords"},function(data){

		var lines = [];
		data = JSON.parse(data);
		
		var head = [];
		var tmpField = userInfo.SubjectDetails.Component;
		head[head.length] = "<th class = 'testing'>Name</th>";
		GetFields(tmpField, head, 0);
		head[head.length] = "<th>Final Grade</th>";
		$("#reports table thead tr").append(head.join("\n"));

		var strToSend = "";
		
		head = head.join("");
		
		head = head.split(/<\/?th.{0,19}>/g).clean("");
	
		lines[lines.length] = head;
//		strToSend += head.join(",") + "\n\r";
		
		for(var i =0; i < data.length; i++)
		{
			var str = [];

			var tmp = clone(userInfo.SubjectDetails.Component);

			MergeComponent(tmp, data[i].Grade);

			var finalGrade = 0;
			for (var key in tmp) {
				if(typeof tmp[key] == "object")
					finalGrade += tmp[key].sub.value;
			}

			var state = "";
			if(finalGrade < 75)
			{
				state = "fail";
			}

			str[str.length] = "<tr class = '"+state+"'>";
			str[str.length] = "<td>" + data[i].Name + "</td>";
			GetGrades(tmp, str, 0);
			str[str.length] = "<td>"+finalGrade+"%</td>";
			str[str.length] = "<td></td>";
			str[str.length] = "</tr>";
			

			str = str.join("").split(/<\/?td?r?[^>]*>/g).clean("");
			
			lines[lines.length] = str;
			
//			strToSend += "'"+str.join("','") + "'" + "\n\r";
		}
		
		$.post("php/frontend-com.php",{method: "DownloadReport", data: lines}, function(data){
//			alert(data);
			data = JSON.parse(data);
			
			PopupWindow.Show({ 
				Content: windowContent.Simple, 
				Title: "Download Report", 
				ActionButtons: '<a tabindex=0 href="'+data.link+'" onclick = "PopupWindow.Close();" class="btn blue pull-right">Download</a> <a tabindex=0 onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
				Size: {Width: 281, Height: 155}, 
				OnRender:function(){
					var str = "You request is ready to download";
					$(".window .body .inner").html(str);    
				}
			});
//			alert(data);
		});
		
	});
}


function ViewSubjectRecords()
{
	$(".main").waitMe({
		effect : 'stretch',
		text : 'Crunching data...',
		bg : "#BBB",
		color : "#333"
	});
	$(".main #grade-editor").css("display","none");
	$(".main #reports").css("display","block");
	
	$(".main #reports thead tr").html("<th>Name</th>");
	$(".main #reports tbody").html("");
	
	var vars = {method: "ViewSubjectRecords"};
	
	$.post("php/frontend-com.php",vars,function(data){
		data = JSON.parse(data);
		
		var head = []
		var tmpField = userInfo.SubjectDetails.Component;
		GetFields(tmpField, head, 0);
		head[head.length] = "<th class = 'final'>Final Grade</th>";
		head[head.length] = "<th>&nbsp;</th>";
		$("#reports table thead tr").append(head.join("\n"));
		
		for(var i =0; i < data.length; i++)
		{
			var str = [];
			
			var tmp = clone(userInfo.SubjectDetails.Component);
			
			MergeComponent(tmp, data[i].Grade);

			
			var finalGrade = 0;
			for (var key in tmp) {
//				alert(JSON.stringify(tmp[key]));
				if(typeof tmp[key] == "object")
					finalGrade += tmp[key].sub.value;
			}
			
			var state = "";
			if(finalGrade < 75)
			{
				state = "fail";
			}
			
			
			str[str.length] = "<tr class = '"+state+"'>";
			str[str.length] = "<td>" + data[i].Name + "</td>";

			
			GetGrades(tmp, str, 0);
			
			str[str.length] = "<td>"+MaxLength(finalGrade,5)+"%</td>";
			str[str.length] = "<td></td>";
			str[str.length] = "</tr>";
			
			
			$("#reports table tbody").append(str.join("\n"));
			
			var widest = 0;
			$("#reports table tbody td:first-child").each(function(i,e){
				if(widest < $(e).outerWidth())
					widest = $(e).outerWidth();
			})
			
			$("#reports table td:first-child, #reports table th:first-child").css("width", widest + "px");
			$("#reports table").css("margin-left", widest - 10 + "px");
		}
		
		$(".main").waitMe("hide");
	});
	
	
	
}

function GetFields(node,str,level)
{
	for (var key in node) 
	{

		if(node[key].sub != null)
		{
			str[str.length] = "<th class = 'level-"+level+"'>" + key +"</th>";
			GetFields(node[key].sub, str, ++level);
			--level;
		}
		else
		{
			str[str.length] = "<th class = 'level-"+level+"'>" + key +"</th>";
//			str[str.length] = "<td>" + node[key].grade + "</td>";	
		}
	}
}

function GetGrades(node, str, level)
{
	for (var key in node) 
	{

		if(node[key].sub != null)
		{
			var state = "";
			if(node[key].sub.grade < 75)
				state = "fail";
			
			str[str.length] = "<td class = 'level-"+level+" "+state+"'>" + MaxLength(node[key].sub.grade,5) +"%</td>";
			GetGrades(node[key].sub, str, ++level);
			--level;
		}
		else
		{
			if(key == "grade" || key == "value")
			{
				--level;	
				return;
			}
			
			var state = "";
			if(node[key].grade < 75)
				state = "fail";
			
			str[str.length] = "<td class = 'level-"+level+" "+state+"'>" + MaxLength(node[key].grade,5) + "%</td>";	
		}
	}
	
	--level;
}

/*==========================*/
/*======Component menu=====*/
/*========================*/

function EditComponent()
{
	PopupWindow.Show({ 
		Content: windowContent.Simple, 
		Title: "Edit components", 
		ActionButtons: '<a tabindex=0 onclick = "EditComponentRequest();" class="btn blue pull-right">Next</a> <a tabindex=0 onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
		Size: {Width: 281, Height: 155}, 
		OnRender:function(){
			var str = "Enter password to confirm <input type = 'password' placeholder='password' style='display: block; width: 100%'>";
			$(".window .body .inner").html(str);    
		}
	});
}

//function EditComponentRequest()
//{
//	var vars = {method:"GetComponent"};
//	$.post("php/frontend-com.php",vars,function(data){
//		
//	});
//	
//	var test = 
//	{
//		"Prelim" : {
//			"Percentage": 30, 
//			"sub": {
//				"Quiz" : {"Percentage": 20, "sub" : {}},
//				"Project" : {"Percentage": 20, "sub" : {}},
//				"MajorExam" : {"Percentage": 60, "sub" : {}}
//			}
//		},
//		"Midterm" : {
//			"Percentage": 30, 
//			"sub": {
//				"Quiz" : {"Percentage": 20, "sub" : {}},
//				"Project" : {"Percentage": 20, "sub" : {}},
//				"MajorExam" : {"Percentage": 60, "sub" : {}}
//			}
//		},
//		"Finals" : {
//			"Percentage": 40, 
//			"sub": {
//				"Quiz" : {"Percentage": 20, "sub" : {}},
//				"Project" : {"Percentage": 20, "sub" : {}},
//				"MajorExam" : {"Percentage": 60, "sub" : {}}
//			}
//		}
//	}
//
//}



/*========================*/
/*======Student menu======*/
/*========================*/

function AddStudent()
{
    PopupWindow.Show({ 
        Content: windowContent.OpenMenu, 
        Title: "Add Students", 
		ActionButtons: '<a onclick = "AddStudentRequest();" class="btn blue pull-right">Add</a> <a onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a> <a onclick = "NewStudent();" class="btn gray pull-right">Create students</a>',
        OnRender:function(){

            $(".window .body ul").waitMe({
                effect : 'stretch',
                text : '',
                bg : "transparent",
                color : "#999",
                sizeW : '',
                sizeH : ''
            });


            $.post("php/frontend-com.php", {method:"ViewStudents"}, function(data){
				
				
				data = JSON.parse(data);
				
                Iterate(function(i){
					$(".window .body ul").append("<li data-student-number='"+data[i].StudentNumber+"' onclick='$(this).toggleClass(\"selected\");'>"+ data[i].Name + " <span class = 'bullet'> "+data[i].StudentNumber+"<span></li>");

                }, data.length , 50);

				$(".window .body #description").html("Showing " + data.length + " unenrolled student(s)");
				
                $(".window .body ul").waitMe("hide");
            });
        }
    });
}

function AddStudentRequest()
{
    var ids = [];
    var vars = {};
	
	vars.method = "AddStudentsToSubject";
	
    $(".window .body ul li.selected").each(function(i,e){
        ids[ids.length] = $(e).attr("data-student-number");
    });
    
	vars.Students = ids;

    $.post("php/frontend-com.php", vars, function(data){
		data = JSON.parse(data);
		ImplementStudentList({Students: data});
	});
	
//	alert("Add student Request with ids: " + JSON.stringify(ids));
    PopupWindow.Close();
}

function NewStudent()
{
    PopupWindow.Show({ 
        Content: windowContent.Simple, 
        Title: "New Student", 
        ActionButtons: '<a tabindex=0 onclick = "NewStudentRequest();" class="btn blue pull-right">Create</a> <a tabindex=0 onclick = "NewStudentRequest(true);" class="btn blue pull-right">Create more</a> <a tabindex=0 onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
        Size: {Width: 281, Height: 205}, 
        OnRender:function(){
            var str = "Student number <input id = 'studentNumber'type = 'text' placeholder='S2011100000' style='display: block; width: 100%'>";
            str += "Student name <input id = 'studentName' type = 'text' placeholder='Lastname, First Name' style='display: block; width: 100%'>"
            $(".window .body .inner").html(str);    
        }
    });

}

function NewStudentRequest(more)
{
    more = more || false;
    
	var vars = {};
	
	vars.method = "NewStudent";
    vars.StudentNumber = $(".window .body .inner #studentNumber").val();
    vars.StudentName = $(".window .body .inner #studentName").val();
    
	
	if(vars.StudentNumber.trim().length == 0)
	{
		ShowErrorMessage("Oops", "Please provide a student number.", "NewStudent");
		return;
	}
	
	if(vars.StudentName.trim().length == 0)
	{
		ShowErrorMessage("Oops", "Please provide a student name.", "NewStudent");
		return;
	}

	
	$.post("php/frontend-com.php",vars,function(data){

		
		
		data = JSON.parse(data);
		
		
		if(data.State == "error")
		{
		
			ShowErrorMessage("Oops", data.Reason, "NewStudent");
		}
		else
		{
		
			if(more)
				NewStudent();
			else
				PopupWindow.Close();
		}
		
	});
    
}


/*========================*/
/*======Subject menu======*/
/*========================*/

function NewSubject()
{
    PopupWindow.Show({ 
        Content: windowContent.Simple, 
        Title: "New Subject", 
        ActionButtons: '<a tabindex=0 onclick = "NewSubjectRequest();" class="btn blue pull-right">Create</a> <a tabindex=0 onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
        Size: {Width: 250, Height: 200}, 
        OnRender:function(){
            $(".window .body .inner").html("\
               Subject name <input type = 'text' placeholder='Type subject name here' style='display: block; width: 100%'>\
               Description <input type = 'text' placeholder='Type subject description here' style='display: block; width: 100%'>\
           ");    
        }
    });
    
}

function NewSubjectRequest()
{
    var vars = {};
    
    vars.SubjectName = $(".window .body .inner input")[0].value;
    vars.Description = $(".window .body .inner input")[1].value;
    vars.method = "NewSubject";

    if(vars.SubjectName.trim().length == 0)
    {
        ShowErrorMessage("Oops", "Please provide a subject name.", "NewSubject");
        return;
    }
    
    PopupWindow.Object.StartLoading();
    
    $.post("php/frontend-com.php", vars, function(data){

        data = JSON.parse(data);
        
        if(data.State == "error")
            ShowErrorMessage("Oops", data.Reason, "NewSubject");
        else
        {
            PopupWindow.Show({ 
                Content: windowContent.Simple, 
                Title: "Subject created", 
                ActionButtons: '<a tabindex=0 onclick = "LoadSubject('+data.SubjectID+');" class="btn blue pull-right">Open</a> <a tabindex=0 onclick = "PopupWindow.Close();" class="btn gray pull-right">Not now</a>',
                Size: {Width: 250, Height: 155}, 
                OnRender:function(){
                    $(".window .body .inner").html('Subject named "'+vars.SubjectName+'" created. Do you want it to open now?');    
                }
            });
        }
        
    });
    
    
}


function OpenSubject()
{
    PopupWindow.Show({ 
        Content: windowContent.OpenMenu, 
        Title: "Open Subject", 
        ActionButtons: '<a id = "open" tabindex=0 onclick = "OpenSubjectRequest();" class="btn blue pull-right">Open</a> <a tabindex=0 onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
        OnRender:function(){
            
            
//            $(".window .body ul").html(str);
            
            $(".window .body ul").waitMe({
                effect : 'stretch',
                text : '',
                bg : "#333",
                color : "#999",
                sizeW : '',
                sizeH : ''
            });
            
            $.post("php/frontend-com.php", {method:"ViewSubjects"}, function(data){
                var str = "";
                data = JSON.parse(data);
                Iterate(function(i){
					$(".window .body ul").append("<li tabindex=0 data-enrollees = '"+data[i].Enrollees+"' data-description = '"+data[i].Description+"' data-id='"+data[i].SubjectID+"' onclick='SelectSubjectItem(this)' onfocus='SelectSubjectItem(this)'>"+data[i].Name+"</li>");
                    
                }, data.length, 50);
                
                $(".window .body ul").waitMe("hide");
            });
        }
    });
}

function OpenSubjectRequest()
{
    $(".window .status").waitMe({
        effect : 'win8_linear',
        text : '',
        bg : "transparent",
        color : "white",
        sizeW : '',
        sizeH : ''
    });
	
	LoadSubject(userInfo.selectedSubject);
	
    $(".window .status").waitMe("hide");
    PopupWindow.Close();
}

function SelectSubjectItem(sender)
{
    userInfo.selectedSubject = $(sender).attr("data-id");
	$(".window #description").html($(sender).attr("data-description") + "<br><br>Enrollees: " + $(sender).attr("data-enrollees"));
}

function DeleteCurrentSubject()
{
    PopupWindow.Show({ 
        Content: windowContent.Simple, 
        Title: "Delete Current Subject", 
        ActionButtons: '<a tabindex=0 onclick = "PopupWindow.Close();" class="btn blue pull-right">No</a> <a tabindex=0 onclick = "DeleteCurrentSubjectConfirm();" class="btn gray pull-right">Yes</a>',
        Size: {Width: 250, Height: 155},
        OnRender:function(){
            $(".window .body .inner").html("Are you sure you want to delete the current subject?");
        }
    });
}

function DeleteCurrentSubjectConfirm()
{
    PopupWindow.Show({ 
        Content: windowContent.Simple, 
        Title: "Delete Current Subject", 
        ActionButtons: '<a tabindex=0 onclick = "DeleteCurrentSubjectRequest();" class="btn red pull-right">Delete</a> <a tabindex=0 onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
        Size: {Width: 250, Height: 175},
        OnRender : function(){
            $(".window .body .inner").html("Please confirm delete with your password <input type = 'password' placeholder='Password' style='display: block; width: 100%'>");
        }
    });
}

function DeleteCurrentSubjectRequest()
{
    var password = $(".window .inner input").val();
    
	var vars = {method: "DeleteCurrentSubject"};
	vars.Password = password;
	
	$.post("php/frontend-com.php",vars,function(data){
		data = JSON.parse(data);
		
		if(data.State == "error")
		{
			PopupWindow.Show({ 
				Content: windowContent.Simple, 
				Title: "Wrong password", 
				ActionButtons: '<a tabindex=0 onclick = "DeleteCurrentSubjectConfirm();" class="btn blue pull-right">Ok</a> <a tabindex=0 onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
				Size: {Width: 250, Height: 155},
				OnRender:function(){
					$(".window .body .inner").html("You've entered a wrong password, subject not deleted");
				}
			});
		}
		else
		{
			PopupWindow.Show({ 
				Content: windowContent.Simple, 
				Title: "Subject deleted", 
				ActionButtons: '<a tabindex=0 onclick = "PopupWindow.Close();" class="btn blue pull-right">Ok</a>',
				Size: {Width: 250, Height: 155},
				OnRender:function(){
					$(".window .body .inner").html("Subject deleted successfuly");
				}
			});
			
			ResetSubject();
		}
	});
	
//	alert("Deleting current subject with password: " + password);
//    PopupWindow.Close();
}

/////////////

//function ShowAbout()
//{
//    PopupWindow.Show({ 
//        Content: windowContent.OpenMenu, 
//        Title: "Open Subject", 
//        ActionButtons: '<a id = "open" tabindex=0 onclick = "OpenSubjectRequest();" class="btn blue pull-right">Open</a> <a tabindex=0 onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
//    });
//}
