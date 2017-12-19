var state = location.pathname.slice(1) || 'main',
    idleTimer = null,
    idleState = false, // состояние отсутствия
    idleWait = 30000; // время ожидания в мс. (1/1000 секунды)

(function($) {
    $(document).ready(function(){
        
        $.ajax({
            url: "/blocks/"+state+".html",
            dataType: "html",
            success: function(data) {
                $("#content").html(data);
                $('.menu').find('li').removeClass('active');
                $("#"+state).addClass('active');
            },
            error: function(xhr) {
                console.log(xhr.responseText);
            }
        });

        $('.menu li').click(function(){
            $("#loading").fadeIn(500);
            $('.menu').find('li').removeClass('active');
            $(this).addClass('active');
            state = this.id;
            $.ajax({
                url: "/blocks/"+state+".html",
                dataType: "html",
                success: function(data) {
                    $("#content").html(data);
                    $("#loading").fadeOut(500);
                    history.pushState(state,"Autocervice","/"+state);
                    console.log(history);
                },
                error: function(xhr) {
                    console.log(xhr.responseText);
                }
            });
        });

        addEventListener("popstate",function(e){
            $("#loading").fadeIn(500);
            $('.menu').find('li').removeClass('active');
            state = history.state || 'main';
            $("#"+state).addClass('active');
            $.ajax({
                url: "/blocks/"+state+".html",
                dataType: "html",
                success: function(data) {
                    $("#content").html(data);
                    $("#loading").fadeOut(500);
                    console.log(history);
                },
                error: function(xhr) {
                    console.log(xhr.responseText);
                }
            });
        },false);

        $('body').on('submit', 'form#clientForm', function(e){
            e.preventDefault();
            var data = {};
            $(this).serializeArray().map(function(x){data[x.name] = x.value;});
            $.ajax({
                url: "/getResource",
                dataType: "json",
                type: "post",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(data) {
                    console.log(data);
                },
                error: function(xhr) {
                    console.log(xhr.responseText);
                }
            });
        });

        $(document).bind('mousemove keydown scroll', function(){
            clearTimeout(idleTimer); // отменяем прежний временной отрезок
            // if(idleState == true){ 
            //   // Действия на возвращение пользователя
            //    $("body").append("<p>С возвращением!</p>");
            // }
         
            idleState = false;
            idleTimer = setTimeout(function(){ 
              // Действия на отсутствие пользователя
            //   alert("Купи это");
              idleState = true; 
            }, idleWait);
          });
         
          $("body").trigger("mousemove"); // сгенерируем ложное событие, для запуска скрипта
    });
})(jQuery);