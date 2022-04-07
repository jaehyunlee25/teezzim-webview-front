/*-------------------------------------------------------------------
	분류순서
	- @Variables	: 전역변수
	- @Init			: 초기실행
	- @Settings		: 기본설정
	- @Utility		: 유틸기능
	- @Layout		: 레이아웃
	- @Components	: 컴포넌트
	- @Content		: 컨텐츠
-------------------------------------------------------------------*/
/*-------------------------------------------------------------------
	@Variables
-------------------------------------------------------------------*/
//Elements
var $window			= null,
	$document		= null,
	$html			= null,
	$body			= null,
	$html_body		= null,
	$wrapper		= null,
	$header			= null,
	$dimmer			= null,
	$activeFocus	= null,
_;

//Devices
var isIOS			= browser.os == 'ios',
	isANDROID		= browser.os == 'android',
	isMOBILE		= browser.mobile == true,
_;

/*--------------------------------------------------------------
	@Init
--------------------------------------------------------------*/
var ui = {
	init: function(){
		this.elements();
		this.waveEffect();
		this.gnb_dropdown.init();
		this.gnb_fulldown.init();
		this.tab.init();
		this.acco.init();
		this.expand.init();
		this.tooltip.init();
		this.drop.init();
		this.sticky.init();
		this.spyScroll.init();
		this.progress.init();
		this.waypoint.init();
	},

	/*---------------------------------------------------------------
		@Settings
	---------------------------------------------------------------*/
	/* 엘리먼트 설정 */
	elements: function(){
		$window		= $(window);
		$document	= $(document);
		$html		= $('html');
		$body		= $('body');
		$html_body	= $('html, body');
		$wrapper	= $('.wrapper');
		$header		= $('.header');
		$dimmer		= $('.dimmer');
		$document.off('focusin.eleEvent click.eleEvent').on('focusin.eleEvent click.eleEvent', function(e){
			$activeFocus = $(e.target);
		})
	},

	/* 디바이스설정 - OS, Version, Browser */
	userAgent: function(){
		var cls = 'dv_';
		var $eleBody = $body;
		$eleBody.addClass(cls + browser.name + ' ' + cls + browser.name + browser.version + ' ' + cls + browser.os + ' ' + cls + browser.os + browser.osVersion);
	},

	/* 윈도우 커스텀이벤트설정 - scrollEnd, resizeEnd */
	customEvent: function(){
		var resizeStartTime, resizeEndTime, scrollStartTime, scrollEndTime;
		$window.off('scroll.customEvent').on('scroll.customEvent', function(){
			clearTimeout(scrollEndTime); scrollEndTime = setTimeout(function(){ $window.trigger('scrollEnd') }, 100);
		});
		$window.off('resize.customEvent').on('resize.customEvent', function(){
			clearTimeout(resizeEndTime); resizeEndTime = setTimeout(function(){ $window.trigger('resizeEnd') }, 100);
		})
	},

	/*---------------------------------------------------------------
		@Utility
	---------------------------------------------------------------*/
	/* 웹접근성 - 초점공통 */
	setFocus: {
		eleTags: 'input:not([tabindex]), button:not([tabindex]), a:not([tabindex]), select:not([tabindex]), textarea:not([tabindex])',
		eleTab0: '[tabindex="0"]',
		eleTab1: '[tabindex="-1"]',
		// 포커스 비활성
		disable: function($eleDisable, module){
			$eleDisable.attr({'aria-hidden':'true'}).addClass('is_disable-'+module+'-ariaHidden');
			$eleDisable.find(this.eleTab1).addClass('is_disable-'+module+'-fixed');
			$eleDisable.find(this.eleTags).attr({'tabindex':'-1'}).addClass('is_disable-'+module+'-tags');
			$eleDisable.find(this.eleTab0).attr({'tabindex':'-1'}).addClass('is_disable-'+module+'-tabindex');
		},
		// 포커스 활성
		enable: function($eleEnable, module){
			$eleEnable.attr({'aria-hidden':'false'}).removeClass('is_disable-'+module+'-ariaHidden');
			$eleEnable.find('.is_disable-'+module+'-tags').removeClass('is_disable-'+module+'-tags').removeAttr('tabindex');
			$eleEnable.find('.is_disable-'+module+'-tabindex').removeClass('is_disable-'+module+'-tabindex').attr({'tabindex':'0'});
			$eleEnable.find('.is_disable-'+module+'-fixed').removeClass('is_disable-'+module+'-fixed');
		},
	},

	/* 웹접근성 - 스와이프 */
	setSwiper: function($container, mode){
		// 반복실행 제어
		$container.find('.nav-button-next, .nav-button-prev, .swiper-button-next, .swiper-button-prev').off('keydown.pub').on('keydown.pub', function(e){
			if (e.keyCode == 13) { e.preventDefault(); e.stopPropagation(); }
		});

		// Vaariables
		if (!$container.hasClass('swiper-container')){ $container = $container.find('.swiper-container').eq(0); }
		var $slideActive = $container.find('> .swiper-wrapper > .swiper-slide-active');
		var $slideActiveNot = $slideActive.siblings();
		var $slideVisible = $container.find('> .swiper-wrapper > .swiper-slide-visible');
		var $slideVisibleNot = $slideVisible.siblings();

		// Reset
		if (typeof(mode) == 'string'){ $container.data('mode', mode) }

		// 활성화된 스와이프 체크
		if ($container.closest('.swiper-slide-active').length || $container.closest('.swiper-slide').length == 0) {
			// 센터모드
			if ($container.data('mode') == 'centered') {
				ui.setFocus.disable($slideActiveNot, 'swiper');
				ui.setFocus.enable($slideActive, 'swiper');
			}
			// Auto모드
			else if ($container.data('mode') == 'auto') {
				ui.setFocus.disable($slideVisibleNot, 'swiper');
				ui.setFocus.enable($slideVisible, 'swiper');
			}
			// 기본
			else {
				ui.setFocus.disable($slideVisibleNot, 'swiper');
				ui.setFocus.enable($slideVisible, 'swiper');
			}
		}
	},

	/* 스크롤설정 */
	setScroll: {
		clsLockAll : 'is-locked-all',
		clsLockIOS : 'is-locked-ios',
		scrTop : null,
		//스크롤 비활성
		disable : function(){
			if (isIOS){
				this.scrTop = $window.scrollTop();
				$html_body.addClass(this.clsLockIOS);
				$wrapper.css({position: 'relative', top: this.scrTop * (-1)});
			} else {
				$html_body.addClass(this.clsLockAll);
			}
		},
		//스크롤 활성화
		enable : function(){
			if (isIOS){
				$html_body.removeClass(this.clsLockIOS);
				$wrapper.removeAttr('style');
				$window.scrollTop(this.scrTop);
			} else {
				$html_body.removeClass(this.clsLockAll);
			}
		},
	},

	/* 배경설정 */
	dimmer: {
		open: function(name){
			$dimmer.addClass('dimmer-'+name+' is-active');
			$dimmer.one('transitionend', function(){
				if (!$(this).hasClass('is-active')){
					ui.setScroll.disable();
				}
			})
		},
		close: function(name){
			$dimmer.removeClass('is-active');
			$dimmer.one('transitionend', function(){
				if (!$(this).hasClass('is-active')){
					$dimmer.removeClass('dimmer-'+name);
					ui.setScroll.enable();
				}
			})
		}
	},

	/*---------------------------------------------------------------
		@Layout
	---------------------------------------------------------------*/
	waveEffect: function(){
		var events = null;
		var ele = '.btn, .btn-ico';
		$document.off('mousedown.waveEffectEvent touchstart.waveEffectEvent').on('mousedown.waveEffectEvent touchstart.waveEffectEvent', ele, function(e) {
			events = 'mousedown';
			var self = $(this),
				wave = '.effect-wave',
				btnWidth = self.outerWidth();
			if (e.type == 'mousedown'){ var x = e.offsetX, y = e.offsetY }
			if (e.type == 'touchstart'){ var x = e.touches[0].pageX - self.offset().left, y = e.touches[0].pageY - self.offset().top }
			if (self.find(wave).length == 0){
				self.prepend('<span class="effect-wave"></span>');
				$(wave).css({'top': y, 'left': x}).stop().animate({width: btnWidth * 3, height: btnWidth * 3 }, 400, function(){
					$(this).addClass('is-complete');
					if (events == 'mouseup'){
						$(this).stop().animate({opacity: '0'}, 200, function() {
							$(this).remove();
						});
					}
				});
			}
		})
		$document.off('mouseup.waveEffectEvent touchend.waveEffectEvent').on('mouseup.waveEffectEvent touchend.waveEffectEvent', ele, function(e) {
			events = 'mouseup';
			var self = $(this),
				wave = '.effect-wave';
			if (self.find(wave).hasClass('is-complete')){
				$(wave).stop().animate({opacity: '0'}, 200, function() {
					$(this).remove();
				})
			}
		})
		$document.off('click.waveEffectEvent focusin.waveEffectEvent').on('click.waveEffectEvent focusin.waveEffectEvent', function(e) {
			if ($(e.target).is(ele) == false && $('.effect-wave').length){
				$('.effect-wave').stop().animate({opacity: '0'}, 200, function() {
					$(this).remove();
				})
			}
		})
	},

	//#Gnb Dropdown
	gnb_dropdown: {
		eleNode1_item: '.gnb-dropdown .node1-item',
		eleNode2_item: '.gnb-dropdown .node2-item',
		init: function(){
			var setTime = null;
			$(this.eleNode1_item).not('.is-entered').on('mouseenter focusin', function(){
				clearTimeout(setTime);
				$(this).addClass('is-active').find('> a').attr({'aria-expanded':'true'});
				$(this).siblings().removeClass('is-active').find('> a').attr({'aria-expanded':'false'});
			}).addClass('is-entered');
			$(this.eleNode1_item).not('.is-leaved').on('mouseleave focusout', function(){
				var $this = $(this);
				setTime = setTimeout(function(){ $this.removeClass('is-active') });
			}).addClass('is-leaved');
		},
		set: function(n1, n2){
			$(this.eleNode1_item).eq(n1).addClass('is-current').siblings().removeClass('is-current');
			$(this.eleNode2_item).eq(n2).addClass('is-current').siblings().removeClass('is-current');
		}
	},

	//#Gnb Fulldown
	gnb_fulldown: {
		eleModule: '.gnb-fulldown',
		eleNode1_item: '.gnb-fulldown .node1-item',
		eleNode2_list: '.gnb-fulldown .node2-list',
		eleNode2_item: '.gnb-fulldown .node2-item',
		init: function(){
			var _this = this, setTimeEnter1 = null; setTimeLeave1 = null; setTimeLeave2 = null;
			// 1Depth
			$(this.eleNode1_item).not('.is-entered').on('mouseenter focusin', function(){
				var $this = $(this);
				clearTimeout(setTimeLeave1); // 포커스가 있으면 타이커 초기화
				setTimeEnter1 = setTimeout(function(){
					$(_this.eleNode1_item).removeClass('is-active');
					$(_this.eleNode1_item).find('> a').attr({'aria-expanded':'true'});
					$(_this.eleModule).addClass('is-active');
					$this.addClass('is-active');
				},100);
			}).addClass('is-entered');
			$(this.eleNode1_item).not('.is-leaved').on('mouseleave focusout', function(){
				clearTimeout(setTimeEnter1);
				setTimeLeave1 = setTimeout(function(){
					$(_this.eleModule).removeClass('is-active');
					$(_this.eleNode1_item).find('> a').attr({'aria-expanded':'false'});
				},100);
			}).addClass('is-leaved');

			// 2Depth
			$(this.eleNode2_list).not('.is-entered').on('mouseenter focusin', function(){
				clearTimeout(setTimeLeave2);
				$(_this.eleNode2_list).removeClass('is-active');
				$(this).addClass('is-active');
			}).addClass('is-entered');
			$(this.eleNode2_list).not('.is-leaved').on('mouseleave focusout', function(){
				var $this = $(this);
				setTimeLeave2 = setTimeout(function(){
					$this.removeClass('is-active');
				},100);
			}).addClass('is-leaved');
		},
		set: function(n1, n2){
			$(this.eleNode1_item).eq(n1).addClass('is-current').siblings().removeClass('is-current');
			$(this.eleNode2_item).eq(n2).addClass('is-current').siblings().removeClass('is-current');
		}
	},

	/* Tab */
	tab: {
		init: function(){
			this.event();
		},
		event: function(){
			var self = this;
			$document.off('click.tabEvent').on('click.tabEvent', '[role=tab]', function(e){
				self.select($(this).attr('aria-controls'));
			});
		},
		select: function(id, callback){
			console.log(id);
			var $eleTabItem = $('[aria-controls="'+id+'"]');
			var $eleTabPanel = $('#'+id);
			if ($eleTabItem.length){ $eleTabItem.addClass('is-selected').attr('aria-selected','true').siblings().removeClass('is-selected').attr('aria-selected','false') }
			if ($eleTabPanel.length){ $eleTabPanel.addClass('is-visible').siblings().removeClass('is-visible') }
			if (callback){ typeof(callback) == 'function' ? callback(): callback; }
		}
	},

	/* Accoodion */
	acco: {
		speed: 200,
		init: function(){
			var self = this;
			self.update();
			self.event();
		},
		update: function(){
			$('.accordion-container').each(function(){
				if ($(this).data('sync') == undefined){ $(this).data({'sync':true}) }
				if ($(this).data('toggle') == undefined){ $(this).data({'toggle':true}) }
			});
		},
		event: function(){
			var self = this;
			$document.off('click.accoEvent').on('click.accoEvent', '.acco-toggle', function(e){
				var id = $(this).attr('aria-controls');
				var isToggle = $(this).hasClass('is-active') && $(this).closest('.accordion-container').data('toggle');
				isToggle ? self.close(id): self.open(id);
			});
		},
		reset: function(id, active, callback){
			var $acco = $('#'+id);
			var $accoItem = $acco.find('>.accordion');
			var $accoBtn = $acco.find('>.accordion>.accordion-head>.acco-toggle');
			var $accoCont = $acco.find('>.accordion>.accordion-body');
			if (active == 'visible'){
				$accoItem.addClass('is-active');
				$accoBtn.addClass('is-active').attr({'aria-expanded':'true'});
				$accoCont.addClass('is-active').attr({'aria-hidden':'false'}).removeAttr('style');
			}
			if (active == 'hidden'){
				$accoItem.removeClass('is-active');
				$accoBtn.removeClass('is-active').attr({'aria-expanded':'false'});
				$accoCont.removeClass('is-active').attr({'aria-hidden':'true'}).removeAttr('style');
			}
			if (callback){ typeof(callback) == 'function' ? callback(): callback; }
		},
		visible:function(id, callback){ //페이지로드시 노출
			var $accoBtn = $('[aria-controls='+id+']');
			var $accoCont = $('#'+id);
			var $accoItem = $accoCont.closest('.acco-item');
			var $accoWrap = $accoCont.closest('.acco');
			var $accoItemSiblings = $accoItem.siblings('.is-active');
			$accoItem.addClass('is-active');
			$accoBtn.addClass('is-active').attr({'aria-expanded':'true'});
			$accoCont.addClass('is-active').attr({'aria-hidden':'false'});
			if (callback){ typeof(callback) == 'function' ? callback(): callback; }
			// Syncroize
			if ($accoWrap.data('sync') && $accoItemSiblings.length){
				$accoItemSiblings.removeClass('is-active');
				$accoItemSiblings.find('.accordion-head>.acco-toggle').removeClass('is-active').attr({'aria-expanded':'false'});
				$accoItemSiblings.find('.accordion-body').removeClass('is-active').attr({'aria-hidden':'true'});
			}
		},
		open: function(id, callback){
			var self = this;
			var $accoBtn = $('[aria-controls='+id+']');
			var $accoCont = $('#'+id);
			var $accoItem = $accoCont.closest('.accordion');
			var $accoWrap = $accoCont.closest('.accordion-container');
			var $accoItemSiblings = $accoItem.siblings('.is-active');
			if (!$accoBtn.is(':disabled')){
				$accoBtn.addClass('is-active').attr({'aria-expanded':'true'});
				$accoItem.addClass('is-active').attr({'aria-hidden':'false'});
				$accoCont.stop().slideDown(self.speed, function(){
					$(this).addClass('is-active');
					if (callback){ typeof(callback) == 'function' ? callback(): callback; }
				});
			}
			// Syncroize
			if ($accoWrap.data('sync') && $accoItemSiblings.length){
				var closeID = $accoItemSiblings.find('>.accordion-body').attr('id');
				self.close(closeID);
			}
		},
		close: function(id, callback){
			console.log(id);
			var self = this;
			var $accoBtn = $('[aria-controls='+id+']');
			var $accoCont = $('#'+id);
			var $accoItem = $accoCont.closest('.accordion');
			$accoBtn.attr({'aria-expanded':'false'}).removeClass('is-active');
			$accoItem.removeClass('is-active');
			$accoCont.stop().slideUp(self.speed, function(){
				$(this).removeClass('is-active');
				if (callback){ typeof(callback) == 'function' ? callback(): callback; }
			});
		},
	},

	/* Expand */
	expand: {
		speed: 200,
		init: function(){
			this.event();
		},
		event: function(){
			var self = this;
			$document.off('click.expandToggle').on('click.expandToggle', '.expand-toggle', function(e){
				if ($(this).data('type') == 'group'){ self.group($(this).attr('aria-controls')) }
				else if ($(this).data('type') == 'items'){ self.items($(this).attr('data-target')) }
			});
		},
		group: function(id){
			var self = this;
			var $btn = $('[aria-controls='+id+']');
			var $cont = $('#'+ id);
			if (!$btn.hasClass('is-expanded')){
				$btn.attr({'aria-expanded':'true'}).addClass('is-expanded');
				$cont.attr({'aria-hidden':'false'}).addClass('is-visible').stop().slideDown(self.speed);
			} else {
				$btn.attr({'aria-expanded':'false'}).removeClass('is-expanded');
				$cont.attr({'aria-hidden':'true'}).removeClass('is-visible').stop().slideUp(self.speed);
			}
		},
		items: function(name){
			var self = this;
			var $btn = $('[data-target='+name+']');
			var $cont = $('[data-name='+name+']');
			if (!$btn.hasClass('is-expanded')){
				$btn.attr({'aria-expanded':'true'}).addClass('is-expanded');
				$cont.attr({'aria-hidden':'false'}).addClass('is-visible');
			} else {
				$btn.attr({'aria-expanded':'false'}).removeClass('is-expanded');
				$cont.attr({'aria-hidden':'true'}).removeClass('is-visible');
			}
		}
	},

	tooltip: {
		init: function(){
			this.event();
		},
		event: function(){
			var self = this;
			$document.off('click.tooltipOpen').on('click.tooltipOpen', 'button.tooltip-opener', function(e){ self.open($(this).attr('aria-controls')) });
			$document.off('click.tooltipClose').on('click.tooltipClose', 'button.tooltip-closer', function(e){ self.close($(this).closest('.tooltip').attr('id')) });
			$document.off('focusin.tooltipDocument click.tooltipDocument').on('focusin.tooltipDocument click.tooltipDocument', function(e){
				$('div.tooltip.is-active').each(function(){
					var id = $(this).attr('id');
					if ($('div.tooltip').has(e.target).length === 0 && !$(e.target).hasClass('tooltip-opener')){
						self.close(id);
					}
				})
			});
		},
		open: function(id, callback){
			var self = this;
			var $eleOpener = $('button[aria-controls='+id+']');
			var $eleTooltip = $('#'+id);
			$('div.tooltip.is-active').each(function(){ self.close($(this).attr('id')) });
			$('#'+id).addClass('is-active');
			$eleOpener.addClass('is-active').attr({'aria-expanded':'true'});
			if (callback){ typeof(callback) == 'function' ? callback(): callback; }
		},
		close: function(id, callback){
			var self = this;
			var $eleOpener = $('button[aria-controls='+id+']');
			var $eleTooltip = $('#'+id);
			$('#'+id).removeClass('is-active');
			$eleOpener.removeClass('is-active').attr({'aria-expanded':'false'});
			if (callback){ typeof(callback) == 'function' ? callback(): callback; }
		},
	},

	/* Drop */
	drop: {
		speed: 100,
		init: function(){
			this.event();
		},
		event: function(){
			var self = this;
			$document.off('click.dropEvent').on('click.dropEvent', 'button.drop-toggle', function(e){
				var id = $(this).attr('aria-controls');
				$(this).hasClass('is-active') ? self.close(id): self.open(id);
			});
			$document.off('focusin.dropEvent2 click.dropEvent2').on('focusin.dropEvent2 click.dropEvent2', function(e){
				$('button.drop-toggle.is-active').each(function(){
					var id = $(this).attr('aria-controls');
					if ($('.drop').has(e.target).length === 0){ self.close(id) }
				})
			});
		},
		open: function(id, callback){
			var self = this;
			var $eleBtn = $('[aria-controls='+id+']');
			var $eleMenu = $('#'+id);
			$('.drop-toggle.is-active').each(function(){ self.close($(this).attr('aria-controls')) });
			$eleBtn.attr({'aria-expanded':'true'}).addClass('is-active');
			$eleMenu.addClass('is-active');
			if (callback){ typeof(callback) == 'function' ? callback(): callback; }
		},
		close: function(id, callback){
			var self = this;
			var $eleBtn = $('[aria-controls='+id+']');
			var $eleMenu = $('#'+id);
			$eleBtn.attr({'aria-expanded':'false'}).removeClass('is-active');
			$eleMenu.removeClass('is-active');
			if (callback){ typeof(callback) == 'function' ? callback(): callback; }
		},
	},

	/* 팝업 */
	popup: {
		open: function(id, focus, callback){
			var self = this;
			var $popWrap = $('#'+id);
			var $focus = $popWrap.find('.popup');
			$popWrap.data('opener', $activeFocus).addClass('is-active');
			$popWrap.addClass('is-active');
			$popWrap.one('transitionend', function(){
				if ($(this).hasClass('is-active')){
					focus != true && $focus.attr('tabindex','0').focus();
					if (callback){ typeof(callback) == 'function' ? callback() : callback; }
				}
			});
			ui.dimmer.open('popup');
			console.log('Popup Opened');
		},
		close: function(id, focus, callback){
			var self = this;
			var $popWrap = $('#'+id);
			var $focus = $popWrap.data('opener');
			$popWrap.removeClass('is-active');
			$popWrap.one('transitionend', function(){
				if (!$(this).hasClass('is-active')){
					$popWrap.removeClass('is-active');
					focus != true && $focus.attr('tabindex','0').focus();
					if (callback){ typeof(callback) == 'function' ? callback() : callback; }
				}
			});
			ui.dimmer.close('popup');
			console.log('Popup Closed');
		},
	},


	/* Sticky Scroll */
	sticky: {
		init: function(){
			var self = this;
			//스티키 데모
			$('.sticky_demo:visible').each(function(){
				var $sticky = $(this);
				$sticky.data({'top': true, 'gap': 0});
				self.update($sticky);
				self.scrolled($sticky, $sticky);
				$window.off('scroll.tabSticky').on('scroll.tabSticky', function(){ self.scrolled($sticky) });
			});
		},
		update: function($sticky){
			if ($sticky.next('div.sticky_height').length == 0){ $sticky.after('<div class="sticky_height" aria-hidden="true" style="height:'+$sticky.outerHeight()+'px"></div>') }
			else { $('.sticky_height').css({height:$sticky.outerHeight()}) }
		},
		scrolled: function($target, $active){
			if ($target.data('top') == true){
				var pos_t = $target.parent().offset().top;
				var gap_t = $('.header').outerHeight() + $target.data('gap');
				var win_t = $window.scrollTop();
				var sum_t = 0 + gap_t;
				if (gap_t > pos_t - win_t){ $active.addClass('is_fixed').css({top:sum_t}) }
				else { $active.removeClass('is_fixed').removeAttr('style'); }
			}
			if ($target.data('bottom') == true){
				var pos_b = $target.outerHeight() + $target;
				var win_b = $window.outerHeight() + $window.scrollTop();
				var gap_b = 0;
				var sum_b = 0 + gap_b;
				if (win_b < pos_b){ $active.addClass('is_fixed') }
				else { $active.removeClass('is_fixed') }
			}
		},
	},

	/* Spy Scroll */
	spyScroll: {
		init: function(){
			this.event();
		},
		event: function(){
			var self = this;
			$document.off('click.spyscrollEvent').on('click.spyscrollEvent', '.js-spyscroll', function(e){
				self.action($(this).data('id'), $(this).data('scroller'), $(this).data('gap'));
			});
		},
		action: function(id, scroller, gap){
			var isBody = scroller == 'body',
				ele_t = $('#'+id).offset().top,
				gap_t = $header.outerHeight() + parseInt(gap),
				sum_t = null;
			if (isBody){
				//최종위치 = 대상요소TOP - 공백
				sum_t = ele_t - gap_t;
			} else {
				//최종위치 = 대상요소TOP - 공백 - 스크롤요소TOP + 스크롤TOP
				sum_t = ele_t - gap_t - $(scroller).offset().top + $(scroller).scrollTop();
			}
		},
	},

	/* Swiper */
	swipes: {
		init: function(){
			this.tab();
		},
		validate: function($container, title, options, func){
			var $swiper = $container.parent();
			var $navDisabled = $swiper.children('.swiper-button-disabled');
			if (title == undefined){ title = '' }
			var defaultOptions = {
				watchSlidesVisibility: true,
				a11y: {
					prevSlideMessage: title+ ' 이전 슬라이드',
					nextSlideMessage: title+ ' 다음 슬라이드',
					firstSlideMessage: title+ ' 첫번째 슬라이드',
					lastSlideMessage: title+ ' 마지막 슬라이드',
				},
				on: {
					init: function(){
						ui.setSwiper($container, 'swiper');
					},
					slideChangeTransitionStart: function(){
						ui.setSwiper($container, 'swiper');
					}
				}
			}
			$.extend(defaultOptions, options); // 기본옵션 머지하기
			//몇개부터 스와이프 설정할지 체크
			if ($container.find('>.swiper-wrapper>.swiper-slide:visible').length > 1){ // 보이는 슬라이드가 1개 초과일때
				func(defaultOptions); // 스와이프 호출(옵션보내기)
				$swiper.removeClass('no-swiper').addClass('is-swiper'); // 스와이프 적용클래스
				if (defaultOptions.autoplay != undefined && defaultOptions.autoplay != false){ $swiper.addClass('is-started').removeClass('is-stoped') } // 자동재생인 경우 재생상태 적용
				if ($navDisabled.length == 2){ $navDisabled.addClass('dis-n') } // 양쪽 disabled 인경우 숨김
				else if ($navDisabled.length){ $navDisabled.removeClass('dis-n') } // 한쪽 disabled 인경우 초기화
			} else {
				$swiper.removeClass('is-swiper').addClass('no-swiper');
			}
		},
		object: function(){
			var title = '제목';
			var $swiper = $('선택자');
			var $container = $swiper.find('>.swiper-container');
			var options = {
				navigation: {
					nextEl: $swiper.children('.swiper-button-next'), //다음 슬라이드
					prevEl: $swiper.children('.swiper-button-prev'), //이번 슬라이드
				},
				pagination: {
					el: $swiper.children('.swiper-pagination'),
					type: 'bullets',
					renderBullet: function (index, className) {
						return '<span class="' + className + '">' + (index + 1) + '번 슬라이드</span>';
					}
				},
			}
			var func = function(options){
				tabSwiper = new Swiper($container, options);
			}
			ui.swipes.validate($container, title, options, func);
		}
	},

	/*
		## Progress
		기능정의: 설명
		참고사항: 설명
		참고메뉴: 대메뉴 > 중메뉴 > 소메뉴 > 화면명
		참고경로: /html/menu1/page.html
		(공통여부와 관계없이 확인이 가능한 대표화면 적용)
	*/
	progress: {
		init: function(){
			this.event();
		},
		event: function(){
			this.action();
		},
		action: function(){
			console.log('Progress Action');
		},
	},

	/*
		## Waypoint
		기능정의: 설명
		참고사항: 설명
		참고메뉴: 대메뉴 > 중메뉴 > 소메뉴 > 화면명
		참고경로: /html/menu1/page.html
		(공통여부와 관계없이 확인이 가능한 대표화면 적용)
	*/
	waypoint: {
		init: function(){
			this.event();
		},
		event: function(){
			this.action();
		},
		action: function(){
			console.log('Waypoint Action');
		},
	},
}

/*--------------------------------------------------------------
	## Init - 초기실행
--------------------------------------------------------------*/
$(document).ready(function(){
	ui.init();  // 개발에서 하나만 호출하도록
});