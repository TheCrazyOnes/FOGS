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
            $(".window .title #text").html(defaultOptions.Title);
            $(".window .action-menu").append(defaultOptions.ActionButtons);

            defaultOptions.OnRender();
            
            setTimeout(function(){
                $(".window").removeClass("fadeInDown");
                $(".notification-fader").removeClass("fadeIn");
            }, 500);
            PopupWindow.IsOpen = true;
            
        },delay);
    },
    
    Close : function(){
        $(".window").addClass("fadeOutDown");
        $(".notification-fader").addClass("fadeOut");
        
        setTimeout(function(){
            $(".notification-fader").remove();
            $(".window").remove();
        }, 500);
        
        PopupWindow.IsOpen = false;
    },
    IsOpen : false
    
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
    
    var animations = ["animated","bounce","flash","pulse","rubberBand","shake","swing","tada","wobble","bounceIn","bounceInDown","bounceInLeft","bounceInRight","bounceInUp","Bouncing Exits","bounceOut","bounceOutDown","bounceOutLeft","bounceOutRight","bounceOutUp","fadeIn","fadeInDown","fadeInDownBig","fadeInLeft","fadeInLeftBig","fadeInRight","fadeInRightBig","fadeInUp","fadeInUpBig","fadeOut","fadeOutDown","fadeOutDownBig","fadeOutLeft","fadeOutLeftBig","fadeOutRight","fadeOutRightBig","fadeOutUp","fadeOutUpBig","flip","flipInX","flipInY","flipOutX","flipOutY","Lightspeed","lightSpeedIn","lightSpeedOut","rotateIn","rotateInDownLeft","rotateInDownRight","rotateInUpLeft","rotateInUpRight","rotateOut","rotateOutDownLeft","rotateOutDownRight","rotateOutUpLeft","rotateOutUpRight","hinge","rollIn","rollOut","zoomIn","zoomInDown","zoomInLeft","zoomInRight","zoomInUp","zoomOut","zoomOutDown","zoomOutLeft","zoomOutRight","zoomOutUp"];
    
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

function Iterate(callback, repetitions,delay)
{
    var i = 0;
    var iterator = setInterval(function(){
        if(repetitions == i)
            clearTimeout(iterator);

        callback(i);

        i++; 
    }, delay);

}
