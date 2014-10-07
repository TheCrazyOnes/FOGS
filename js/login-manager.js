function Login()
{
    var vals = {};
    
    vals.method = "Login";
    vals.EmployeeNumber = $(".login-form#login #employee-number").val().trim();
    vals.Password = $(".login-form#login #password").val();
    
    if(vals.EmployeeNumber == "" || vals.Password == "")
    {
        $(".login-form#login #state").html("Employee Number or password is not provided");
        return;
    }
        
    $(".login-form#login").waitMe({
        effect : 'stretch',
        text : 'Verifying credentials...',
        bg : "rgba(255,255,255,0.2)",
        color : "black",
        sizeW : '',
        sizeH : ''
    });
    
    $.post("php/frontend-com.php", vals, function(data){
        
        data = JSON.parse(data);
        
        if(data.state == "error")
            $(".login-form#login #state").html(data.reason);
        
        
        $(".login-form#login").waitMe("hide");
    });
}

function Register()
{
    var vals = {};
    
    vals.method = "Register";
    vals.Name = $(".login-form#register #name").val();
    vals.Password = $(".login-form#register #password").val();
    vals.EmployeeNumber = $(".login-form#register #employee-number").val();
    
    if(vals.Password != $(".login-form#register #confirm-password").val())
    {
        $(".login-form#register #status").html("Password does not match");
        return;
    }
    
    $(".login-form#register").waitMe({
        effect : 'stretch',
        text : 'Checking availability...',
        bg : "rgba(255,255,255,0.2)",
        color : "black",
        sizeW : '',
        sizeH : ''
    });

    $.post("php/frontend-com.php", vals, function(data){

        
        data = JSON.parse(data);

        if(data.state == "error")
            $(".login-form#register #state").html(data.reason);


        $(".login-form#register").waitMe("hide");
    });
    
}


function GoToRegister(){
    
    $(".login-form#login").removeClass("fadeInLeftBig");
    $(".login-form#register").removeClass("fadeOutRightBig");
    
    $(".login-form#login").addClass("fadeOutLeftBig");
    $(".login-form#register").addClass("fadeInRightBig");
    $(".login-form#register").css("opacity","1");
}

function BackToLogin(){
    $(".login-form#login").removeClass("fadeOutLeftBig");
    $(".login-form#register").removeClass("fadeInRightBig");
    
    $(".login-form#login").addClass("fadeInLeftBig");
    $(".login-form#register").addClass("fadeOutRightBig");
    
}