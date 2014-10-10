<?php
/////reports menu//////

function SaveGradeSettings()
{
	$_POST['Component'] = json_encode($_POST['Component']);
	ExecuteQuery("UPDATE Subject SET Base = {$_POST['Base']}, Component = '{$_POST['Component']}' WHERE SubjectID = {$_SESSION['SubjectID']}");
	
	
	return LoadSubject();
}

function EditGradeSettings()
{
	if($_POST["Password"] != $_SESSION["Password"])
	{
		$data["State"] = "error";
		$data["Reason"] = "Wrong password";
		return $data;
	}
	
	$data["State"] = "success";
	
	return $data;
	
}

function ViewSubjectRecords()
{
//	sleep(2);
	$students = SQLArrayToArray(ExecuteQuery("SELECT * FROM Student, Enrollment WHERE Student.StudentNumber = Enrollment.StudentNumber AND SubjectID = {$_SESSION['SubjectID']} ORDER BY Name"));

	foreach($students as &$student)
	{
		$student["Grade"] = json_decode($student["Grade"],true);
	}

	return $students;
}

function DownloadReport()
{
	$fileName = implode("-",explode(" ", $_SESSION["SubjectDetails"]["Name"])) . " - " .$_SESSION['Name'];
	$myfile = fopen("../$fileName.csv", "w") or die("Unable to open file!");
	
	$data = $_POST['data'];
	
	
//	fwrite($myfile, $_POST['data']);
	
	for($i = 0; $i < count($data); $i++)
	{	
		fwrite($myfile, '"'. implode('","',$data[$i]) . '"' . PHP_EOL);
	}
	
	fclose($myfile);
	
	$data["link"] = "$fileName.csv";
	
	return $data;
}

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

function ViewEnrolledStudents()
{
	return SQLArrayToArray(ExecuteQuery("SELECT * FROM Student, Enrollment WHERE Student.StudentNumber = Enrollment.StudentNumber AND SubjectID = {$_SESSION['SubjectID']} ORDER BY Name"));
}

function RemoveStudentsFromSubject()
{
	
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
		
		
		$defaultStructure = '{"Prelim":{"Percentage":30,"sub":{"Quiz":{"Percentage":20,"sub":{"Quiz 1":{"Percentage":30,"max":20},"Quiz 2":{"Percentage":30,"max":20},"Quiz 3":{"Percentage":40,"max":30}}},"Project":{"Percentage":20,"max":40},"Major Exam":{"Percentage":60,"max":60}}},"Midterm":{"Percentage":30,"sub":{"Quiz":{"Percentage":20,"sub":{"Quiz 1":{"Percentage":30,"max":20},"Quiz 2":{"Percentage":30,"max":20},"Quiz 3":{"Percentage":40,"max":30}}},"Project":{"Percentage":20,"max":40},"Major Exam":{"Percentage":60,"max":60}}},"Finals":{"Percentage":40,"sub":{"Quiz":{"Percentage":20,"sub":{"Quiz 1":{"Percentage":30,"max":20},"Quiz 2":{"Percentage":30,"max":20},"Quiz 3":{"Percentage":40,"max":30}}},"Project":{"Percentage":20,"max":40},"Major Exam":{"Percentage":60,"max":60}}}}';
		
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