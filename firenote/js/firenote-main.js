$("document").ready(function () {
  $('.button-collapse').sideNav();
});

function initTinyMce(elementSelector) {
  tinymce.init({
    selector: elementSelector
  });
}

initTinyMce("#editarea");