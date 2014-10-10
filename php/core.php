<?php

    function LoadSubject()
    {
        $data;
		
		if(!isset($_POST['SubjectID']))
			$_POST['SubjectID'] = $_SESSION['SubjectID'];
		
        $subject = QuerySingleRow("SELECT * FROM Subject WHERE SubjectID = {$_POST['SubjectID']}");
        
		if($subject["EmployeeNumber"] != $_SESSION["EmployeeNumber"])
		{
			$data["State"] = 'error';
			$data["Reason"] = 'You do not own this subject.';
			
			return $data;
			
		}
		
        if(count($subject) != 0)
		{
			$subject["Component"] = json_decode($subject["Component"],true);	
            $data["SubjectDetails"] = $subject;
            $_SESSION["SubjectDetails"] = $subject;
		}
		else
		{
			$data["State"] = 'error';
			$data["Reason"] = 'Subject does not exist.';

			return $data;
		}
		
//		$_SESSION['SubjectComponent'] = json_decode($subject["Component"],true);
		$_SESSION['SubjectID'] = $_POST['SubjectID'];
        
        $data["Students"] = GetStudents();
        
		
		
        return $data;
        
    }

	
	

?>