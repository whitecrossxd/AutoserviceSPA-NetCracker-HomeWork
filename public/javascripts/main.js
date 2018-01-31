var idleTimer = null,
    idleState = false, // состояние отсутствия
    idleWait = 30000; // время ожидания в мс. (1/1000 секунды)

(function ($) {

    var slideNow = 1,
        translateWidth = 0,
        slideInterval = 5000,
        slideCount;

    var Validation = {
        init: function () {

        },
        validate: function (data) {
            return true;
        }
    };

    var AppView = {
        init: function () {
            this.content = $(".main-part").find("#content");
            $("#loading").fadeIn(500);
            var menuItem = $('.menu').find('li');
            $('.menu').find('li').removeClass('active');
        },
        redraw: function (redrawData) {
            var data = redrawData.data;
            var successCallback = redrawData.successCallback;
            var _this = this;
            this.content.fadeOut(function () {
                _this.content.html(data);
                _this.content.fadeIn(function () {
                    if (successCallback != undefined) {
                        successCallback(data);
                        $("#loading").fadeOut(500);
                    }
                });
            });
        }
    };

    var Navigation = {
        init: function () {
            this.createHandlers();
            this.checkURL();
        },
        checkURL: function () {
            var resource = document.location.pathname;
            if(resource == "/"){
                resource = "/main";
            }
            this.navigationStep.processRequest(resource, Navigation.wizard.getPageByResource(resource).redrawCallback);
        },
        createHandlers: function () {
            this.mainElement = $(".main-part");
            this.navigation = this.mainElement.find(".menu");
            this.navElements = this.navigation.find("li");
            this.navElements.click(this.navigationStep.handleClick);
        },
        navigationStep: {
            handleClick: function (event) {
                var resource = "/" + $(this).attr("location");
                history.pushState(resource, "Autocervice", resource);
                Navigation.navigationStep.processRequest(resource, Navigation.wizard.getPageByResource(resource).redrawCallback);
            },
            processRequest: function (resource, successCallback) {
                $.ajax({
                    dataType: "html",
                    url: "/blocks" + resource + ".html",
                    success: function (data) {
                        AppView.redraw({ data: data, successCallback: successCallback });
                    },
                    error: function (xhr) {
                        alert("Not OK");
                    }
                });
            }
        },
        wizard: {
            getPageByResource: function (resource) {
                var page;
                var pages = $.map(Navigation.wizard.pages, function (value, index) {
                    return [value];
                });
                pages.forEach(function (item, i) {
                    if (item.resource == resource)
                        page = item;
                });
                return page;
            },
            pages: {
                main: {
                    name: "/main",
                    resource: "/main",
                    redrawCallback: function (data) {
                        $("#content").html(data).fadeIn();
                        $("#loading").fadeOut(500);
                        console.log(history);
                    }
                },
                clientForm: {
                    name: "Create Ticket",
                    resource: "/clientForm",
                    redrawCallback: function (data) {
                        var clientForm = $("#clientForm");
                        clientForm.find("input[type='submit']").click(function (event) {
                            event.preventDefault();
                            var formData = {};
                            clientForm.serializeArray().map(function (x) { formData[x.name] = x.value; });
                            // if (Validation.validate(formData)) {
                                $.ajax({
                                    url: "/getResource",
                                    dataType: "json",
                                    type: "post",
                                    data: JSON.stringify(formData),
                                    contentType: "application/json",
                                    success: function (responseData) {
                                        var div = $("<div>");
                                        var header = $("<h2>");
                                        header.text(responseData.text);
                                        var datefield = $("<div>");
                                        datefield.text(responseData.date);
                                        var status = $("<div>");
                                        status.text(responseData.status);
                                        div.append(header).append(datefield).append(status);
                                        $("#content").append(div);
                                    },
                                    error: function (xhr) {
                                        console.log(xhr.responseText);
                                    }
                                });
                            // }

                        });
                    }
                }
            }
        }
    };
    

    $(document).ready(function () {
        AppView.init();
        Navigation.init();
        // var switchInterval = setInterval(nextSlide, slideInterval);

        
        // $.ajax({
        //     url: "/blocks/" + state + ".html",
        //     dataType: "html",
        //     success: function (data) {
        //         $("#content").html(data).fadeIn();
        //         $("." + state).addClass('active');
        //         $("#loading").fadeOut(500);
        //         $('#viewport').hover(function () {
        //             clearInterval(switchInterval);
        //         }, function () {
        //             switchInterval = setInterval(nextSlide, slideInterval);
        //         });
        //         $('#next-btn').click(function() {
        //             nextSlide();
        //         });
            
        //         $('#prev-btn').click(function() {
        //             prevSlide();
        //         });
        //     },
        //     error: function (xhr) {
        //         console.log(xhr.responseText);
        //     }
        // });

        // slider
        // function nextSlide() {
        //     slideCount = $('#slidewrapper').children().length;
        //     if (slideNow == slideCount || slideNow <= 0 || slideNow > slideCount) {
        //         $('#slidewrapper').css('transform', 'translate(0, 0)');
        //         slideNow = 1;
        //     } else {
        //         translateWidth = -$('#viewport').width() * (slideNow);
        //         $('#slidewrapper').css({
        //             'transform': 'translate(' + translateWidth + 'px, 0)',
        //             '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
        //             '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
        //         });
        //         slideNow++;
        //     }
        // };
        // function prevSlide() {
        //     if (slideNow == 1 || slideNow <= 0 || slideNow > slideCount) {
        //         translateWidth = -$('#viewport').width() * (slideCount - 1);
        //         $('#slidewrapper').css({
        //             'transform': 'translate(' + translateWidth + 'px, 0)',
        //             '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
        //             '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
        //         });
        //         slideNow = slideCount;
        //     } else {
        //         translateWidth = -$('#viewport').width() * (slideNow - 2);
        //         $('#slidewrapper').css({
        //             'transform': 'translate(' + translateWidth + 'px, 0)',
        //             '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
        //             '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
        //         });
        //         slideNow--;
        //     }
        // };

        // $('.menu li').click(function () {
        //     $("#loading").fadeIn(500);
        //     $("#content").fadeOut();
        //     menuItem.removeClass('active');
        //     console.log(this.className)
        //     state = this.className;
        //     $("." + state).addClass('active');
        //     $.ajax({
        //         url: "/blocks/" + state + ".html",
        //         dataType: "html",
        //         success: function (data) {
        //             $("#content").html(data).fadeIn();
        //             history.pushState(state, "Autocervice", "/" + state);
        //             $("#loading").fadeOut(500);
        //             console.log(history);
        //         },
        //         error: function (xhr) {
        //             console.log(xhr.responseText);
        //         }
        //     });
        // });

        // addEventListener("popstate", function (e) {
        //     $("#loading").fadeIn(500);
        //     $("#content").fadeOut(500);
        //     menuItem.removeClass('active');
        //     state = history.state || 'main';
        //     $("." + state).addClass('active');
        //     $.ajax({
        //         url: "/blocks/" + state + ".html",
        //         dataType: "html",
        //         success: function (data) {
        //             $("#content").html(data).fadeIn(500);
        //             $("#loading").fadeOut(500);
        //             console.log(history);
        //         },
        //         error: function (xhr) {
        //             console.log(xhr.responseText);
        //         }
        //     });
        // }, false);

        // $('body').on('submit', 'form#clientForm', function (e) {
        //     e.preventDefault();
        //     var data = {};
        //     $(this).serializeArray().map(function (x) { data[x.name] = x.value; });
        //     $.ajax({
        //         url: "/getResource",
        //         dataType: "json",
        //         type: "post",
        //         data: JSON.stringify(data),
        //         contentType: "application/json",
        //         success: function (data) {
        //             console.log(data);
        //         },
        //         error: function (xhr) {
        //             console.log(xhr.responseText);
        //         }
        //     });
        // });

        // $(document).bind('mousemove keydown scroll', function () {
        //     clearTimeout(idleTimer); // отменяем прежний временной отрезок
        //     // if(idleState == true){ 
        //     //   // Действия на возвращение пользователя
        //     //    $("body").append("<p>С возвращением!</p>");
        //     // }

        //     idleState = false;
        //     idleTimer = setTimeout(function () {
        //         // Действия на отсутствие пользователя
        //         //   alert("Купи это");
        //         idleState = true;
        //     }, idleWait);
        // });

        // $("body").trigger("mousemove"); // сгенерируем ложное событие, для запуска скрипта

        
    });


})(jQuery);