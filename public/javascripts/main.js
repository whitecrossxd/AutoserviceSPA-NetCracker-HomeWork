var state = location.pathname.slice(1) || 'main',
    idleTimer = null,
    idleState = false, // состояние отсутствия
    idleWait = 30000; // время ожидания в мс. (1/1000 секунды)

    (function($) {
        $(document).ready(function(){
            $("#loading").fadeIn(500);
            var menuItem = $('.menu').find('li');
            $('.menu').find('li').removeClass('active');
            $.ajax({
            url: "/blocks/"+state+".html",
            dataType: "html",
            success: function(data) {
                $("#content").html(data).slideDown(500);
                $("."+state).addClass('active');
                $('html, body').animate({
                    scrollTop: $("."+state).offset().top
                }, 3000);
                $("#loading").fadeOut(500);
            },
            error: function(xhr) {
                console.log(xhr.responseText);
            }
        });

        $('.menu li').click(function(){
            $("#loading").fadeIn(500);
            $("#content").slideUp(500);
            menuItem.removeClass('active');
            console.log(this.className)
            state = this.className;
            $("."+state).addClass('active');
            $.ajax({
                url: "/blocks/"+state+".html",
                dataType: "html",
                success: function(data) {
                    $("#content").html(data).slideDown(500);
                    history.pushState(state,"Autocervice","/"+state);
                    $('html, body').animate({
                        scrollTop: $("."+state).offset().top
                    }, 3000);
                    $("#loading").fadeOut(500);
                    console.log(history);
                },
                error: function(xhr) {
                    console.log(xhr.responseText);
                }
            });
        });

        addEventListener("popstate",function(e){
            $("#loading").fadeIn(500);
            $("#content").slideUp(500);
            menuItem.removeClass('active');
            state = history.state || 'main';
            $("."+state).addClass('active');
            $.ajax({
                url: "/blocks/"+state+".html",
                dataType: "html",
                success: function(data) {
                    $("#content").html(data).slideDown(500);
                    $('html, body').animate({
                        scrollTop: $("."+state).offset().top
                    }, 3000);
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