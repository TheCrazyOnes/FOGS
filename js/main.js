$(document).ready(function(){
    
//    $('#new-subject').popover({
//        animation: true,
//        placement: "bottom",
//        html: true
//    }).popover("show"); 
});

var currentSubject = -1;
var selectedSubject = -1;

function UniversalKeyUp()
{
    if(event.which == 27 && PopupWindow.IsOpen)
    {
         PopupWindow.Close();
    }
}


function NewSubject()
{
    PopupWindow.Show({ 
        Content: windowContent.Simple, 
        Title: "New Subject", 
        ActionButtons: '<a onclick = "NewSubjectRequest();" class="btn blue pull-right">Create</a> <a onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
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
        ActionButtons: '<a onclick = "OpenSubjectRequest();" class="btn blue pull-right">Open</a> <a onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
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
                alert(data);
                var str = "";
                for(var i = 0; i < 10; i++)
                {
                    str += "<li tabindex=0 data-id='"+i+"' onclick='SelectSubjectItem(this)' onfocus='SelectSubjectItem(this)'>lorem</li>";
                }
                $(".window .body ul").waitMe("hide");
                $(".window .body ul").html(str);
            });
            
            
        }
    });
}

function OpenSubjectRequest()
{
    alert("Opening subject with id " + selectedSubject);
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
        ActionButtons: '<a onclick = "PopupWindow.Close();" class="btn blue pull-right">No</a> <a onclick = "DeleteCurrentSubjectConfirm();" class="btn gray pull-right">Yes</a>',
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
        ActionButtons: '<a onclick = "DeleteCurrentSubjectRequest();" class="btn red pull-right">Delete</a> <a onclick = "PopupWindow.Close();" class="btn gray pull-right">Cancel</a>',
        Size: {Width: 250, Height: 175},
        OnRender : function(){
            $(".window .body .inner").html("Please confirm delete with your password <input type = 'password' placeholder='Password' style='display: block; width: 100%'>");
        }
    });
}

function DeleteCurrentSubjectRequest()
{
    var password = $(".window inner").val();
    alert("Deleting current subject with password: " + password);
}
