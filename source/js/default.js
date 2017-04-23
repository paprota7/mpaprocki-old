jQuery.noConflict();

(function($, window, document) {
    'use strict';

    // Global mini scripts
    // ==================================

    window.mpaprocki = {
        init: function() {
            this.screenModeEvent();
            this.slider();
            this.popup();
            this.fixHeader();
            this.mobileMenu();
            this.scrollTop();
            this.pageInit();
        },

        pageInit: function() {
            $('.preloader').hide('fade', 500);
        },

        getScreenMode: function() {
            return window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace('"', '').replace('"', '');
        },

        popup: function() {
            $('[data-popup="true"]').popup({
                showAnimation: 'slideInDown',
                hideAnimation: 'slideOutUp'
            });
        },

        screenModeEvent: function() {
            var mode = mpaprocki.getScreenMode();

            $(window).resize(function() {
                if (mode !== mpaprocki.getScreenMode()) {
                    mode = mpaprocki.getScreenMode();
                    $(document).trigger('changeScreenMode', String(mode));
                }
            });
        },

        mobileMenu: function() {
            var toggle = $('.header__toggle'),
                header = $('.header'),
                body = $('body'),
                nav = $('.navigation'),
                socials = $('.socials'),
                headerHeight = header.outerHeight(true),
                headerOffset = header.offset().top;

            function changeHeader() {
                if ($(window).scrollTop() >= headerOffset) {
                    header.addClass('header--fixed');
                    body.css('padding-top', headerHeight);
                } else {
                    header.removeClass('header--fixed');
                    body.css('padding-top', 0);
                }
            };

            toggle.click(function(e) {
                e.preventDefault();
                if (mpaprocki.getScreenMode() === 'mobile' || mpaprocki.getScreenMode() === 'tablet') {
                    if (nav.hasClass('toggled')) {
                        toggle.removeClass('close');
                        socials.hide('drop', {
                            direction: 'down'
                        }, 200, function() {
                            nav.hide('slide', {
                                direction: 'up'
                            }, 300, function() {
                                $(this).removeAttr('style').removeClass('toggled');
                            });
                            body.removeAttr('style');
                            changeHeader();
                        });
                    } else {
                        toggle.addClass('close');
                        header.addClass('header--fixed');
                        body.css('overflow', 'hidden');
                        nav.css('top', header.outerHeight(true)).show('slide', {
                            direction: 'up'
                        }, 300, function() {
                            socials.show('drop', {
                                direction: 'down'
                            }, 200);
                        }).addClass('toggled');
                    }
                }
            });
        },

        scrollTop: function() {
			var scrollButton = $('.scroll-top'),
				scrollStatus = false;

			function setScroll () {
				if ($(window).scrollTop() > 100) {
					if (!scrollStatus) {
						scrollButton.fadeIn(200);
						scrollStatus = true;
					}
                } else {
					if (scrollStatus) {
						scrollButton.fadeOut(200);
						scrollStatus = false;
					}
                }
			}

			setScroll();

            $(window).scroll(function() {
                setScroll();
            });

            scrollButton.click(function() {
                $('html, body').animate({
                    scrollTop: 0
                }, 500);
            });
        },

        fixHeader: function() {
            var header = $('.header'),
                body = $('body'),
                headerHeight = header.outerHeight(true),
                headerOffset = header.offset().top;

            function changeHeader() {
                if ($(window).scrollTop() >= headerOffset) {
                    header.addClass('header--fixed');
                    body.css('padding-top', headerHeight);
                } else {
                    header.removeClass('header--fixed');
                    body.css('padding-top', 0);
                }
            };

            changeHeader();

            $(window).scroll(function() {
                changeHeader();
            });
        },

        slider: function() {
            var sliderLeft = $('.slider__left'),
                sliderRight = $('.slider__right'),
                sliderRightWrapper = sliderRight.closest('.slider__wrapper--right'),
                loader = $('.slider__loader'),
                next = $('.slider__next'),
                content = sliderRightWrapper.find('.slider__content');

            function changeContent(index) {
                var slide = sliderRight.find('.slider__slide[data-slick-index="' + index + '"]'),
                    title = slide.data('slide-title'),
                    text = slide.data('slide-text'),
                    anchor = slide.data('slide-anchor');

                content.hide('fade', 200, function() {
                    $(this).attr('href', anchor);
                    $(this).find('h2').text(title);
                    $(this).find('p').text(text);
                    $(this).show('drop', {
                        direction: 'up'
                    }, 200);
                });
            };

            function startLoader() {
                if ($(window).outerWidth() >= 992) {
                    loader.animate({
                        width: '66.666%'
                    }, 5000);
                } else {
                    loader.animate({
                        width: '100%'
                    }, 5000);
                }
            };

            sliderLeft.slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                adaptiveHeight: true,
                autoplay: true,
                autoplaySpeed: 5000,
                focusOnSelect: false,
                asNavFor: '.slider__right'
            });

            sliderRight.slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                adaptiveHeight: true,
                autoplay: true,
                autoplaySpeed: 5000,
                focusOnSelect: false,
                asNavFor: '.slider__left'
            });

            changeContent(0);
            startLoader();

            next.click(function() {
                sliderRight.slick('slickNext');
            });

            sliderRight.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
                changeContent(nextSlide);
                loader.stop().css('width', 0);
            });

            sliderRight.on('afterChange', function(event, slick, currentSlide) {
                startLoader();
            });
        }
    };

    // Execute global scripts
    // ===============================
    $(document).ready(function() {
        mpaprocki.init();
    });


    // Own Plugins
    // ===============================

    $.fn.extend({
        animateCss: function(animationName, afterFunction) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            this.addClass('animated ' + animationName).one(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);
                if (afterFunction) {
                    afterFunction();
                }
            });
        }
    });

    $.fn.popup = function(options) {

        var settings = $.extend({
            showAnimation: 'fadeInDownBig',
            hideAnimation: 'fadeOutUpBig'
        }, options);

		function hidePopup(element) {
			$('body').removeAttr('style');
			element.animateCss(settings.hideAnimation, function() {
				element.removeClass('active');
			});
		}

		function showPopup(element) {
			element.animateCss(settings.showAnimation, function() {
				$('body').css('overflow', 'hidden');
			});
			element.addClass('active');
		}

        $(this).each(function() {
            var click = $(this),
                target = $($(this).data('popup-target'));

            target.wrapInner('<div class="popup__wrapper"></div>');
            target.find('.popup__wrapper').prepend('<a href="#close-popup" class="popup__close">Close</a>');

            var close = target.find('.popup__close');


            click.add(close).on('click', function(e) {
                e.preventDefault();
                if (target.hasClass('active')) {
                    hidePopup(target);
                } else {
                    showPopup(target);
                }
            });
        });

        $(document).on('keyup', function(evt) {
            if (evt.keyCode == 27) {
                var target = $('.popup.active');

                if (target.length > 0) {
                    hidePopup(target);
                }
            }
        });

        return this;
    };


})(jQuery, window, document);
