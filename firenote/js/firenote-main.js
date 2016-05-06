$("document").ready(function () {
  $('.button-collapse').sideNav(
    {
      closeOnClick: true
    }
  );
  $('.button-collapse').sideNav('hide');
});

$("#titlebar").click(function() {
  $('.button-collapse').sideNav('show');
});

function initTinyMce(elementSelector) {
  tinymce.init({
    selector: elementSelector,
    plugins: 'code',
    menubar: false
  });
}

initTinyMce("#editarea");