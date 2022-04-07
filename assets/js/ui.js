$(document).ready(function(){
    $('.tab-link').click(function () {
        var tab_id = $(this).attr('data-tab');

        $('.tab-link').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');

    });
    });



/* 로그인 창 */

$(document).ready(function(){
 const togglePassword = document.querySelector("#togglePassword");
 const password = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
     // toggle the type attribute
     const type = password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);
       // toggle the icon
  this.classList.toggle("bi-eye");
 });

$('.input_text').on('input', checkInput);
$('.input_password').on('input', checkInput);

// input 입력 시에 checkInput 함수실행
function checkInput() {
  var idCheck = $('.input_text').val();   // idCheck 변수
  var passwordCheck = $('.input_password').val();   // idCheck 변수
  var btnLogin = $('.btn_submit');

  if (idCheck === '' || passwordCheck === '') {
    // 기본 로그인 버튼 색상
    btnLogin.removeClass('on');
  } else {
    // ID 비밀번호 입력 시에 로그인 버튼 배경색 변경
    btnLogin.addClass('on');
  }
}


 });


