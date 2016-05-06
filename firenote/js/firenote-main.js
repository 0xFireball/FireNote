$("document").ready(function() {
    $('.button-collapse').sideNav(
        {
            closeOnClick: true
        }
    );
    $('.button-collapse').sideNav('hide');
    $("#note-list-nav").append('<li><a href="javascript:void(0)" class="red lighten-3">New Note</a></li>');
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