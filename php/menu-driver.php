<?php

/////Subject menu/////

function NewSubject()
{
    echo "new subject";
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