jQuery.noConflict();

(function($, window, document) {
    'use strict';

    window.wdstudio = {
        init: function() {
            this.screenModeEvent();
            this.slider();
			this.fixHeader();
			this.pageInit();
        },

        pageInit: function() {
			$('.preloader').hide('fade', 500);
        },

        getScreenMode: function() {
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
			}

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
            loader.animate({
                width: '66.666%'
            }, 5000)

            next.click(function() {
                sliderRight.slick('slickNext');
            });

            sliderRight.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
				changeContent(nextSlide);
				loader.stop().css('width', 0);
            });

            sliderRight.on('afterChange', function(event, slick, currentSlide) {
                loader.animate({
                    width: '66.666%'
                }, 5000);
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
