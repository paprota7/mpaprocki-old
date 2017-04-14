jQuery.noConflict();

(function($, window, document) {
    'use strict';

    window.mpaprocki = {
        init: function() {
            this.screenModeEvent();
            this.slider();
			this.fixHeader();
			this.mobileMenu();
			this.pageInit();
        },

        pageInit: function() {
			$('.preloader').hide('fade', 500);
        },

        getScreenMode: function() {
            return window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace('"', '').replace('"', '');
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

		mobileMenu: function () {
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
						socials.hide('drop', {direction: 'down'}, 200, function () {
							nav.hide('slide', {direction: 'up'}, 300, function () {
								$(this).removeAttr('style').removeClass('toggled');
							});
							body.removeAttr('style');
							changeHeader();
						});
					} else {
						header.addClass('header--fixed');
						body.css('overflow', 'hidden');
						nav.css('top', header.outerHeight(true)).show('slide', {direction: 'up'}, 300, function () {
							socials.show('drop', {direction: 'down'}, 200);
						}).addClass('toggled');
					}
				}
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

			function changeContent (index) {
				var slide = sliderRight.find('.slider__slide[data-slick-index="' + index + '"]'),
					title = slide.data('slide-title'),
					text = slide.data('slide-text'),
					anchor = slide.data('slide-anchor');

				content.hide('fade', 200, function () {
					$(this).attr('href', anchor);
					$(this).find('h2').text(title);
					$(this).find('p').text(text);
					$(this).show('drop', {direction: 'up'}, 200);
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

        // clicks: function () {
        // $('body').on('click', function () {
        //
        // });
        // }
    };


    $(document).ready(function() {
        mpaprocki.init();
    });

    // $(document).on('scroll', function () {
    //     mpaprocki.scrollEvent();
    // });
    //
    // $(window).on('resize', function () {
    //     mpaprocki.resizeEvent();
    // });

})(jQuery, window, document);
