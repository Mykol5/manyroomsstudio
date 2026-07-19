(function ($) {
	"use strict";

	let themeDirection = $('html').attr('dir');

	////text-slider
	function tp_text_slider() {
		var tp_text_slide = new Swiper(".tp-text-slider-active", {
			loop: true,
			freemode: true,
			slidesPerView: 'auto',
			spaceBetween: 30,
			centeredSlides: true,
			allowTouchMove: false,
			speed: 4000,
			autoplay: {
				delay: 1,
				disableOnInteraction: true,
			},
		});

		var tp_brand_slide = new Swiper(".tp-text-slide-active", {
			loop: true,
			freemode: true,
			slidesPerView: 'auto',
			spaceBetween: 30,
			centeredSlides: true,
			allowTouchMove: false,
			speed: 4000,
			autoplay: {
				delay: 1,
				disableOnInteraction: true,
			},
		});

		////text-slider
		var tp_text_slide = new Swiper(".ai-text-slider-active", {
			loop: true,
			freemode: true,
			slidesPerView: 'auto',
			spaceBetween: 10,
			centeredSlides: true,
			allowTouchMove: false,
			speed: 8000,
			autoplay: {
				delay: 1,
				disableOnInteraction: true,
			},
		});

		var tp_brand_slide = new Swiper(".tp-brand-active", {
			loop: true,
			freemode: true,
			slidesPerView: 'auto',
			spaceBetween: 30,
			centeredSlides: true,
			allowTouchMove: false,
			speed: 12000,
			autoplay: {
				delay: 1,
				disableOnInteraction: true,
			},
		});

	}

	function tp_brands_slider() {
		var tp_brand_slide = new Swiper(".tp-brand-active-2", {
			loop: true,
			freemode: true,
			slidesPerView: 'auto',
			spaceBetween: 30,
			centeredSlides: true,
			allowTouchMove: false,
			speed: 8000,
			autoplay: {
				delay: 1,
				disableOnInteraction: true,
			},
		});
	}

	// tp-port-brand-active, tp-about-brand-active, tp-about-text-active inits moved to:
	//   pixora-core/include/elementor/p-portfolio/portfolio-brand/portfolio-brand-init.js
	//   pixora-core/include/elementor/about-me/about-me-hero/about-me-hero-init.js
	//   pixora-core/include/elementor/about/about-text-slider/about-text-slider-init.js
	// Registered as pixora-el-p-portfolio-portfolio-brand,
	// pixora-el-about-me-about-me-hero, pixora-el-about-about-text-slider.


	////brand-slider
	function tp_ar_brand_slider() {
		var tp_brand_slide = new Swiper(".ar-brand-active", {
			loop: true,
			freemode: true,
			slidesPerView: 'auto',
			spaceBetween: 165,
			centeredSlides: true,
			allowTouchMove: false,
			speed: 2000,
			autoplay: {
				delay: 1,
				disableOnInteraction: true,
			},
		});
	}


	function crp_text_slider_active() {
		////text-slider
		var tp_text_slide = new Swiper(".crp-text-slider-active", {
			loop: true,
			freemode: true,
			slidesPerView: 'auto',
			spaceBetween: 40,
			centeredSlides: true,
			allowTouchMove: false,
			speed: 8000,
			autoplay: {
				delay: 1,
				disableOnInteraction: true,
			},
		});
	}

	///--------project-slider-----------////
	document.addEventListener('DOMContentLoaded', function () {

		document.querySelectorAll('.dgm-project-active').forEach((el) => {

			let projectImg = new Swiper(el, {
				spaceBetween: 40,
				centeredSlides: true,
				loop: true,
				loopedSlides: 3,
				speed: 1500,
				navigation: {
					nextEl: '.dgm-project-next',
					prevEl: '.dgm-project-prev',
				},
				keyboard: {
					enabled: true,
				},
				breakpoints: {
					'1600': {
						slidesPerView: 3,
					},
					'1400': {
						slidesPerView: 3,
					},
					'1200': {
						slidesPerView: 3,
					},
					'992': {
						slidesPerView: 2,
					},
					'768': {
						slidesPerView: 2,
					},
					'576': {
						slidesPerView: 1,
					},
					'0': {
						slidesPerView: 1,
					},
				},
			});

			//dgm-project-text-active
			document.querySelectorAll('.dgm-project-text-active').forEach((el) => {
				let projecttext = new Swiper(el, {
					spaceBetween: 30,
					slidesPerView: 1,
					direction: 'vertical',
					loop: true,
					loopedSlides: 3,
					touchRatio: 0.2,
					slideToClickedSlide: true,
					speed: 1500,
				});
				// Linking the two Swipers together
				projectImg.on("slideChangeTransitionStart", function () {
					projecttext.slideTo(projectImg.activeIndex);
				});
				projecttext.on("transitionStart", function () {
					projectImg.slideTo(projecttext.activeIndex);
				});
			})
		});

	});

	///testimonial-slider
	var projectImg = new Swiper('.parallax-slider-active', {
		spaceBetween: 40,
		centeredSlides: true,
		loop: true,
		loopedSlides: 4,
		speed: 1500,
		navigation: {
			prevEl: '.dgm-project-prev',
			nextEl: '.dgm-project-next',
		},
		keyboard: {
			enabled: true,
		},
		breakpoints: {
			'1600': {
				slidesPerView: 4,
			},
			'1400': {
				slidesPerView: 3,
			},
			'1200': {
				slidesPerView: 3,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});

	function it_project_active() {
		////project-slider
		var project_slider = new Swiper('.it-project-active', {
			slidesPerView: 4,
			loop: true,
			autoplay: false,
			arrow: false,
			spaceBetween: 30,
			speed: 1000,
			breakpoints: {
				'1600': {
					slidesPerView: 4,
				},
				'1400': {
					slidesPerView: 4,
				},
				'1200': {
					slidesPerView: 4,
				},
				'992': {
					slidesPerView: 4,
				},
				'768': {
					slidesPerView: 3,
				},
				'576': {
					slidesPerView: 2,
				},
				'0': {
					slidesPerView: 1,
				},
			},
			navigation: {
				prevEl: '.it-project-prev',
				nextEl: '.it-project-next',
			},
			pagination: {
				el: ".it-project-dots",
				clickable: true,
			},
			a11y: false,
		});
	}

	function tp_testimonial_slider() {

		////testimonial-slider
		var testimonial_2 = new Swiper('.tp-testimonial-slider-active', {
			slidesPerView: 6,
			loop: true,
			autoplay: false,
			arrow: false,
			spaceBetween: 0,
			speed: 1000,
			breakpoints: {
				'1600': {
					slidesPerView: 6,
				},
				'1400': {
					slidesPerView: 5,
				},
				'1200': {
					slidesPerView: 4,
				},
				'992': {
					slidesPerView: 4,
				},
				'768': {
					slidesPerView: 3,
				},
				'576': {
					slidesPerView: 1,
				},
				'0': {
					slidesPerView: 1,
				},
			},
			a11y: false,
		});

	}

	// tp-team-list slider (.tp-team-slider-active) moved to
	// pixora-core/include/elementor/team/team-list/team-list-init.js
	// registered as `pixora-el-team-team-list`.

	// .tp-career-slider-active init moved to
	// pixora-core/include/elementor/career/career-carousel/career-carousel-init.js
	// registered as `pixora-el-career-career-carousel`.
	// .tp-service-4-solution-active init moved to
	// pixora-core/include/elementor/services/services-slider/services-slider-init.js
	// registered as `pixora-el-services-services-slider`.
	// Shared by services-slider AND services-slider-test widgets.

	//----testimonial-slider-------//
	const progressBar = $(".shop-slider-progress-bar");
	var gallery = new Swiper('.ar-testimonial-active', {
		slidesPerView: 1,
		loop: true,
		autoplay: true,
		arrow: false,
		spaceBetween: 0,
		speed: 1000,
		navigation: {
			prevEl: '.ar-testimonial-prev',
			nextEl: '.ar-testimonial-next',
		},
		pagination: {

			el: '#paginations',
			type: 'custom',
			renderCustom: function (swiper, current, total) {
				let zero = total > 9 ? '' : '0';
				let index = zero + current
				let all = zero + total
				let html = `<div class="shop-slider-pagination">
								<span>${index}</span>
								<span>${all}</span>
							</div>`;
				return html;
			}
		}

	});

	//-----instagram-slider------//
	function ai_instagram_active() {
		var dgm_brand_active = new Swiper('.ai-instagram-active', {
			slidesPerView: 6,
			loop: true,
			autoplay: true,
			arrow: false,
			spaceBetween: 0,
			speed: 1000,
			breakpoints: {
				'1600': {
					slidesPerView: 6,
				},
				'1400': {
					slidesPerView: 5,
				},
				'1200': {
					slidesPerView: 4,
				},
				'992': {
					slidesPerView: 4,
				},
				'768': {
					slidesPerView: 3,
				},
				'576': {
					slidesPerView: 2,
				},
				'0': {
					slidesPerView: 1
				},
			},
			a11y: false,

		});
	}

	// .design-hero-slide-active init moved to
	// pixora-core/include/elementor/hero/hero-slider-text/hero-slider-text-init.js
	// registered as `pixora-el-hero-hero-slider-text`.



	// brand-slider Swiper inits (.app-brand-active, .creative-brand-active,
	// .dgm-brand-active, .ai-brand-slider-active) moved to
	// pixora-core/include/elementor/brand/brand-slider/brand-slider-init.js
	// and registered as `pixora-el-brand-brand-slider` (depends on swiper-bundle).

	//------brand-slider-------//
	var tp_text_slide = new Swiper(".st-brand-active", {
		loop: true,
		freemode: true,
		slidesPerView: 4,
		spaceBetween: 0,
		centeredSlides: true,
		allowTouchMove: false,
		speed: 3000,
		autoplay: {
			delay: 1,
			disableOnInteraction: true,
		},
		breakpoints: {
			'1600': {
				slidesPerView: 4,
			},
			'1400': {
				slidesPerView: 4,
			},
			'1200': {
				slidesPerView: 4,
			},
			'992': {
				slidesPerView: 4,
			},
			'768': {
				slidesPerView: 3,
			},
			'576': {
				slidesPerView: 3,
			},
			'0': {
				slidesPerView: 2
			},
		},
	});

	// .studio-step-slider-active init moved to
	// pixora-core/include/elementor/step/step-item/step-item-init.js
	// registered as `pixora-el-step-step-item`.

	// testimonial-list Swiper inits (.dgm-testimonial-active, .creative-testimonial-active,
	// .design-testimonial-active) moved to
	// pixora-core/include/elementor/testimonial/testimonial-list/testimonial-list-init.js
	// and registered as `pixora-el-testimonial-testimonial-list` (depends on swiper-bundle).

	//portfolio-slider
	var showcase = new Swiper('.tp-pd-2-active', {
		slidesPerView: 3,
		loop: true,
		autoplay: false,
		arrow: false,
		spaceBetween: 20,
		speed: 1000,
		pagination: {
			el: ".tp-pd-2-dot",
			clickable: true,
		},
		breakpoints: {
			'1600': {
				slidesPerView: 3,
			},
			'1400': {
				slidesPerView: 3,
			},
			'1200': {
				slidesPerView: 3,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});

	//portfolio-slider
	var showcase = new Swiper('.tp-pd-4-slider-active', {
		slidesPerView: 3,
		loop: true,
		autoplay: false,
		arrow: false,
		spaceBetween: 30,
		speed: 1000,
		breakpoints: {
			'1600': {
				slidesPerView: 3,
			},
			'1400': {
				slidesPerView: 3,
			},
			'1200': {
				slidesPerView: 3,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});

	//portfolio-slider
	var showcase = new Swiper('.tp-pd-5-light-active', {
		slidesPerView: 5,
		loop: true,
		autoplay: true,
		arrow: false,
		spaceBetween: 30,
		speed: 1000,
		breakpoints: {
			'1600': {
				slidesPerView: 5,
			},
			'1400': {
				slidesPerView: 5,
			},
			'1200': {
				slidesPerView: 4,
			},
			'992': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 3,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});


	let lastPercent = 0;

	function updateProgress(current, total) {
		const targetPercent = Math.round((current / (total - 1)) * 100);
		const circle = document.querySelector('.circle');
		const text = document.querySelector('.percentage-text');

		let currentPercent = lastPercent;

		const interval = setInterval(() => {
			if (currentPercent === targetPercent) {
				clearInterval(interval);
			} else {
				currentPercent += (currentPercent < targetPercent) ? 1 : -1;
				circle.setAttribute('stroke-dasharray', `${currentPercent}, 100`);
				text.textContent = `${currentPercent}%`;
			}
		}, 10);

		lastPercent = targetPercent;
	}

	$(document).ready(function () {
		if (typeof $.fn.slick === 'undefined') {
			return;
		}
		$('.tp-pd-6-hero-slider-active').on('init', function (event, slick) {
			$('#total-slides').text(slick.slideCount);
			$('#current-slide').text(slick.currentSlide + 1);
			updateProgress(slick.currentSlide, slick.slideCount);
		}).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
			$('#current-slide').text(nextSlide + 1);
			updateProgress(nextSlide, slick.slideCount);
		}).slick({
			slidesToShow: 2,
			slidesToScroll: 1,
			arrows: false,
			dots: false,
			vertical: true,
			verticalSwiping: true,
			autoplay: false,
			responsive: [
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						vertical: false,
						dots: true,
						verticalSwiping: false,
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						vertical: false,
						dots: true,
						verticalSwiping: false,
					}
				}
			]
		});

		$('.tp-pd-6-hero-slider-active').on('wheel', function (e) {
			e.preventDefault();
			if (e.originalEvent.deltaY < 0) {
				$(this).slick('slickPrev');
			} else {
				$(this).slick('slickNext');
			}
		});
	});


	function it_testimonial_active() {
		//testimonial-slider
		var testi_active = new Swiper('.it-testimonial-active', {
			slidesPerView: 1,
			loop: true,
			arrow: false,
			autoplay: true,
			spaceBetween: 30,
			speed: 1500,
			navigation: {
				nextEl: '.it-testimonial-next',
				prevEl: '.it-testimonial-prev',
			},
		});
	}
	function cr_testimonial_active() {
		//----testimonial-slider------//
		var testi_active = new Swiper('.cr-testimonial-active', {
			slidesPerView: 1,
			loop: true,
			arrow: false,
			autoplay: true,
			spaceBetween: 30,
			speed: 1500,
			navigation: {
				nextEl: '.cr-testimonial-next',
				prevEl: '.cr-testimonial-prev',
			},
		});
	}

	//-----testimonial-slider-------//
	var testi_active = new Swiper('.st-testimonial-active', {
		slidesPerView: 1.7,
		arrow: false,
		loop: true,
		spaceBetween: 30,
		breakpoints: {
			'1200': {
				slidesPerView: 1.7,
			},
			'992': {
				slidesPerView: 1.7,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});

	// .ai-hero-slider-1 / .ai-hero-slider-2 Slick init moved to
	// pixora-core/include/elementor/hero/hero-image-slider/hero-image-slider-init.js
	// registered as `pixora-el-hero-hero-image-slider`.

	// `testi_active` `.on('sliderMove')` / `.on('transitionEnd')` listeners removed.
	// `testi_active` was a function-local `var` inside `tp_testi_slider()`, never
	// reachable from this IIFE scope — these lines threw a silent ReferenceError
	// in strict mode on every page. Behavior unchanged by removal.

	//------postbox-slider-----//
	var postbox_active = new Swiper('.postbox-slider-active', {
		slidesPerView: 1,
		loop: true,
		autoplay: false,
		arrow: false,
		spaceBetween: 0,
		speed: 1000,
		breakpoints: {
			'1400': {
				slidesPerView: 1,
			}
		},
		a11y: false,

		// Navigation arrows
		navigation: {
			prevEl: '.postbox-arrow-prev',
			nextEl: '.postbox-arrow-next',
		},

	});

	//------parallax-slider-----//
	var parallax_slider = new Swiper(".tp-showcase-slider-active", {
		speed: 1500,
		autoplay: {
			delay: 5000,
		},
		parallax: true,
		mousewheel: true,
		loop: true,
		on: {
			init: function () {
				var swiper = this;
				for (var i = 0; i < swiper.slides.length; i++) {
					$(swiper.slides[i])
						.find('.tp-showcase-slider-bg')
						.attr({ 'data-swiper-parallax': 0.75 * swiper.width });
				}
			},
			resize: function () {
				this.update();
			}
		},
		pagination: {
			el: '.tp-showcase-slider-main .swiper-pagination',
			clickable: true,
			renderBullet: function (index, className) {
				return `<span class="${className}">
						<svg class="fp-arc-loader" width="16" height="16" viewBox="0 0 16 16">
							<circle class="path" cx="8" cy="8" r="5.5" fill="none" transform="rotate(-90 8 8)" stroke="#FFF" stroke-opacity="1" stroke-width="1px"></circle> 
							<circle cx="8" cy="8" r="3" fill="#FFF"></circle>
						</svg>
					</span>`;
			},

		},
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		}
	});

	//------coverflow-slider-----//
	document.addEventListener('DOMContentLoaded', function () {
		document.querySelectorAll('.coverflow-slider-main').forEach((el) => {
			var coverflow_thumb_slider = new Swiper('.coverflow-slider-active', {
				loop: true,
				effect: "coverflow",
				autoHeight: true,
				mousewheel: true,
				speed: 1500,
				slidesPerView: 1,
				spaceBetween: 0,
				centeredSlides: true,
				grabCursor: true,
				loopedSlides: 3,
				keyboard: {
					enabled: true,
				},
				autoplay: {
					delay: 1500,
				},
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
				},
				navigation: {
					nextEl: '.coverflow-slider-next',
					prevEl: '.coverflow-slider-prev',
					clickable: true,
				},
				breakpoints: {
					600: {
						slidesPerView: 2,
					},
					991: {
						slidesPerView: 3,
					},
					1400: {
						slidesPerView: 4,
					},
				}
			});
			// // dgm-project-text-active
			document.querySelectorAll('.coverflow-slider-text-active').forEach((el) => {
				let coverflow_text_slider = new Swiper(el, {
					spaceBetween: 30,
					slidesPerView: 1,
					direction: 'vertical',
					loop: true,
					loopedSlides: 3,
					touchRatio: 0.2,
					slideToClickedSlide: true,
					speed: 1500,
				});
				// Linking the two Swipers together
				coverflow_thumb_slider.on("slideChangeTransitionStart", function () {
					coverflow_text_slider.slideTo(coverflow_thumb_slider.activeIndex);
				});
				coverflow_text_slider.on("transitionStart", function () {
					coverflow_thumb_slider.slideTo(coverflow_text_slider.activeIndex);
				});
			})
		});
	});

	//----text-slider------//
	var text_slider_option = document.querySelector(".tp-text-slider-4-active");
	if (text_slider_option) {

		var text_slider_speed = 300000
		var text_slider_autoplay = true
		var loop_value = true
		var data_itemshow = "auto"

		if (text_slider_option.getAttribute("data-sliderSpeed")) {
			text_slider_speed = parseInt(text_slider_option.getAttribute("data-sliderSpeed"));
		}
		if (text_slider_option.getAttribute("data-autoPlay")) {
			text_slider_autoplay = text_slider_option.getAttribute("data-autoPlay")
		}

		if (text_slider_option.getAttribute("data-loop")) {
			loop_value = text_slider_option.getAttribute("data-loop")
		}
		if (text_slider_option.getAttribute("data-itemShow")) {
			data_itemshow = text_slider_option.getAttribute("data-itemShow")
		}
		if (text_slider_autoplay == 'true') {
			var text_slider = new Swiper(".tp-text-slider-4-active", {
				loop: loop_value,
				speed: text_slider_speed,
				allowTouchMove: false,
				slidesPerView: data_itemshow,
				slidesPerGroup: 10,
				spaceBetween: 20,
				autoplay: {
					delay: 0,
					disableOnInteraction: true,
				}
			});
		}
		else {
			var text_slider = new Swiper(".tp-text-slider-4-active", {
				loop: loop_value,
				speed: text_slider_speed,
				allowTouchMove: false,
				slidesPerView: data_itemshow,
				slidesPerGroup: 10,
				spaceBetween: 20,
				autoplay: false,
			});
		}
	};

	function shop_banner_slider() {
		if (typeof $.fn.slick === 'undefined') { return; }
		////  slider-for ////
		$('.slider-for-1').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			fade: true,
			rtl: themeDirection == 'rtl' ? true : false,
			asNavFor: '.slider-nav-1'
		});
		$('.slider-nav-1').slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			vertical: true,
			asNavFor: '.slider-for-1',
			dots: false,
			arrows: false,
			focusOnSelect: true,
			verticalSwiping: true,
			responsive: [
				{
					breakpoint: 1400,
					settings: {
						slidesToShow: 2,
					}
				}
			]
		});

		/////////////////////////////
		// shop slider
		var slider = new Swiper('.tp-hero-shop-2-active', {
			slidesPerView: 1,
			effect: 'fade',
			loop: true,
			// autoplay: {
			// 	delay: 3500,
			// },
			// Navigation arrows
			pagination: {
				el: ".tp-hero-shop-dot",
				clickable: true,
			},
			navigation: {
				prevEl: '.tp-hero-shop-prev',
				nextEl: '.tp-hero-shop-next',
			},
		});
	}

	// text_slide_shop
	function tp_shop_text_slider() {

		var text_slide_shop = new Swiper(".shop-text-slider-active", {
			loop: true,
			speed: 3000,
			freemode: true,
			slidesPerView: 5,
			spaceBetween: 0,
			centeredSlides: true,
			allowTouchMove: false,
			autoplay: {
				delay: 1,
				disableOnInteraction: true,
			},
			breakpoints: {
				'1400': {
					slidesPerView: 5,
				},
				'1200': {
					slidesPerView: 4,
				},
				'992': {
					slidesPerView: 3,
				},
				'768': {
					slidesPerView: 3,
				},
				'576': {
					slidesPerView: 2,
				},
				'380': {
					slidesPerView: 1,
				},
			},
		});
	}

	////portfolio-slider
	if (typeof $.fn.slick !== 'undefined') { $('.tp-portfolio-11-slider-active').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		prevArrow: '<button type="button" class="slick-prev"><i class="fa-light fa-angle-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="fa-light fa-angle-right"></i></button>',
		arrows: true,
		fade: false,
		asNavFor: '.tp-portfolio-11-slider-nav-active',
		fade: true,
		speed: 1000,
		rtl: themeDirection == 'rtl' ? true : false,
	}); }

	var helpers = {
		addZeros: function (n) {
			return (n < 10) ? '0' + n : '' + n;
		}
	};

	function sliderInit() {
		if (typeof $.fn.slick === 'undefined') { return; }
		var $slider = $('.tp-portfolio-11-slider-nav-active');
		$slider.each(function () {
			var $sliderParent = $(this).parent();
			$(this).slick({
				slidesToShow: 4,
				slidesToScroll: 1,
				asNavFor: '.tp-portfolio-11-slider-active',
				arrows: true,
				prevArrow: '<button type="button" class="slick-prev"><i class="fa-light fa-angle-left"></i></button>',
				nextArrow: '<button type="button" class="slick-next"><i class="fa-light fa-angle-right"></i></button>',
				dots: false,
				focusOnSelect: true,
				centerPadding: '0',
				speed: 600,
				rtl: themeDirection == 'rtl' ? true : false,
				responsive: [
					{
						breakpoint: 1600,
						settings: {
							slidesToShow: 3,
						}
					},
					{
						breakpoint: 1400,
						settings: {
							slidesToShow: 2,
						}
					},
					{
						breakpoint: 1200,
						settings: {
							slidesToShow: 2,
						}
					},
					{
						breakpoint: 992,
						settings: {
							arrows: false,
							slidesToShow: 4,
						}
					},
					{
						breakpoint: 768,
						settings: {
							arrows: false,
							slidesToShow: 4,
						}
					},
					{
						breakpoint: 768,
						settings: {
							arrows: false,
							slidesToShow: 4,
						}
					},
					{
						breakpoint: 480,
						settings: {
							arrows: false,
							slidesToShow: 4,
						}
					},
				]
			});

			if ($(this).find('.tp-portfolio-11-slider-nav-item').length > 1) {
				$(this).siblings('.slides-number').show();
			}
			$(this).on('afterChange', function (event, slick, currentSlide) {
				$sliderParent.find('.slides-number .active').html(helpers.addZeros(currentSlide + 1));
			});

		});
	};
	sliderInit();



	// update-js-here

	// 02. tp-brand-slide-active
	var tp_brand_slider = new Swiper(".tp-text-slide-active", {
		loop: true,
		freemode: true,
		slidesPerView: 'auto',
		centeredSlides: true,
		allowTouchMove: false,
		spaceBetween: 80,
		speed: 8000,
		autoplay: {
			delay: 1,
			disableOnInteraction: true,
		},
	});


	// .tp-portfolio-mix-slider (SwiperGL) init moved to
	// pixora-core/include/elementor/px-portfolio/portfolio-slicer/portfolio-slicer-init.js
	// registered as `pixora-el-px-portfolio-portfolio-slicer`.


	// elementor fronted view

	$(window).on("elementor/frontend/init", function () {
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/tp-testimonial-zigzag.default", tp_testimonial_slider
		);
		// tp-career-carousel now self-initializes via per-widget script
		// pixora-el-career-career-carousel (career-carousel-init.js).
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/tp-corporate-text-slider.default", crp_text_slider_active
		);
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/tp-crypto-testimonial-list.default", cr_testimonial_active
		);
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/tp-it-project-slider.default", it_project_active
		);
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/tp-it-testimonial.default", it_testimonial_active
		);
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/tp-text-slider.default", tp_text_slider
		);
		// creative_text-slider also uses .tp-text-slide-active — needs its own hook
		// because its get_name() is tp-creative-text-slider, not tp-text-slider.
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/tp-creative-text-slider.default", tp_text_slider
		);
		// tp-testimonial-list now self-initializes via per-widget script
		// pixora-el-testimonial-testimonial-list (testimonial-list-init.js).
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/tp-shop-hero.default", shop_banner_slider
		);
		// tp-hero-slider-text now self-initializes via per-widget script
		// pixora-el-hero-hero-slider-text (hero-slider-text-init.js).
		// step-item now self-initializes via per-widget script
		// pixora-el-step-step-item (step-item-init.js).
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/tp-architecture-brand-slider.default", tp_ar_brand_slider
		);
		// tp-hero-image-slider now self-initializes via per-widget script
		// pixora-el-hero-hero-image-slider (hero-image-slider-init.js).
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/ai-instagram.default", ai_instagram_active
		);
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/tp-startup-video.default", tp_brands_slider
		);
		// tp-portfolio-slider (p-portfolio/portfolio-brand) now self-initializes via
		// per-widget script pixora-el-p-portfolio-portfolio-brand (portfolio-brand-init.js).
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/tp-shop-text-slider.default", tp_shop_text_slider
		);
		// tp-about-me-hero now self-initializes via pixora-el-about-me-about-me-hero.
		// tp-about-text-slider now self-initializes via pixora-el-about-about-text-slider.
		// tp-team-list now self-initializes via per-widget script
		// pixora-el-team-team-list (team-list-init.js).


	});


})(jQuery);