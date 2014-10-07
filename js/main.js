$(document).ready(function(){
    
});

var currentSubject = -1;
var selectedSubject = -1;

var userInfo = {};

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
        ActionButtons: '<a onclick = "AddStudentRequest();" class="btn blue pull-right">Add</a> <a onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
        OnRender:function(){

            $(".window .body ul").waitMe({
                effect : 'stretch',
                text : '',
                bg : "transparent",
                color : "#999",
                sizeW : '',
                sizeH : ''
            });


            $.post("php/frontend-com.php", {method:"AddStudents"}, function(data){
                var str = "";
                var i = 0;

                Iterate(function(){
                    i++;
//                    $(".window .body ul").append("<li tabindex=0 data-id='"+i+"' onclick='SelectSubjectItem(this)' onfocus='SelectSubjectItem(this)'>lorem</li>");
                    $(".window .body ul").append("<li data-id='"+i+"' onclick='$(this).toggleClass(\"selected\");'>lorem ipsum</li>");

                }, 30, 50);

                $(".window .body ul").waitMe("hide");
            });
        }
    });
}

function AddStudentRequest()
{
    var ids = [];
    
    $(".window .body ul li.selected").each(function(i,e){
        ids[ids.length] = $(e).attr("data-id");
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
        Size: {Width: 279, Height: 205}, 
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
    
    var studentNumber = $(".window .body .inner #studentNumber").val();;
    var studentName = $(".window .body .inner #studentName").val();
    alert("new student with name: " + studentName + " and student ID : " + studentNumber);
    
    if(more)
        NewStudent();
    else
        PopupWindow.Close();
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
        Size: {Width: 250, Height: 155}, 
        OnRender:function(){
            $(".window .body .inner").html("Subject name <input type = 'text' placeholder='Type subject name here' style='display: block; width: 100%'>");    
        }
    });
    
}

function NewSubjectRequest()
{
    var subjectName = $(".window .body .inner input").val();
    alert("creating new subject with name: " + subjectName);
    PopupWindow.Close();
    
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
                bg : "transparent",
                color : "#999",
                sizeW : '',
                sizeH : ''
            });
            
            
            $.post("php/frontend-com.php", {method:"OpenSubject"}, function(data){
                var str = "";
                
                data = JSON.parse(data);
                Iterate(function(i){
                    $(".window .body ul").append("<li tabindex=0 data-id='"+data[i].id+"' onclick='SelectSubjectItem(this)' onfocus='SelectSubjectItem(this)'>"+data[i].name+"</li>");
                    
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
    alert("Opening subject with id " + selectedSubject);
    $(".window .status").waitMe("hide");
    PopupWindow.Close();
}

function SelectSubjectItem(sender)
{
    selectedSubject = $(sender).attr("data-id");
    
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
        Title: "New Subject", 
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
