/*--------------------------------------------------------------
	@Util - 유틸리티
--------------------------------------------------------------*/
var transitionend = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';

//콘솔뷰
var consoleLog = function(value){
	var delay = 3000;
	var setTime = null;
	var consoleHTML = '<div class="consoleLog"><div class="consoleLog-scroll"></div></div>';
	if ($('.consoleLog').length == 0){$('body').append(consoleHTML)}
	$('.consoleLog-scroll').append('<span class="consoleLog-item">'+value+'</span>');
	clearTimeout(setTime);
	setTime = setTimeout(function(){$('.consoleLog').fadeOut('fast', function(){$(this).remove()})}, delay);
}
// 스크립트파일 로드
var setScriptLoader = function(url, id, callback){
	if ($('#'+id).length == 0){
		$('head').append('<script src="'+url+'" id="'+id+'"></script>');
		if (callback){callback()}
	}
}
// Attribute 설정
var setAnchorAttr = function($this){
	$this.each(function(){
		if ($($(this).attr('href')).length && !$(this).is('[data-id]')){$(this).attr('data-id', $(this).attr('href'))}
		else if ($($(this).attr('data-id')).length > 0 && $(this).is('a')){$(this).attr('href', $(this).attr('data-id'))}
	})
}
// 실제값의 퍼센트 구하기 (실제값/최대값 * 100%)
var getPercent = function(val, max){
	var value = (val/max) * 100;
	return value;
}
// 퍼센트로 실제값 구하기 (퍼센트/100% * 최대값)
var getValue = function(val, max){
	var value = (val/100) * max;
	return value;
}
// 퍼센트 제외값 구하기 (최대값 - (퍼센트/100% * 최대값)
var getRemain = function(val, max){
	var value = max - ((val/100) * max);
	return value;
}
// 정규식 반환
var getRegExec = function(reg, str){
	return reg.exec(str);
}
// 정규식 확인
var getRegTest = function(reg, str){
	return regex.test(str);
}
// 숫자 반올림
var getNumRound = function(val, lens){
	return Math.round(val/lens) * lens;
}
// 숫자 올림
var getNumCeil = function(val, lens){
	return Math.ceil(val/lens) * lens;
}
// 숫자 내림
var getNumFloor = function(val, lens){
	return Math.floor(val/lens) * lens;
}
// 숫자 콤마변환
var getNumComma = function(val){
	return val.toLocaleString();
}
// 숫자 콤마삭제
var getNumCommaDel = function(val){
	var num = parseFloat(val.replace(/,/gi,""));
	if (isNaN(num)){return 0} else {return num}
}
// 소수점 변환
var getNumDecimal = function(val){
	return getRegTest('^[+-]?\d*(\.?\d*)$', val);
}
// 파라미터값 구하기
var getParamiter = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results==null){
		return null;
	} else {
		return results[1] || 0;
	}
}
// Ajax 로드
var callAjaxLoad = function(selector, frmName, callUrl, callback){
	var dataString = $("#"+frmName).serialize();
	$(selector).load(callUrl, dataString, callback);
}
// Ajax 실행
var callAjax = function(target, frmName, sendUrl, callback) {
	var dataString = $("#"+frmName).serialize();
	$.ajax({
		type:"POST",
		url:sendUrl,
		cache:false,
		async:false,
		dataType:"html",
		data:dataString,
		timeout:6000,
		success:function(data){
		// 통신이 성공적으로 이루어졌을때 이 함수를 타게 된다.
		$("#"+target).html(data);
			if (callback !==""){
				callback;
			}
		},
		/*complete:function(data){
		// 통신이 실패했어도 완료가 되었을때 이함수를 타게된다.
		// success 와 complete 둘 중 하나만 이용, 그렇지 않으면 두번실행
		},*/
		error:function(xhr, status, error){
		}
	});
}
// Document Target Length
var callThisTarget = function($this, callback){
	$(document).on('click focusin', function(e){
		if ($this.has(e.target).length == 0){
			if (callback){ callback() }
		}
	});
}
// Document Target Selector
var callChildTarget = function($this, callback){
	$(document).on('click focusin', function(e){
		if ($(e.target).is($this) == false){
			if (callback){ callback() }
		}
	})
}
//input - 추가
function dataAttachAdd(obj, str){
	var $group = $(obj).closest('.form-controls.type-data'),
		idx = $group.find('.data').length,
		id = str+idx,
		html = ''
				+'<div class="row">'
				+'	<span class="check type1">'
				+'		<input type="checkbox" name="sCheck11" id="sCheck11" value="">'
				+'		<label for="sCheck11"><span class="blind"></span></label>'
				+'	</span>'			
				+'	<span class="data">'
				+'		<input type="text" id="sDataName'+idx+'" class="input type1 h25" />'
				+'		<button type="button" class="btn type4 type-add" onclick="dataAttachAdd(this, \'sDataAdd2\')"><span>추가</span></button>'
				+'		<button type="button" class="btn type4 type-remove" onclick="dataAttachRemove(this)"><span>삭제</span></button>'
				+'	</span>'
				+'</div>'

		$group.append(html);
}

// input - 삭제
function dataAttachRemove(obj){
	var $row = $(obj).closest('.row');
	if ($row.siblings().length){
		$(obj).closest('.row').remove();
	}
}


//input - 추가2
function dataAttachAdd(obj, str){
	var $group = $(obj).closest('.form-controls.type-data2'),
		idx = $group.find('.data').length,
		id = str+idx,
		html = ''
				+'<div class="row">'		
				+'	<span class="data">'
				+'		<input type="text" id="sDataName'+idx+'" placeholder="이름" class="input type1 h25" />'				
				+'		<input type="text" id="sDataName'+idx+'" placeholder="휴대폰번호" class="input type1 h25" />'
				+'		<button type="button" class="btn type4 type-add" onclick="dataAttachAdd(this, \'sDataAdd2\')"><span>추가</span></button>'
				+'		<button type="button" class="btn type4 type-remove" onclick="dataAttachRemove(this)"><span>삭제</span></button>'
				+'	</span>'
				+'</div>'

		$group.append(html);
}

// input - 삭제2
function dataAttachRemove(obj){
	var $row = $(obj).closest('.row');
	if ($row.siblings().length){
		$(obj).closest('.row').remove();
	}
}


//input - 추가3
function dataAttachAdd(obj, str){
	var $group = $(obj).closest('.form-controls.type-data3'),
		idx = $group.find('.data').length,
		id = str+idx,
		html = ''
				+'<div class="row">'		
				+'	<span class="data">'
				+'		<input type="text" id="sDataName'+idx+'" placeholder="" class="input type1 h25" />'	
				+'		<button type="button" class="btn type4 type-add" onclick="dataAttachAdd(this, \'sDataAdd2\')"><span>추가</span></button>'
				+'		<button type="button" class="btn type4 type-remove" onclick="dataAttachRemove(this)"><span>삭제</span></button>'
				+'	</span>'
				+'</div>'

		$group.append(html);
}

// input - 삭제3
function dataAttachRemove(obj){
	var $row = $(obj).closest('.row');
	if ($row.siblings().length){
		$(obj).closest('.row').remove();
	}
}


// 파일첨부 - 추가
function fileAttachAdd(obj, str){
	var $group = $(obj).closest('.form-controls.type-file'),
		idx = $group.find('.file').length,
		id = str+idx,
		html = ''
				+'<div class="row">'
				+'	<span class="file">'
				+'		<input type="text" id="sFileName'+idx+'" class="input type1 h25" title="첨부된 파일명" />'
				+'		<label for="'+id+'" class="btn type4 btn_file" role="button">'
				+'			<span><input type="file" name="'+id+'" id="'+id+'" value="찾아보기" tabindex="-1" aria-hidden="true" onchange="fileAttachSrc(this, event)" />첨부</span>'
				+'		</label>'
				+'		<button type="button" class="btn type4 type-add" onclick="fileAttachAdd(this, \'sFilesAdd2\')"><span>추가</span></button>'
				+'		<button type="button" class="btn type4 type-remove" onclick="fileAttachRemove(this)"><span>삭제</span></button>'
				+'	</span>'
				+'</div>'

		$group.append(html);
}

// 파일첨부 - 삭제
function fileAttachRemove(obj){
	var $row = $(obj).closest('.row');
	if ($row.siblings().length){
		$(obj).closest('.row').remove();
	}
}

//파일첨부 - 추가2
function fileAttachAdd(obj, str){
	var $group = $(obj).closest('.form-controls.type-file2'),
		idx = $group.find('.file').length,
		id = str+idx,
		html = ''
				+'<div class="row">'
				+'	<span id="sFilePreview31" class="file-preview">'
				+'	</span>'				
				+'	<span class="file">'
				+'		<input type="text" id="sFileName'+idx+'" class="input type1 h25" title="첨부된 파일명" />'
				+'		<label for="'+id+'" class="btn type4 btn_file" role="button">'
				+'			<span><input type="file" name="'+id+'" id="'+id+'" value="찾아보기" tabindex="-1" aria-hidden="true" onchange="fileAttachSrc(this, event); fileAttachPreview(sFilePreview31, event)" />첨부</span>'
				+'		</label>'
				+'		<button type="button" class="btn type4 type-add" onclick="fileAttachAdd(this, \'sFilesAdd2\')"><span>추가</span></button>'
				+'		<button type="button" class="btn type4 type-remove" onclick="fileAttachRemove(this)"><span>삭제</span></button>'
				+'	</span>'
				+'</div>'

		$group.append(html);
}

// 파일첨부 - 삭제2
function fileAttachRemove(obj){
	var $row = $(obj).closest('.row');
	if ($row.siblings().length){
		$(obj).closest('.row').remove();
	}
}

function fileAttachSrc(obj, e){
	var $eleFormText = $(obj).closest('.file').find('input[type=text]');
	if ($eleFormText){
		var fileValue = $(obj).val().split("\\");
		var fileName = fileValue[fileValue.length-1];
		$eleFormText.val(fileName);
	}
}
function fileAttachPreview(id, e){
	var sel_files = [];
	var $eleFormImg = $('#'+id);
	if ($eleFormImg.length){
		//이미지 사진보기
		var files = e.target.files;
		var filesArr = Array.prototype.slice.call(files);

		filesArr.forEach(function(f){
			if (!f.type.match("image.*")){
				alert('확장자는 이미지 확장자만 가능합니다.');
				return;
			}
			sel_files.push(f);

			var reader = new FileReader();
			reader.onload = function(e){
				var eleImg = '<img src="'+e.target.result+'" alt="첨부된파일">';
				$eleFormImg.html(eleImg);
			}
			reader.readAsDataURL(f);
		})
	}
}

$(function() {

    $('#menu').click(function() {

      $('#menu>span').toggleClass('on')

    })

  }) 
  
$(function() {
        function slideMenu() {
            var activeState = $("#menu-container .menu-list").hasClass("active");
            $("#menu-container .menu-list").animate({left: activeState ? "0%" : "-100%"}, 400);
        }
        $("#menu-wrapper").click(function(event) {
            event.stopPropagation();
            $("#hamburger-menu").toggleClass("open");
            $("#menu-container .menu-list").toggleClass("active");
            slideMenu();

            $("body").toggleClass("overflow-hidden");
        });

        $(".menu-list").find(".accordion-toggle").click(function() {
            $(this).next().toggleClass("open").slideToggle("fast");
            $(this).toggleClass("active-tab").find(".menu-link").toggleClass("active");

            $(".menu-list .accordion-content").not($(this).next()).slideUp("fast").removeClass("open");
            $(".menu-list .accordion-toggle").not(jQuery(this)).removeClass("active-tab").find(".menu-link").removeClass("active");
        });
    }); // jQuery load




