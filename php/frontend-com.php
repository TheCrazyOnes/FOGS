<?php 

    require_once("dbmanager.php");
    require_once("utilities.php");
    require_once("menu-driver.php");
    require_once("login-manager.php");
    require_once("core.php");

    if(isset($_POST['method']))
    {
        sleep(0);
        session_start();
        $_POST = SanitizeArray($_POST);
        $data = call_user_func($_POST['method']); 
		
		echo json_encode($data);
    }

?>