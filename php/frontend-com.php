<?php 

    require_once("dbmanager.php");
    require_once("menu-driver.php");
    require_once("login-manager.php");

    if(isset($_POST['method']))
    {
        sleep(1);
        session_start();
        $_POST = SanitizeArray($_POST);
        call_user_func($_POST['method']); 
    }

?>