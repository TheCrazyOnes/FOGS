$(document).ready(function(){
    
   Initialize();
   
});

function Initialize()
{
    $("#login-logo").waitMe({
        effect : 'win8_linear',
        text : 'initializing...',
        bg : "transparent",
        color : "#AAA",
        sizeW : '',
        sizeH : ''
    });

    $("#login-menu #login-logo").addClass("loading");
    $("#login-menu").addClass("loading");
    $(".login-form#login").css("opacity",0);
    
    $.post("php/frontend-com.php", {method: "Initialize"}, function(data){

        data = JSON.parse(data);
		
        setTimeout(function(){
            $("#login-menu #login-logo").removeClass("loading");
            $("#login-menu").removeClass("loading");

            $("#login-logo").waitMe("hide");    
            
            setTimeout(function(){
                
                if(data.state == "logged out")
                {   
                    $(".login-form#login").addClass("fadeInRightBig").css("opacity",1);
                }
                else
                {
					if(data.SubjectDetails != null)
						ImplementSubject(data);

					ExitLoginForm(data);
                }

            },500);

            
        },0);

    });
}

function Login()
{
    var vals = {};
    
    vals.method = "Login";
    vals.EmployeeNumber = $(".login-form#login #employee-number").val().trim();
    vals.Password = $(".login-form#login #password").val();
    
    if(vals.EmployeeNumber == "" || vals.Password == "")
    {
        $(".login-form#login #state").html("Employee Number or password is not provided");
        
        Animate(".login-form#login", "wobble", function(){}, 500, true);
        return;
    }
        
    $(".login-form#login").waitMe({
        effect : 'stretch',
        text : 'Verifying credentials...',
        bg : "rgba(0,0,0,0.5)",
        color : "#AAA",
        sizeW : '',
        sizeH : ''
    });
    
    $.post("php/frontend-com.php", vals, function(data){
        
        data = JSON.parse(data);
        
        if(data.state == "error")
        {   
            $(".login-form#login #state").html(data.reason);
            Animate(".login-form#login", "wobble", function(){}, 500, true);
        }
        else
        {
            ExitLoginForm(data.credentials );
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
    
    var willBreak = false;
    
    if(vals.EmployeeNumber == "")
    {
        $(".login-form#register #state").html("Employee Number is not provided");
        willBreak = true;
    }
    
    if(vals.Name == "")
    {
        $(".login-form#register #state").html("Name is not provided");
        willBreak = true;
    }
    
    if( vals.Name.indexOf(",") < 2)
    {
        $(".login-form#register #state").html("Name format should be: LN, FN");
        willBreak = true;
    }
    
    if(vals.Password != $(".login-form#register #confirm-password").val())
    {
        $(".login-form#register #state").html("Password does not match");
        willBreak = true;
    }
    
    if(vals.Password.length < 6)
    {
        $(".login-form#register #state").html("Password should at least be 6 chars");
        willBreak = true;
    }
    
    if(willBreak)
    {
//        Animate(".login-form#login", "wobble", function(){}, 500, true);
        Animate(".login-form#register", "wobble", function(){}, 500, true);
        return;
    }
    
    $(".login-form#register").waitMe({
        effect : 'stretch',
        text : 'Checking availability...',
        bg : "rgba(0,0,0,0.5)",
        color : "#AAA",
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
            ExitLoginForm(data.credentials );
            ResetLoginFormFields();
        }
        
        $(".login-form#register").waitMe("hide");
    });
    
}


function ExitLoginForm(data)
{
    userInfo.Name = data.Name;
    userInfo.EmployeeNumber = data.EmployeeNumber;
    
//    alert(userInfo.Name);
//    alert(userInfo.Name.split(",")[0]);
    $("header #head #user>strong").html(userInfo.Name.split(",")[0]);
    $("header #head #user>div").html(userInfo.Name.split(",")[1]);
//    alert(userInfo.EmployeeNumber);
    $("header #head #user>span>span:last-child").html(userInfo.EmployeeNumber);
    $(".login-form#login").removeClass("animated");
//    Animate(".login-form#login", "fadeOutDown",function(){},1000,true);
    
    Animate("#login-menu", "slideOutDown", function(){
        
    }, 1000);
}



function ResetLoginFormFields()
{
    $(".login-form#register #name").val("");
    $(".login-form#register #password").val("");
    $(".login-form#register #confirm-password").val("");
    $(".login-form#register #employee-number").val("");
    $(".login-form#register #state").html("");
    $(".login-form#login #employee-number").val("");
    $(".login-form#login #password").val("");
    $(".login-form#login #state").html("");
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

function Logout()
{
    $("#universal-progress").removeClass().addClass("p-50");
    $.post("php/frontend-com.php",{method:"Logout"},function(data){
        
        $("#universal-progress").removeClass().addClass("p-100");
        $("#login-menu").addClass("loading");
        Animate("#login-menu", "slideInDown", function(){
            Initialize();
            $("#universal-progress").removeClass();
        }, 1000, true);
    });
}