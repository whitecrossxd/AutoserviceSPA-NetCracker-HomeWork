var slideNow = 1,
    translateWidth = 0,
    slideInterval = 3500,
    slideCount;

(function ($) {

    var Validation = {
        init: function () {

        },
        validate: function (data) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(String(data.email).toLowerCase()) && data.name !== "" && data.lastname != "") {
                return true;
            }else{
                return false;
            }
        }
    };

    var AppView = {
        init: function () {
            this.content = $(".main-part").find("#content");
            $("#loading").fadeIn(500);
            var menuItem = $('.menu').find('li');
        },
        redraw: function (redrawData) {
            var data = redrawData.data;
            var successCallback = redrawData.successCallback;
            var _this = this;
            this.content.fadeOut(function () {
                _this.content.html(data);
                _this.content.fadeIn(function () {
                    if (successCallback != undefined) {
                        $("#loading").fadeOut(500);
                        successCallback();
                    }
                });
            });
        }
    };

    var Navigation = {
        init: function () {
            this.createHandlers();
            this.checkURL();
            this.browserArrowsControler();
        },
        checkURL: function () {
            var resource = document.location.pathname;
            if(resource == "/"){
                resource = "/main";
            }
            this.navigationStep.processRequest(resource, Navigation.wizard.getPageByResource(resource).redrawCallback);
        },
        browserArrowsControler: function(){
            addEventListener("popstate", function (e) {
                Navigation.checkURL();
            }, false);
        },
        createHandlers: function () {
            this.mainElement = $("body");
            this.navigation = this.mainElement.find(".menu");
            this.navElements = this.navigation.find("li");
            this.navElements.click(this.navigationStep.handleClick);
        },
        navigationStep: {
            handleClick: function (event) {
                if (document.location.pathname == "/main" || document.location.pathname == "/") {
                    slider.clearInterval();
                }
                $("#loading").fadeIn(500);
                var resource = "/" + $(this).attr("location");
                $('.menu').find('li').removeClass('active');
                $('[location=' + resource.slice(1) + ']').addClass("active");
                history.pushState(resource, "Autocervice", resource);
                Navigation.navigationStep.processRequest(resource, Navigation.wizard.getPageByResource(resource).redrawCallback);
            },
            processRequest: function (resource, successCallback) {
                $('.menu').find('li').removeClass('active');
                $.ajax({
                    dataType: "html",
                    url: "/blocks" + resource + ".html",
                    success: function (data) {
                        AppView.redraw({ data: data, successCallback: successCallback });
                        $('[location=' + resource.slice(1) + ']').addClass("active");
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
                        var li = $(".main").find(".service-item");
                        li.hover(function () {
                            $(this).next(".service-item-text").fadeIn();
                        }, function () {
                            $(this).next(".service-item-text").fadeOut();
                        })
                        slider.init();
                    }
                },
                about: {
                    name: "/about",
                    resource: "/about",
                    redrawCallback: function (data) {
                        $("#content").html(data).fadeIn();
                    }
                },
                clientForm: {
                    name: "Create Ticket",
                    resource: "/clientForm",
                    redrawCallback: function (data) {
                        var clientForm = $("#clientForm");
                        clientForm.find("input[type='submit']").click(function (event) {
                            event.preventDefault();
                            var error = $(".error"),
                                success = $(".success"),
                                header = $("<h2>");
                            var formData = {};
                            clientForm.serializeArray().map(function (x) { formData[x.name] = x.value; });
                            var backToMain = "/main";
                            if (Validation.validate(formData)) {
                                $.ajax({
                                    url: "/getResource",
                                    dataType: "json",
                                    type: "post",
                                    data: JSON.stringify(formData),
                                    contentType: "application/json",
                                    success: function (responseData) {
                                        header.text("Ваша заявка успешно отправлена!");
                                        var datefield = $("<div>");
                                        datefield.text(responseData.carmodel);
                                        success.append(header).append(datefield);
                                        $("#content").html(success);
                                    },
                                    error: function (xhr) {
                                        console.log(xhr.responseText);
                                    }
                                });
                            }else if(formData.email == "" || formData.name =="" || formData.lastname == "") {
                                header.text("Заполните поля: Имя, Фамилия и Email!");
                                error.html(header);
                                $("#clientForm").append(error);
                            }else{
                                header.text("Email указан не верно!");
                                error.html(header);
                                $("#clientForm").append(error);
                            }
                        });
                    }
                },
                works: {
                    name: "/works",
                    resource: "/works",
                    redrawCallback: function (data) {
                        $("#content").html(data).fadeIn();
                    }
                },
                partners: {
                    name: "/partners",
                    resource: "/partners",
                    redrawCallback: function (data) {
                        $("#content").html(data).fadeIn();
                    }
                },
                
            }
        }
    };
    var slider = {
        init: function (){
            this.handlers();
            this.sliderInterval();
        },
        clearInterval: function (){
            clearInterval(switchInterval);
        },
        sliderInterval: function () {
            switchInterval = setInterval(this.nextSlide, slideInterval);          
        },
        handlers: function (){
            this.next = $('#next-btn');
            this.next.click(this.nextSlide);
            this.prev = $('#prev-btn');
            this.prev.click(this.prevSlide);            
            this.port = $('#viewport');
            this.port.mouseover(this.hoverOn);
            this.port.mouseout(this.hoverOut);
        },
        nextSlide: function (){
            slideCount = $('#slidewrapper').children().length;
            if (slideNow == slideCount || slideNow <= 0 || slideNow > slideCount) {
                $('#slidewrapper').css('transform', 'translate(0, 0)');
                slideNow = 1;
            } else {
                translateWidth = -$('#viewport').width() * (slideNow);
                $('#slidewrapper').css({
                    'transform': 'translate(' + translateWidth + 'px, 0)',
                    '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
                    '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
                });
                slideNow++;
            }
        },
        prevSlide: function (){
            if (slideNow == 1 || slideNow <= 0 || slideNow > slideCount) {
                translateWidth = -$('#viewport').width() * (slideCount - 1);
                $('#slidewrapper').css({
                    'transform': 'translate(' + translateWidth + 'px, 0)',
                    '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
                    '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
                });
                slideNow = slideCount;
            } else {
                translateWidth = -$('#viewport').width() * (slideNow - 2);
                $('#slidewrapper').css({
                    'transform': 'translate(' + translateWidth + 'px, 0)',
                    '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
                    '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
                });
                slideNow--;
            }
        },
        hoverOn: function () {
            clearInterval(switchInterval);
        },
        hoverOut: function () {
            slider.sliderInterval();
        }
    };
    
    $(document).ready(function () {
        AppView.init();
        Navigation.init();
    });


})(jQuery);