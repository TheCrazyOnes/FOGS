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
        {   
            $(".login-form#login #state").html(data.reason);
            Animate(".login-form#login", "wobble");
        }
        else
        {
            ExitLoginForm();
            ResetLoginFormFields();
            
        }
        
        $(".login-form#login").waitMe("hide");
    });
}

function Register()
{
    var vals = {};
    
    vals.method = "Register";
    vals.Name = $(".login-form#register #name").val().trim();
    vals.Password = $(".login-form#register #password").val();
    vals.EmployeeNumber = $(".login-form#register #employee-number").val().trim();
    
    if(vals.EmployeeNumber == "")
    {
        $(".login-form#register #state").html("Employee Number is not provided");
        return;
    }
    
    if(vals.Name == "")
    {
        $(".login-form#register #state").html("Name is not provided");
        return;
    }
    
    if( vals.Name.indexOf(",") < 2)
    {
        $(".login-form#register #state").html("Name format should be: LN, FN");
        return;
    }
    
    if(vals.Password != $(".login-form#register #confirm-password").val())
    {
        $(".login-form#register #state").html("Password does not match");
        return;
    }
    
    if(vals.Password.length < 6)
    {
        $(".login-form#register #state").html("Password should at least be 6 chars");
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
        {   
            $(".login-form#register #state").html(data.reason);
            Animate(".login-form#register", "wobble");
        }
        else
        {
            ExitLoginForm();
            ResetLoginFormFields();
        }
        
        $(".login-form#register").waitMe("hide");
    });
    
}


function ExitLoginForm()
{
    Animate("#login-menu", "fadeOutDownBig", function(){
        
    }, 2000);
}

function ResetLoginFormFields()
{
    $(".login-form#register #name").val("");
    $(".login-form#register #password").val("");
    $(".login-form#register #confirm-password").val("");
    $(".login-form#register #employee-number").val("");
    $(".login-form#login #employee-number").val("");
    $(".login-form#login #password").val("");
}

function GoToRegister()
{
    ResetLoginFormFields();
    $(".login-form#login").removeClass("fadeInLeftBig");
    $(".login-form#register").removeClass("fadeOutRightBig");
    
    $(".login-form#login").addClass("fadeOutLeftBig");
    $(".login-form#register").addClass("fadeInRightBig");
    $(".login-form#register").css("opacity","1");
}

function BackToLogin()
{
    ResetLoginFormFields();
    
    $(".login-form#login").removeClass("fadeOutLeftBig");
    $(".login-form#register").removeClass("fadeInRightBig");
    
    $(".login-form#login").addClass("fadeInLeftBig");
    $(".login-form#register").addClass("fadeOutRightBig");
    
}