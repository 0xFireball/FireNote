/// <reference path="jquery.d.ts" />
/// <reference path="lib.d.ts" />
/// <reference path="storagemanager.ts" />

class FireNote {
    private _storageHandle: StorageManager;
    constructor(storageManager: StorageManager) {
        this._storageHandle = storageManager;
    }
    loadNotes() {

    }
}

jQuery.fn.selectText = function() {
    var doc = document;
    var element = this[0];
    console.log(this, element);
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

$("#delete-note-btn").click(function() {
    if (confirm('Are you sure you want to delete this note? It cannot be recovered.')) {
        //Delete
    }
});

$("#rename-note-btn").click(function() {
    var titleBar = $("#titlebar");
    titleBar.prop("contenteditable", true);
    titleBar.focus();
    titleBar.blur(() => {
        titleBar.prop("contenteditable", false);
    });
    titleBar.selectText();
    titleBar.keypress(function(e) { return e.which != 13; });
});

var currentStorageManager = new StorageManager();
var fireNote = new FireNote();
fireNote.loadNotes();