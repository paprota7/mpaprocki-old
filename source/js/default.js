jQuery.noConflict();

(function ($, window, document) {
  'use strict';

  // Global mini scripts
  // ==================================

  window.mpaprocki = {
    init: function () {
      this.screenModeEvent();
      this.slider();
      this.popup();
      this.fixHeader();
      this.mobileMenu();
      this.anchors();
      this.scrollTop();
      this.inputFocus();
      this.formValidate();
      this.pageInit();
    },

    pageInit: function () {
      $('.preloader').hide('fade', 500);
    },

    getScreenMode: function () {
      return window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace('"', '').replace('"', '');
    },

    popup: function () {
      $('[data-popup="true"]').popup({
        showAnimation: 'slideInDown',
        hideAnimation: 'slideOutUp'
      });
    },

    screenModeEvent: function () {
      var mode = mpaprocki.getScreenMode();

      $(window).resize(function () {
        if (mode !== mpaprocki.getScreenMode()) {
          mode = mpaprocki.getScreenMode();
          $(document).trigger('changeScreenMode', String(mode));
        }
      });
    },

    toggleMobileMenu: function () {
      if (mpaprocki.getScreenMode() === 'mobile' || mpaprocki.getScreenMode() === 'tablet') {
        if ($('.navigation').hasClass('toggled')) {
          $('.header__toggle').removeClass('close');
          $('.socials').hide('drop', {
            direction: 'down'
          }, 200, function () {
            $('.navigation').hide('slide', {
              direction: 'up'
            }, 300, function () {
              $('.header__toggle, .navigation').removeAttr('style').removeClass('toggled');
            });
            $('body').removeAttr('style');
            mpaprocki.changeHeader()
          });
        } else {
          $('.header__toggle').addClass('close');
          $('.header').addClass('header--fixed');
          $('body').css('overflow', 'hidden');
          $('.navigation').css('top', $('.header').outerHeight(true)).show('slide', {
            direction: 'up'
          }, 300, function () {
            $('.socials').show('drop', {
              direction: 'down'
            }, 200);
          }).addClass('toggled');
        }
      }
    },

    changeHeader: function () {
      var header = $('.header'),
        headerHeight = header.outerHeight(true),
        headerOffset = header.offset().top;

      if ($(window).scrollTop() >= headerOffset) {
        $('.header').addClass('header--fixed');
        $('body').css('padding-top', headerHeight);
      } else {
        $('.header').removeClass('header--fixed');
        $('body').css('padding-top', 0);
      }
    },

    mobileMenu: function () {
      mpaprocki.changeHeader();

      $('.header__toggle').click(function (e) {
        e.preventDefault();
        mpaprocki.toggleMobileMenu();
      });
    },

    anchors: function () {
      $('.anchor-link[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          if (target.length) {
            mpaprocki.toggleMobileMenu();
            $('html, body').animate({
              scrollTop: target.offset().top - 80
            }, 1000);
            return false;
          }
        }
      });
    },

    scrollTop: function () {
      var scrollButton = $('.scroll-top'),
        scrollStatus = false;

      function setScroll() {
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

      function footerPush() {
        var offset = $(window).scrollTop() + $(window).height(),
          target = $(document).height() - $('.footer').outerHeight(true);

        if (offset >= target) {
          scrollButton.css('margin-bottom', offset - target);
        } else {
          scrollButton.css('margin-bottom', '');
        }
      }

      setScroll();
      footerPush();

      $(window).scroll(function () {
        setScroll();
        footerPush();
      });

      scrollButton.click(function () {
        $('html, body').animate({
          scrollTop: 0
        }, 500);
      });
    },

    fixHeader: function () {
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

      $(window).scroll(function () {
        changeHeader();
      });
    },

    slider: function () {
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

        content.hide('fade', 200, function () {
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

      next.click(function () {
        sliderRight.slick('slickNext');
      });

      sliderRight.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        changeContent(nextSlide);
        loader.stop().css('width', 0);
      });

      sliderRight.on('afterChange', function (event, slick, currentSlide) {
        startLoader();
      });
    },

    inputFocus: function () {
      $('.form__input, .form__textarea').on('focusin', function () {
        $(this).closest('.form__box').removeClass('form__box--filled').addClass('form__box--focus');
      });

      $('.form__input, .form__textarea').on('blur', function () {
        if ($(this).val().length) {
          $(this).closest('.form__box').addClass('form__box--filled');
        }
        $(this).closest('.form__box').removeClass('form__box--focus');
      });
    },

    recaptcha: function () {
      var verifyCallback = function () {
        $('.form__captcha').trigger('validate');
      };

      grecaptcha.render('recaptcha', {
        'sitekey': '6LfTjCAUAAAAADYmOull6FUuLwGTe1EbGUj0ZTSv',
        'callback': verifyCallback
      });
    },

    markError: function (elem, test) {
      if (test) {
        $(elem).closest('.form__box').removeClass('error');
        $(elem).removeClass('error');
        if ($(elem).prop('id')) $('label[for="' + $(elem).prop('id') + '"]').removeClass('error');
        if ($(elem).is('select.selectBox')) $(elem).nextAll('.selectBox:not(select)').first().removeClass('error');
      } else {
        $(elem).closest('.form__box').addClass('error');
        $(elem).addClass('error');
        if ($(elem).prop('id')) $('label[for="' + $(elem).prop('id') + '"]').addClass('error');
        if ($(elem).is('select.selectBox')) $(elem).nextAll('.selectBox:not(select)').first().addClass('error');
      }
    },

    formValidate: function () {
      var emailRegex = /^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,4}$/i,
        _this = this;

      $('.form--validate').each(function (i, form) {
        $('.form__input--required, .form__textarea--required', form).on('validate', function () {
          _this.markError(this, $(this).val().length);
        });

        $('form__select--required', form).on('validate', function () {
          _this.markError(this, $(this).val() != '-1');
        });

        $('.form__input--required[type="email"]', form).off('validate').on('validate', function () {
          _this.markError(this, emailRegex.test($(this).val()));
        });

        $('.form__input--required[data-confirm]', form).off('validate').on('validate', function () {
          target = $($(this).attr('data-confirm'));
          _this.markError(this, target.length && $(this).val().length && $(this).val() == target.val());
        });

        $('.form__checkbox--required, .form__radio--required', form).off('validate').on('validate', function () {
          _this.markError(this, $(this).prop('checked'));
        });

        $('.form__captcha--required', form).off('validate').on('validate', function () {
          _this.markError(this, grecaptcha.getResponse().length);
        });

        $('input, textarea, select', form).on('change blur', function () {
          if ($(this).is('[type=radio]') && $(this).prop('name')) {
            $('input[name="' + $(this).prop('name') + '"]', form).trigger('validate');
          } else {
            $(this).trigger('validate');
          }
        });

        $(form).on('submit', function (e) {
          e.preventDefault();
          $('input, select, textarea, .form__captcha', this).trigger('validate');
          if (!$('.error', this).length) {
            $('.button, .form__captcha', this).slideUp(300);
            setTimeout(function () {
              $('.form__response').fadeIn(300);
            }, 301)
          }
        });

        /*ajax submit (or other action)*/
        // $(form).on('submit', function(e) {
        //     e.preventDefault();
        //     $('input, select, textarea', this).trigger('validate');
        //     if (!$('.error', this).length) {
        //         var url = '../mail.php';
        //         $.ajax({
        //             type: 'POST',
        //             url: url,
        //             data: $('form').serialize(),
        //             success: function() {
        //                 $('form input[type="submit"]').fadeOut(300);
        //                 setTimeout(function() {
        //                     $('form .response').fadeIn(300);
        //                 }, 301);
        //             },
        //             error: function() {
        //                 alert('some error');
        //             }
        //         });
        //
        //         return false;
        //     }
        // });

      });
    }
  };

  window.onloadCallback = function () {
    mpaprocki.recaptcha();
  };

  // Execute global scripts
  // ===============================
  $(document).ready(function () {
    mpaprocki.init();
  });


  // Own Plugins
  // ===============================

  $.fn.extend({
    animateCss: function (animationName, afterFunction) {
      var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      this.addClass('animated ' + animationName).one(animationEnd, function () {
        $(this).removeClass('animated ' + animationName);
        if (afterFunction) {
          afterFunction();
        }
      });
    }
  });

  $.fn.popup = function (options) {

    var settings = $.extend({
      showAnimation: 'fadeInDownBig',
      hideAnimation: 'fadeOutUpBig'
    }, options);

    function hidePopup(element) {
      $('body').removeAttr('style');
      element.animateCss(settings.hideAnimation, function () {
        element.removeClass('active');
      });
    }

    function showPopup(element) {
      element.animateCss(settings.showAnimation, function () {
        $('body').css('overflow', 'hidden');
      });
      element.addClass('active');
    }

    $(this).each(function () {
      var click = $(this),
        target = $($(this).data('popup-target'));

      target.wrapInner('<div class="popup__wrapper"></div>');
      target.find('.popup__wrapper').prepend('<a href="#close-popup" class="popup__close">Close</a>');

      var close = target.find('.popup__close');


      click.add(close).on('click', function (e) {
        e.preventDefault();
        if (target.hasClass('active')) {
          hidePopup(target);
        } else {
          showPopup(target);
        }
      });
    });

    $(document).on('keyup', function (evt) {
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
