function LoadSubject(SubjectID)
{
    var vars = {};
	vars.method = "LoadSubject";
    vars.SubjectID = SubjectID;
    
    PopupWindow.Object.StartLoading();
    $.post("php/frontend-com.php", vars, function(data){
        alert(data);
        data = JSON.parse(data);
		$("#subject-name>span:first-child").html(data.SubjectDetails.Name);
		
		$(".side-bar .students").html("");
		
		Iterate(function(i){
			$(".side-bar .students").append("<li>"+data.Students[i]+"</li>");
		}, data.Students.length, 100);
		
		if(data.Students.length == 0)
		{
			$(".side-bar .students").append("<li class = 'disabled'>This subject have no students yet. To add students:<br> Student->Add Students </li>")
		}
		
        PopupWindow.Close();
    });
}

