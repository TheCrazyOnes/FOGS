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
		
		var str = '\
	<div data-name = '+key+' class="panel panel-default">\
		<div class="panel-heading">\
			<h4 class="panel-title">\
				<a class = "'+subClass+'" data-toggle="collapse" >\
					'+key+ field +'\
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
	LoadStudentRecord(userInfo.SelectedStudent);
}

function LoadStudentRecord(data)
{
	
}