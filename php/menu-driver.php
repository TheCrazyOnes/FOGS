<?php

/////Student Menu//////

function NewStudent()
{
	
	if(IsRecordExisting("Student", "StudentNumber", "'{$_POST['StudentNumber']}'"))
	{
		$data["State"] = 'error';
		$data["Reason"] ='Student number already exists';
		
		return $data;
	}
	else
	{
		ExecuteQuery("INSERT INTO Student(`Name`, `StudentNumber`, `ProfessorEmployeeNumber`) VALUES('{$_POST['StudentName']}','{$_POST['StudentNumber']}','{$_SESSION['EmployeeNumber']}')");
		
		$data["State"] = 'success';
		return $data;
	}
	
}

function ViewStudents()
{
	$data = SQLArrayToArray(ExecuteQuery("SELECT * FROM Student WHERE ProfessorEmployeeNumber = '{$_SESSION['EmployeeNumber']}' ORDER BY Name"));
	$enrolledStudents = SQLArrayToArray(ExecuteQuery("SELECT * FROM Enrollment WHERE SubjectID = {$_SESSION['SubjectID']}"));
	
	$new;
	foreach($enrolledStudents as $e)
	{
		foreach($data as &$s)
		{
			if($s["StudentNumber"] == $e["StudentNumber"])
			{	
				$s = null;
			}
		}
	}
	
	$data = array_values(array_filter($data));
	
	return $data;
	
}

function AddStudentsToSubject()
{

	$structure;
	GenerateGradeFromComponent($_SESSION["SubjectDetails"]["Component"], $structure);
	$structure = json_encode($structure);
	
	$students = $_POST['Students'];
	for($i = 0; $i < count($students); $i++)
	{
		$component = $_SESSION["SubjectDetails"]["Component"];	
		
		ExecuteQuery("INSERT INTO Enrollment(`StudentNumber`,`SubjectID`,`Grade`) VALUES('{$students[$i]}', {$_SESSION['SubjectID']}, '$structure')");
	}
	
	return GetStudents();
}

function GenerateGradeFromComponent($component, &$parent)
{
	
	foreach($component as $key => &$val)
	{
		if($val["sub"] != null)
			GenerateGradeFromComponent($val["sub"], $parent[$key]);
		else
			$parent[$key] = "0";
	}
	
}

/////Subject menu/////

function NewSubject()
{
    if(IsRecordExisting("Subject", "Name", "'{$_POST['SubjectName']}'"))
    {
        $data["State"] = "error";
        $data["Reason"] = "Subject already exists";
        return $data;
    }
    else
	{
        global $link;
		$_POST["Description"] = htmlspecialchars($_POST["Description"]);
		$_POST["SubjectName"] = htmlspecialchars($_POST["SubjectName"]);
		
		
		$defaultStructure = '{"Prelim":{"Percentage":30,"sub":{"Quiz":{"Percentage":20,"sub":{}},"Project":{"Percentage":20,"sub":{}},"MajorExam":{"Percentage":60,"sub":{}}}},"Midterm":{"Percentage":30,"sub":{"Quiz":{"Percentage":20,"sub":{}},"Project":{"Percentage":20,"sub":{}},"MajorExam":{"Percentage":60,"sub":{}}}},"Finals":{"Percentage":40,"sub":{"Quiz":{"Percentage":20,"sub":{}},"Project":{"Percentage":20,"sub":{}},"MajorExam":{"Percentage":60,"sub":{}}}}}';
		
    	$ret = ExecuteQuery("INSERT INTO Subject(`Name`,`Description`,`EmployeeNumber`, `Component`) VALUES('{$_POST['SubjectName']}','{$_POST['Description']}','{$_SESSION['EmployeeNumber']}', '$defaultStructure')");
        
        $data["State"] = "success";
        $data["Message"] = "Successfuly created a new subject.";    
        $data["SubjectID"] = mysqli_insert_id($link);
        return $data;
    }
    
    
}

function ViewSubjects()
{
    
	$data = SQLArrayToArray(ExecuteQuery("SELECT Subject.* FROM Subject WHERE EmployeeNumber = '{$_SESSION['EmployeeNumber']}'"));

	for($i = 0; $i < count($data); $i++)
	{
		$data[$i]["Enrollees"] = QuerySingleRow("SELECT COUNT(*) as c FROM Enrollment WHERE SubjectID = {$data[$i]['SubjectID']}")["c"];
	}

	return $data;
}

function DeleteCurrentSubject()
{
	
	if($_POST["Password"] != $_SESSION["Password"])
	{
		$data["State"] = "error";
		$data["Reason"] = "Wrong password";
		return $data;
	}
	
	$ret = ExecuteQuery("DELETE FROM `Enrollment` WHERE Enrollment.SubjectID = {$_SESSION["SubjectID"]}");
	$ret = ExecuteQuery("DELETE FROM `Subject` WHERE SubjectID = {$_SESSION["SubjectID"]}");
    
	unset($_SESSION["SubjectID"]);
	unset($_SESSION["SubjectDetails"]);
	
	$data["State"] = "Success";
	$data["Reason"] = "Subject Deleted";
	
	return $data;
}



?>