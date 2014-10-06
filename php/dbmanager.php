<?php

$link = mysqli_connect("localhost","alibaba","quNdjv2mBFLdthMT","alibaba") or die("Error " . mysqli_error($link));


if(isset($_POST['method']))
    call_user_func(implode("",explode(" ",$_POST['method'])));


/////////////////////////////////////////////
//                                         //
//             Helper Functions            //
//                                         //
/////////////////////////////////////////////


function ExecuteQuery($query)
{
    global $link;
    
    $ret = $link->query($query);
    
    if(!$ret)
        die(mysqli_error($link) . "\nQuery: $query");
    
    return $ret;
}

function QuerySingleRow($query)
{
    global $link;
    $ret = $link->query($query);
//    return $query;
    if(!$ret)
        die(mysqli_error($link) . "\nQuery: $query");
    return mysqli_fetch_assoc($ret);
}

function SQLUpdate($table, $fields, $values, $condition, $types)
{
    global $link;
    
    $str = "";
    $separator = "";
    for($i = 0; $i < count($fields); $i++)
    {
        $f = $fields[$i];
        $v = $values[$i];
        
        if($types == "all" || $types[$i] == 1)
            $v = "'$v'";
        
        $str .= "$separator `$f` = $v";
        
        $separator = ",";
    }
    
    $query = "UPDATE $table SET $str WHERE $condition";
    
    return ExecuteQuery($query);
    
}

function SQLArrayToArray($ret)
{
    $arr = [];
    while($row = mysqli_fetch_assoc($ret))
        $arr[count($arr)] = $row;

    return $arr;
}

function SQLArrayToIndexedArray($ret)
{
    $arr = [];
    while($row = mysqli_fetch_assoc($ret))
        $arr[count($arr)] = array_values($row)[0];

    return $arr;
}



function SQLArrayToJSON($ret)
{
    $arr = [];
    while($row = mysqli_fetch_assoc($ret))
        $arr[count($arr)] = $row;

    return json_encode($arr);
}


function SanitizeArray($arr)
{
    global $link;
    foreach($arr as &$item)
    {
        $item = mysqli_real_escape_string($link, $item);
    }
    
    return $arr;
}

?>