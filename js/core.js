function LoadSubject(SubjectID)
{
    var vars = {};
	vars.method = "LoadSubject";
    vars.SubjectID = SubjectID;
    
//    alert(JSON.stringify(vars));
    
    PopupWindow.Object.StartLoading();
    $.post("php/frontend-com.php", vars, function(data){
        data = JSON.parse(data);
//        alert(data);
		$("#subject-name>span:first-child").html(data.SubjectDetails.Name);
        PopupWindow.Close();
    });
}