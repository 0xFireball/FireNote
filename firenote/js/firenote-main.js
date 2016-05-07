$("document").ready(function() {
    $('.button-collapse').sideNav(
        {
            closeOnClick: true
        }
    );
    $("#editing-area").hide();
    $("#note-list-nav").addClass("fixed");
    $('.button-collapse').sideNav('hide');
});

$("#titlebar").click(function() {
    $('.button-collapse').sideNav('show');
});

function initTinyMce(elementSelector) {
    tinymce.init({
        selector: elementSelector,
        plugins: 'code autoresize',
        menubar: false,
        skin: "light"
    });
}

initTinyMce("#editarea");

shortcut.add("Ctrl+Space", function() {
    $('.button-collapse').sideNav('show');
});