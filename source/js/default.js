jQuery.noConflict();

(function($, window, document) {
    'use strict';

    window.wdstudio = {
        init: function() {
            this.preloader();
            this.socials();
            this.parallax();
            this.navigation();
            this.fixHeader();
            this.screenModeEvent()
        },

        getScreenMode: function () {
            return window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace('"', '').replace('"', '');
        },

        screenModeEvent: function() {
            var mode = wdstudio.getScreenMode();

            $(window).resize(function() {
                if (mode !== wdstudio.getScreenMode()) {
                    mode = wdstudio.getScreenMode();
                    $(document).trigger('changeScreenMode', String(mode));
                }
            });
        },

        navigation: function() {
            var toggle = $('.navigation__toggle'),
                navigation = $('.navigation'),
                menu = $('.navigation__menu'),
                body  = $('body'),
                status = true;

            var changePosition = function (mode, init) {
                if (init) {
                    if (mode === 'mobile') {
                        $('body').prepend(navigation);
                    }
                } else {
                    if (mode === 'mobile') {
                        $('body').prepend(navigation);
                        menu.removeAttr('style');
                    } else {
                        navigation.insertAfter(toggle).removeClass('show');
                    }
                    toggle.removeClass('navigation__toggle--active');
                }
            };

            var toggleNavigation = function () {
                if (status) {
                    status = false;
                    if (wdstudio.getScreenMode() == 'mobile') {
                        navigation.toggleClass('navigation--mobile-show');
                        toggle.toggleClass('navigation__toggle--right');
                        $('.header__logo').toggleClass('header__logo--hide');
                        setTimeout(function () {
                            status = true;
                        }, 500);
                    } else {
                        menu.toggle('slide', {
                            direction: 'left'
                        }, 500, function() {
                            status = true;
                        });
                    }
                    toggle.toggleClass('navigation__toggle--active');
                }
            };

            changePosition(wdstudio.getScreenMode(), true);

            $(document).on('changeScreenMode', function(e, mode) {
                changePosition(mode, false);
            });

            toggle.on('click', function() {
                toggleNavigation();
            });
        },

        fixHeader: function() {
            var header = $('.header'),
                logo = $('.hero__logo');

            var setHeader = function() {
                if ($(window).scrollTop() <= (logo.offset().top - header.outerHeight())) {
                    if (header.hasClass('header--fixed')) {
                        header.removeClass('header--fixed')
                    }
                } else {
                    if (!header.hasClass('header--fixed')) {
                        header.addClass('header--fixed')
                    }
                }
            };

            setHeader();

            $(window).scroll(function() {
                setHeader();
            });
        },

        preloader: function() {
            $('.preloader').hide('fade', 1000);
        },

        parallax: function() {
            $('.hero').parallax({
                speed: 0.1,
                imageSrc: '../images/background/bg-hero.jpg'
            });
        },

        socials: function() {
            SocialShareKit.init({
                url: 'http://wdstudio.eu/',
                text: 'Web Development, tylko z WDStudio!'
            });
        }

        // clicks: function () {
        // $('body').on('click', function () {
        //
        // });
        // }
    };


    $(document).ready(function() {
        wdstudio.init();
    });

    // $(document).on('scroll', function () {
    //     wdstudio.scrollEvent();
    // });
    //
    // $(window).on('resize', function () {
    //     wdstudio.resizeEvent();
    // });

})(jQuery, window, document);
