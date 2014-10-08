<?php

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
        $ret = ExecuteQuery("INSERT INTO Subject(`Name`,`Description`,`EmployeeNumber`) VALUES('{$_POST['SubjectName']}','{$_POST['Description']}','{$_SESSION['EmployeeID']}')");
        
        $data["State"] = "success";
        $data["Message"] = "Successfuly created a new subject.";    
        $data["SubjectID"] = mysqli_insert_id($link);
        echo json_encode($data);
    }
    
    
}

function OpenSubject()
{
    $arr = [];
    
    for($i = 0; $i < 20; $i++)
    {
        $arr[count($arr)]["id"] = $i;
        $arr[count($arr) -1 ]["name"] = "Lorem";
    }
    
    echo json_encode($arr);
}

function DeleteCurrentSubject()
{
    echo "Delete current Subject";
}

?>