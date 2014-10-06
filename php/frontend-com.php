<?php 

    require_once("dbmanager.php");
    require_once("menu-driver.php");

    if(isset($_POST['method']))
    {
        sleep(1000);
        
        $_POST = SanitizeArray($_POST);
        call_user_func($_POST['method']); 
    }

?>