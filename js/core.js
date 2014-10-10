function LoadSubject(SubjectID)
{
    var vars = {};
	vars.method = "LoadSubject";
    vars.SubjectID = SubjectID;
    
    PopupWindow.Object.StartLoading();
    $.post("php/frontend-com.php", vars, function(data){
		
		
		
        data = JSON.parse(data);
		
		ImplementSubject(data);
		
        PopupWindow.Close();
    });
}

function ImplementSubject(data)
{
	userInfo.SubjectDetails = data.SubjectDetails;
	$("#subject-name>span:first-child").html(data.SubjectDetails.Name);
	
	
	
	var root = data.SubjectDetails.Component;
	
//	alert(JSON.stringify(root));
	
	BuildComponentLevel(root, "#components");
	
	
	$('[data-toggle="collapse"]').click(function(){
		$target = $(this).parent().parent().siblings();
		$target.collapse('toggle');

		$(this).toggleClass("shown");
		
	});
	
	ImplementStudentList(data);

	
}

function BuildComponentLevel(component, parent)
{
//	alert(JSON.stringify(component));
	
	$(parent).html('<div class="panel-group" ></div>');
	for (var key in component) {
//		alert(key);
		
		var subClass = "";
		var field = "";
		if(component[key].sub != null)
		{	
			subClass = "sub";
		}
		else
		{
			field = '<input type= "text"><span class="holder" data-max = "'+component[key].max+'">&frasl; </span>';
		}
		
		var name = key.split(" ").join("-");
		
		var str = '\
	<div data-name = '+name+' class="panel panel-default">\
		<div class="panel-heading">\
			<h4 class="panel-title">\
				<a class = "'+subClass+'" data-toggle="collapse" > \
'+key+ field +'<span class = "grade"></span><span class = "percentage">'+component[key].Percentage+'&#37;<span>\
				</a>\
			</h4>\
		</div>\
		<div class="panel-collapse collapse">\
			<div class="panel-body">\
			</div>\
		</div>\
	</div>';

		$(parent).children().append(str);
		
		if(component[key].sub != null)
		{
			BuildComponentLevel(component[key].sub, $(parent).find("[data-name='"+key+"'] .panel-body"));
		}
		
	}
}

function ImplementStudentList(data)
{
	$(".side-bar .students li").tooltip('destroy');
	$(".side-bar .students").html("");
	Iterate(function(i){
		$(".side-bar .students").append("<li onclick = 'SelectStudent(this)' data-student-number='"+data.Students[i].StudentNumber+"' data-toggle='tooltip' title='"+data.Students[i].StudentNumber+"'>"+data.Students[i].Name+"</li>");
	}, data.Students.length, 100, function(){

		$(".side-bar .students li").tooltip({placement: "left"});
	});


	if(data.Students.length == 0)
	{
		$(".side-bar .students").append("<li class = 'disabled'>This subject have no students yet. To add students:<br> Student->Add Students </li>")
	}
}

function SelectStudent(selected)
{
	$(selected).siblings().removeClass("selected");
	$(selected).addClass("selected");
	userInfo.SelectedStudent = $(selected).attr("data-student-number");
//	LoadStudentRecord(userInfo.SelectedStudent);

	var vars = {method: "LoadStudent"};
	vars.StudentNumber = userInfo.SelectedStudent;
	
	$(".main").waitMe({
		effect : 'stretch',
		text : 'Loading student...',
		bg : "rgba(255,255,255,0.7)",
		color : "#333"
	});
	
	$.post("php/frontend-com.php",vars,function(data){
		data = JSON.parse(data);
		ImplementStudentRecord(data);
		$(".main").StopLoading();
	});
	
	
	
}

function ImplementStudentRecord(data)
{
	userInfo.StudentDetails = data;
	
	MergeComponent(userInfo.SubjectDetails.Component, userInfo.StudentDetails.Grade);
	$(".main #student-name").html(data.Name);
	
	alert(JSON.stringify(userInfo.SubjectDetails.Component));
	FillFields(userInfo.SubjectDetails.Component, ".main #components");
//	FillFields(data.Grade, ".main #components");
}

function FillFields(node, parent)
{
//	alert(JSON.stringify(node));
	for (var key in node) 
	{
		
		if(node[key].sub != null)
		{
			$(parent + " [data-name='"+key.split(" ").join("-")+"']>.panel-heading .grade").html(node[key].sub.value);	
//			alert(parent + " [data-name='"+key.split(" ").join("-")+"']>.panel-heading .grade");
//			alert($(parent + " .grade").html() + "\n" + JSON.stringify(node[key].sub));
			FillFields(node[key].sub, parent + " [data-name='"+key.split(" ").join("-")+"']");
		}
		else
		{
			
			$(parent + " [data-name='"+key.split(" ").join("-")+"'] input").val(node[key].raw);	
		}
	}	
}

//function FillFields(node, parent)
//{
//	for (var key in node) {
//
//		if((typeof node[key]) != "string")
//			FillFields(node[key], parent + " [data-name='"+key.split(" ").join("-")+"']");
//		else
//			$(parent + " [data-name='"+key.split(" ").join("-")+"'] input").val(node[key]);	
//	}	
//}

function SaveGrade()
{
	HarvestFields(userInfo.StudentDetails.Grade, ".main #components");
	
	
	var vars = {method: "SaveGrade"};
	vars.StudentNumber = userInfo.StudentDetails.StudentNumber;
	vars.Grade = userInfo.StudentDetails.Grade;
	
	$(".main").waitMe({
		effect : 'stretch',
		text : 'Saving Grade...',
		bg : "rgba(255,255,255,0.7)",
		color : "#333"
	});
	
	$.post("php/frontend-com.php",vars,function(data){
		AlertOnError(data);
		$(".main").StopLoading();
	});
	
	
}

function HarvestFields(node, parent)
{
	for (var key in node) {

		if((typeof node[key])!= "string")
			HarvestFields(node[key], parent + " [data-name='"+key.split(" ").join("-")+"']");
		else
			node[key] = $(parent + " [data-name='"+key.split(" ").join("-")+"'] input").val();	
	}	
}


//Compute grade
function MergeComponent(node, value)
{
	var grade = 0;
	var base = parseInt(userInfo.SubjectDetails.Base);
	var factor = 100 - base;
//	alert(base + " "+factor);
	for(var key in node)
	{	
		if( node[key].sub != null )
		{
//			alert(key + " " + JSON.stringify(value[key]));	
			MergeComponent(node[key].sub, value[key]);
		}
		else
		{
//			alert((node[key].Percentage/100));
			node[key].raw = parseInt(value[key]);
			node[key].value = ((node[key].raw / node[key].max) * factor + base) * (node[key].Percentage/100) ;	
//			node[key].formula = "(("+node[key].raw + "/" + node[key].max + ")" + "*" + factor + "+" + base +")"+ "*" + "(" + node[key].Percentage+"/"+100+")";
			grade += node[key].value;
		}
	}
	
	node.value = grade;
}
