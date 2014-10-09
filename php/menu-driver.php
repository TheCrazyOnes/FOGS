<?php

/////Student Menu//////

function NewStudent()
{
	
	if(IsRecordExisting("Student", "StudentNumber", "'{$_POST['StudentNumber']}'"))
	{
		$data["State"] = 'error';
		$data["Reason"] ='Student number already exists';
		
		die(json_encode($data));
	}
	else
	{
		ExecuteQuery("INSERT INTO Student(`Name`, `StudentNumber`, `ProfessorEmployeeNumber`) VALUES('{$_POST['StudentName']}','{$_POST['StudentNumber']}','{$_SESSION['EmployeeNumber']}')");
		
		$data["State"] = 'success';
		echo json_encode($data);
	}
	
}

function ViewStudents()
{
	$students = SQLArrayToArray(ExecuteQuery("SELECT * FROM Student WHERE ProfessorEmployeeNumber = '{$_SESSION['EmployeeNumber']}'"));
	$data = SQLArrayToArray(ExecuteQuery("SELECT * FROM Enrollment WHERE SubjectID = {$_SESSION['SubjectID']}"));
	
	
	echo json_encode($data);
	
}

/////Subject menu/////

function NewSubject()
{
    if(IsRecordExisting("Subject", "Name", "'{$_POST['SubjectName']}'"))
    {
        $data["State"] = "error";
        $data["Reason"] = "Subject already exists";
        die(json_encode($data));
    }
    else
	{
        global $link;
		$_POST["Description"] = htmlspecialchars($_POST["Description"]);
		$_POST["SubjectName"] = htmlspecialchars($_POST["SubjectName"]);
		
    	$ret = ExecuteQuery("INSERT INTO Subject(`Name`,`Description`,`EmployeeNumber`) VALUES('{$_POST['SubjectName']}','{$_POST['Description']}','{$_SESSION['EmployeeNumber']}')");
        
        $data["State"] = "success";
        $data["Message"] = "Successfuly created a new subject.";    
        $data["SubjectID"] = mysqli_insert_id($link);
        echo json_encode($data);
    }
    
    
}

function ViewSubjects()
{
    
	$data = SQLArrayToArray(ExecuteQuery("SELECT Subject.* FROM Subject WHERE EmployeeNumber = '{$_SESSION['EmployeeNumber']}'"));

	for($i = 0; $i < count($data); $i++)
	{
		$data[$i]["Enrollees"] = QuerySingleRow("SELECT COUNT(*) as c FROM Enrollment WHERE SubjectID = {$data[$i]['SubjectID']}")["c"];
	}

	echo json_encode($data);
}

function DeleteCurrentSubject()
{
    echo "Delete current Subject";
}



?>