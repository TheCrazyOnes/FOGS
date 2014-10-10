<?php

    function Initialize()
    {
        if(isset($_SESSION["EmployeeNumber"]))
        {
            $data["EmployeeNumber"] = $_SESSION["EmployeeNumber"];
            $data["Name"] = $_SESSION["Name"];
        
			
			if(isset($_SESSION['SubjectID']))
			{
				//load subject details
				$data = MergeArray($data, LoadSubject($_SESSION["SubjectID"]));
			}
			
			
            return $data;
        }
        else
        {
            $data["state"] = "logged out";
            
            return $data;
        }
		
    }

    function Login()
    {
        $professor = QuerySingleRow("SELECT * FROM Professor WHERE EmployeeNumber = '{$_POST['EmployeeNumber']}' AND Password = '{$_POST['Password']}'");
        
        if(count($professor) > 0)
        {
            $_SESSION["EmployeeNumber"] = $professor["EmployeeNumber"];
            $_SESSION["Name"] = $professor["Name"];
            
            $data["state"] = "Success";
            $data["credentials"] = $professor;
            return $data;
        }
        else
        {
            $data["state"] = "error";
            $data["reason"] = "Wrong password or EmployeeNumber";
            return $data;
        }
    }

    function Register()
    {

        $professor = QuerySingleRow("SELECT * FROM Professor WHERE EmployeeNumber = '{$_POST['EmployeeNumber']}'");
        
        if(count($professor) > 0)
        {
            $data["state"] = "error";
            $data["reason"] = "Employee number is already in use";
            return $data;
        }
        else
        {
            $ret = ExecuteQuery("INSERT INTO Professor(`Name`, `EmployeeNumber`,`Password`) VALUES('{$_POST['Name']}','{$_POST['EmployeeNumber']}','{$_POST['Password']}')");
            Login();
            
        }
    }

    function Logout()
    {
        session_destroy();
    }

    function ViewSessionContent()
    {
        return $_SESSION;
    }

?>