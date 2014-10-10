<?php
	
	function MergeArray($a, $b)
	{
		$keys = array_keys($b);
		
		for($i = 0; $i < count($keys); $i++)
		{
			$a[$keys[$i]] = $b[$keys[$i]];
		}
		
		return $a;
	}

	function GetStudents()
	{
		return SQLArrayToArray(ExecuteQuery("SELECT Student.* FROM Student, Enrollment WHERE SubjectID = {$_SESSION['SubjectID']} AND Enrollment.StudentNumber = Student.StudentNumber ORDER BY Name"));
	}

?>