<?php

    function Login()
    {
        $professor = QuerySingleRow("SELECT * FROM Professor WHERE EmployeeNumber = '{$_POST['EmployeeNumber']}' AND Password = '{$_POST['Password']}'");
        
        if($professor)
        {
            $_SESSION["EmployeeNumber"] = $professor["EmployeeNumber"];
            $_SESSION["Name"] = $professor["Name"];
            
            $data["state"] = "Success";
            $data["credentials"] = "Success";
            
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
        
        if($professor)
        {
            $data["state"] = "error";
            $data["reason"] = "The employeeNumber is already in use";
            echo json_decode($data);
        }
        else
        {
            $ret = ExecuteQuery("INSERT INTO Professor(`Name`, `EmployeeNumber`,`Password`) VALUES('{$_POST['Name']}','{$_POST['EmployeeNumber']}','{$_POST['Password']}')");
            
            Login();
        }
        
        
        
    }

?>