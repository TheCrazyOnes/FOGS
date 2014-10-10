var windowContent = {
    OpenMenu : '\
            <div class="row">\
                <ul id = "items" class="col-xs-8 reset">\
                </ul>\
                <div id = "description" class="col-xs-4">\
                </div>\
            </div>\
    ',
    Simple : '<div class="inner"></div>'
}

$(document).ready(function(){
	
});


var PopupWindow = {

    Html : '\
<div class = "notification-fader animated fadeIn" onclick = "PopupWindow.Close();">\
</div>\
<div class="window layer-4 animated fadeInDown">\
    <div class="title"><span id = "text"></span><span onclick="PopupWindow.Close();" id = "close" class="pull-right glyphicon glyphicon-remove"></span>\
    </div>\
    <div class="body">\
    </div>\
    <div class="action-menu"><span class="status"></span>\
    </div>\
</div>\
    ',
    Object: null,
    Show : function(options){
        
        var delay = 0;
            
        
        if(PopupWindow.IsOpen)
        {
            delay = 500;
            PopupWindow.Close();
        }
        
        setTimeout(function(){
            
            options = options || {};

            var defaultOptions = {
                Type: "",
                Content: windowContent.Simple, 
                ActionButtons: '<a onclick = "PopupWindow.Close();" class="btn gray pull-right">Done</a>',
                Title: "Menu",
                Size: {Width: 500, Height: 300},
                OnRender: function(){}
            };

            
            defaultOptions = MergeArray(defaultOptions, options);

            
            $("body>.inner").append(PopupWindow.Html);
            $(".window .body").html(defaultOptions.Content);
            $(".window").css({width: defaultOptions.Size.Width + "px", height: defaultOptions.Size.Height + "px"})
            $(".window .title").addClass(defaultOptions.Type);
            $(".window .title #text").html(defaultOptions.Title);
            $(".window .action-menu").append(defaultOptions.ActionButtons);

            PopupWindow.Object = $(".window");
            
            defaultOptions.OnRender();
            
            setTimeout(function(){
                $(".window").removeClass("fadeInDown");
                $(".notification-fader").removeClass("fadeIn");
            }, 500);
            PopupWindow.IsOpen = true;
            
        },delay);
    },
    
    Close : function(){
        
        PopupWindow.OnClose();
        
        $(".window").addClass("fadeOutDown");
        $(".notification-fader").addClass("fadeOut");
        
        setTimeout(function(){
            $(".notification-fader").remove();
            $(".window").remove();
        }, 500);
        
        PopupWindow.IsOpen = false;
    },
    OnClose : function (){
        
    },
    IsOpen : false
    
}

function ShowErrorMessage(title, msg, callback, width, height)
{
    width = width || 250;
    height = height || 155;
    PopupWindow.Show({
        Type: "error",
        Content: windowContent.Simple, 
        Title: title, 
        ActionButtons: '<a tabindex=0 onclick = "'+callback+'();" class="btn gray pull-right">OK</a>',
        Size: {Width: width, Height: height}, 
        OnRender:function(){
            $(".window .body .inner").html(msg);    
        }
    });
}

jQuery.fn.extend({
    StartLoading: function(bg) {
        return this.each(function() {
            
			bg = bg || "transparent";
			
			$(this).waitMe({
                effect : 'stretch',
                text : '',
                bg : bg,
                color : "#999",
                sizeW : '',
                sizeH : ''
            });

        });
    },
    StopLoading: function() {
        return this.each(function() {
            $(this).waitMe("hide");
        });
    }
});

function AlertOnError(data)
{
    if(data.indexOf("You have") != -1)
        alert(data);
        
}

function MergeArray(a1, a2)
{
    $.each(a2,function(key,value){
        a1[key] = value;
    });
    
    return a1;
}

function Animate(selector, animation, callback, delay, remove)
{
//    alert($(selector).html());
    delay = delay || 500;
    remove = remove || false;
    
    var animations = ["animated", "slideInDown", "slideInLeft", "slideInRight", "slideInUp", "slideOutDown","slideOutUp", "slideOutLeft", "slideOutRight", "bounce","flash","pulse","rubberBand","shake","swing","tada","wobble","bounceIn","bounceInDown","bounceInLeft","bounceInRight","bounceInUp","Bouncing Exits","bounceOut","bounceOutDown","bounceOutLeft","bounceOutRight","bounceOutUp","fadeIn","fadeInDown","fadeInDownBig","fadeInLeft","fadeInLeftBig","fadeInRight","fadeInRightBig","fadeInUp","fadeInUpBig","fadeOut","fadeOutDown","fadeOutDownBig","fadeOutLeft","fadeOutLeftBig","fadeOutRight","fadeOutRightBig","fadeOutUp","fadeOutUpBig","flip","flipInX","flipInY","flipOutX","flipOutY","Lightspeed","lightSpeedIn","lightSpeedOut","rotateIn","rotateInDownLeft","rotateInDownRight","rotateInUpLeft","rotateInUpRight","rotateOut","rotateOutDownLeft","rotateOutDownRight","rotateOutUpLeft","rotateOutUpRight","hinge","rollIn","rollOut","zoomIn","zoomInDown","zoomInLeft","zoomInRight","zoomInUp","zoomOut","zoomOutDown","zoomOutLeft","zoomOutRight","zoomOutUp"];
    
    animations.forEach(function(e,i){
        $(selector).removeClass(e);
    });
    
    callback = callback || function(){};
    
    $(selector).css("animation-duration", delay / 1000 + "s");
    $(selector).addClass(animation);

    $(selector).addClass("animated");
    if(!remove)
    {
        callback();   
        return;
    }
    
    setTimeout(function(){
        $(selector).removeClass(animation);
        callback();
    }, delay);
    
}

function Iterate(callback, repetitions,delay, onFinish)
{
    var i = 0;
	onFinish = onFinish || function(){};
    var iterator = setInterval(function(){
        if(repetitions == i)
		{
			onFinish();
            clearTimeout(iterator);
			return;
		}

        callback(i);

        i++; 
    }, delay);

}
