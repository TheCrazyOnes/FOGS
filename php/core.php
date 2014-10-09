<?php

    function LoadSubject()
    {
        $data;
        $subject = QuerySingleRow("SELECT * FROM Subject WHERE SubjectID = {$_POST['SubjectID']}");
        
		if($subject["EmployeeNumber"] != $_SESSION["EmployeeNumber"])
			die("{State: 'error', Reason: 'You do not own this subject.'}");
		
        if(count($subject) != 0)
            $data["SubjectDetails"] = $subject;
		else
			die("{State: 'error', Reason: 'Subject does not exist.'}");
        
        $data["Students"] = SQLArrayToArray(ExecuteQuery("SELECT Student.* FROM Student, Enrollment WHERE SubjectID = {$_POST['SubjectID']} AND Enrollment.StudentNumber = Student.StudentNumber"));
        
        echo json_encode($data);
        
    }


?>