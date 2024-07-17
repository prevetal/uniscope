document.addEventListener('DOMContentLoaded', function () {
	// Phone input mask
	const phoneInputs = document.querySelectorAll('input[type=tel]'),
		iti_el = $('.iti.iti--allow-dropdown.iti--separate-dial-code')

	Array.from(phoneInputs).forEach(input => {
		if(input.classList.value.includes('b24-form-control')) return

		const iti = intlTelInput(input, {
			customPlaceholder: function (selectedCountryPlaceholder, selectedCountryData) {
				if (selectedCountryData.iso2 === 'ru') {
					return '+7 (926) 708-31-35'
				}

				return selectedCountryPlaceholder
			},
			initialCountry: "ru",
			autoPlaceholder: "aggressive",
			countrySearch: false,
			utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@20.0.5/build/js/utils.js'
		})

		// watchRussianNumberInput(iti, input)
	})


	// Focus when clicking on the field name
	const formLabels = document.querySelectorAll('form .label')

	if (formLabels) {
		formLabels.forEach(el => {
			el.addEventListener('click', e => {
				e.preventDefault()

				el.closest('.line').querySelector('.input, textarea').focus()
			})
		})
	}


	// Accordion
	$('body').on('click', '.accordion .accordion_item .head', function(e) {
		e.preventDefault()

		let item = $(this).closest('.accordion_item'),
			accordion = $(this).closest('.accordion')

		if (item.hasClass('active')) {
			item.removeClass('active').find('.data').slideUp(300)
		} else {
			accordion.find('.accordion_item').removeClass('active')
			accordion.find('.data').slideUp(300)

			item.addClass('active').find('.data').slideDown(300)
		}
	})


	// Fancybox
	Fancybox.defaults.autoFocus = false
	Fancybox.defaults.trapFocus = false
	Fancybox.defaults.dragToClose = false
	Fancybox.defaults.placeFocusBack = false
	Fancybox.defaults.l10n = {
		CLOSE: 'Закрыть',
		NEXT: 'Следующий',
		PREV: 'Предыдущий',
		MODAL: 'Вы можете закрыть это модальное окно нажав клавишу ESC'
	}

	Fancybox.defaults.tpl = {
		closeButton: '<button data-fancybox-close class="f-button is-close-btn" title="{{CLOSE}}"><svg><use xlink:href="images/sprite.svg#ic_close"></use></svg></button>',

		main: `<div class="fancybox__container" role="dialog" aria-modal="true" aria-label="{{MODAL}}" tabindex="-1">
			<div class="fancybox__backdrop"></div>
			<div class="fancybox__carousel"></div>
			<div class="fancybox__footer"></div>
		</div>`,
	}


	// Modals
	$('.modal_btn').click(function(e) {
		e.preventDefault()

		Fancybox.close()

		Fancybox.show([{
			src: document.getElementById(e.target.getAttribute('data-modal')),
			type: 'inline'
		}])
	})


	// Sending form
	$('form').submit(function(e) {
		e.preventDefault()

		Fancybox.close()

		Fancybox.show([{
			src: '#success_modal',
			type: 'inline'
		}])
	})


	// Quike buy/sell - select method
	$('.quike_buy_sell .from .methods .btn').click(function(e) {
		e.preventDefault()

		let parent = $(this).closest('.methods'),
			info = $(this).data('info')

		parent.find('.btn').removeClass('active')
		$(this).addClass('active')

		parent.parent().find('.method_info').hide()
		parent.parent().find(info).fadeIn(200)

		if ($(this).hasClass('coin_btn')) {
			$('.quike_buy_sell .to .methods .btn').removeClass('disabled')
			$('.quike_buy_sell .to .methods .coin_btn').addClass('disabled')

			if ($('.quike_buy_sell .to .method1_info').is(':visible')) {
				$('.quike_buy_sell .to .methods .btn').removeClass('active')
				$('.quike_buy_sell .to .methods .bank_btn').addClass('active')

				$('.quike_buy_sell .to .method_info').hide()
				$('.quike_buy_sell .to .method2_info').fadeIn(200)
			}
		}

		if ($(this).hasClass('bank_btn') || $(this).hasClass('cash_btn')) {
			$('.quike_buy_sell .to .methods .btn').addClass('disabled')
			$('.quike_buy_sell .to .methods .coin_btn').removeClass('disabled')

			$('.quike_buy_sell .to .methods .btn').removeClass('active')
			$('.quike_buy_sell .to .methods .coin_btn').addClass('active')

			$('.quike_buy_sell .to .method_info').hide()
			$('.quike_buy_sell .to .method1_info').fadeIn(200)
		}
	})

	$('.quike_buy_sell .to .methods .btn').click(function(e) {
		e.preventDefault()

		let parent = $(this).closest('.methods'),
			info = $(this).data('info')

		parent.find('.btn').removeClass('active')
		$(this).addClass('active')

		parent.parent().find('.method_info').hide()
		parent.parent().find(info).fadeIn(200)
	})


	// Quike buy/sell - spoler cities
	$('.quike_buy_sell .from .mini_modal .country .name, .quike_buy_sell .to .mini_modal .country .name').click(function(e) {
		e.preventDefault()

		let parent = $(this).closest('.mini_modal')

		if ($(this).hasClass('active')) {
			$(this).removeClass('active').next().slideUp(300)
		} else {
			parent.find('.country .name').removeClass('active')
			parent.find('.country .sub').slideUp(300)

			$(this).addClass('active').next().slideDown(300)
		}
	})


	// Quike buy/sell - select currency
	$('.quike_buy_sell .from .mini_modal .btn, .quike_buy_sell .to .mini_modal .btn').click(function(e) {
		e.preventDefault()

		let parent = $(this).closest('.modal_cont')

		parent.find('.mini_modal_btn > div').html($(this).html())

		$('.mini_modal, .mini_modal_btn').removeClass('active')

		if (is_touch_device()) $('body').css('cursor', 'default')
	})


	// Mini popups
	$('.mini_modal_btn').click(function(e) {
		e.preventDefault()

		const modalId = $(this).data('modal-id')

		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
			$('.mini_modal').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		} else {
			$('.mini_modal_btn').removeClass('active')
			$(this).addClass('active')

			$('.mini_modal').removeClass('active')
			$(modalId).addClass('active')

			if (is_touch_device()) $('body').css('cursor', 'pointer')
		}
	})

	// Close the popup when clicking outside of it
	$(document).click(e => {
		if ($(e.target).closest('.modal_cont').length === 0) {
			$('.mini_modal, .mini_modal_btn').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		}
	})


	// Animation
	let boxes = document.querySelectorAll('.animate')

	function scrollTracking(entries) {
		for (const entry of entries) {
			if (entry.intersectionRatio >= 0.1 && !entry.target.classList.contains('animated')) {
				entry.target.classList.add('animated')
			}
		}
	}

	let observer = new IntersectionObserver(scrollTracking, {
		rootMargin: '-17% 0% -17% 0%',
		threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
	})

	boxes.forEach(element => observer.observe(element))
})