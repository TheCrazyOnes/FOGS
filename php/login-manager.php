<?php

    function Initialize()
    {
        if(isset($_SESSION["EmployeeNumber"]))
        {
            $data["EmployeeNumber"] = $_SESSION["EmployeeNumber"];
            $data["Name"] = $_SESSION["Name"];
        
			
			if(isset($_SESSION['Subject']))
			{
				//load subject details
			}
			
            echo json_encode($data);
        }
        else
        {
            $data["state"] = "logged out";
            
            echo json_encode($data);
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
            echo json_encode($data);
        }
        else
        {
            $data["state"] = "error";
            $data["reason"] = "Wrong password or EmployeeNumber";
            echo json_encode($data);
        }
    }

    function Register()
    {

        $professor = QuerySingleRow("SELECT * FROM Professor WHERE EmployeeNumber = '{$_POST['EmployeeNumber']}'");
        
        if(count($professor) > 0)
        {
            $data["state"] = "error";
            $data["reason"] = "Employee number is already in use";
            echo json_encode($data);
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
        echo json_encode($_SESSION);
    }

?>