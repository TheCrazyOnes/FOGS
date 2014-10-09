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
				
//				alert(data);
				
				data = JSON.parse(data);
				
                Iterate(function(i){
//                    $(".window .body ul").append("<li tabindex=0 data-id='"+i+"' onclick='SelectSubjectItem(this)' onfocus='SelectSubjectItem(this)'>lorem</li>");
					$(".window .body ul").append("<li data-student-number='"+data[i].StudentNumber+"' onclick='$(this).toggleClass(\"selected\");'>"+ data[i].StudentNumber + " | "+data[i].Name+"</li>");

                }, data.length , 50);

				$(".window .body #description").html("Showing " + data.length + " student(s)");
				
                $(".window .body ul").waitMe("hide");
            });
        }
    });
}

function AddStudentRequest()
{
    var ids = [];
    
    $(".window .body ul li.selected").each(function(i,e){
        ids[ids.length] = $(e).attr("data-student-number");
    });
    
    alert("Add student Request with ids: " + JSON.stringify(ids));
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
    alert("Deleting current subject with password: " + password);
    PopupWindow.Close();
}

/////////////

function ShowAbout()
{
    PopupWindow.Show({ 
        Content: windowContent.OpenMenu, 
        Title: "Open Subject", 
        ActionButtons: '<a id = "open" tabindex=0 onclick = "OpenSubjectRequest();" class="btn blue pull-right">Open</a> <a tabindex=0 onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
    });
}
