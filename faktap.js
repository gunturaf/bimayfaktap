window.Tesseract = Tesseract.create({
    workerPath: chrome.runtime.getURL('tesseract/worker.js'),
    langPath: chrome.runtime.getURL('tesseract/tessdata/3.02/'),
    corePath: chrome.runtime.getURL('tesseract/index.js'),
})

var form = $('form').eq(0);
var $captcha_input = form.find('[name="defaultLoginReal"]');
var $captcha_outer = form.find("p:eq(1)")
var $submit_btn = form.find("#ctl00_ContentPlaceHolder1_SubmitButtonBM");
var p = form.find('p').eq(1);
var img = p.find('img').eq(0);
img.attr('id', 'faktapImage')
var ifaktap = document.getElementById("faktapImage");


var setCaptchaAnswer = function(r) {
    $captcha_input.val(r);
}

var loading_svg = `<!-- 5 -->
<div class="faktap-loader" title="4">
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
    <rect x="0" y="0" width="4" height="10" fill="#333">
      <animateTransform attributeType="xml"
        attributeName="transform" type="translate"
        values="0 0; 0 20; 0 0"
        begin="0" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="10" y="0" width="4" height="10" fill="#333">
      <animateTransform attributeType="xml"
        attributeName="transform" type="translate"
        values="0 0; 0 20; 0 0"
        begin="0.2s" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="20" y="0" width="4" height="10" fill="#333">
      <animateTransform attributeType="xml"
        attributeName="transform" type="translate"
        values="0 0; 0 20; 0 0"
        begin="0.4s" dur="0.6s" repeatCount="indefinite" />
    </rect>
  </svg>
  <p>A moment, please...</p>
</div>`;


form.append(loading_svg);

$captcha_outer.hide();
$submit_btn.hide();

var benchmarkStart = Date.now();

Tesseract.recognize(ifaktap, {
    lang: 'eng'})
         .progress(function  (p) {
            //  console.log('progress', p)
         })
         .then(function (result) {
             var benchmarkEnd = Date.now();

             console.log('Elapsed: '+(benchmarkEnd-benchmarkStart));

            //  console.log('result', result.text)
             var t = result.text.replace(/\r?\n|\r/g, '')
             if(t.length == 5) {
                 t = t.substr(0,3);
             }
             t = t.split('');
             var r = 0;
             if(t[1] == '+') {
                 r = parseInt(t[0])+parseInt(t[2]);
             }
             if(t[1] == '-') {
                 r = parseInt(t[0])-parseInt(t[2]);
             }
             if(t[1] == 'x') {
                 r = parseInt(t[0])*parseInt(t[2]);
             }

             if(isNaN(r)) {
                 r = '';
             }

             $captcha_outer.slideDown();
             $submit_btn.slideDown();
             $(".faktap-loader").remove();

             setCaptchaAnswer(r);
         })
