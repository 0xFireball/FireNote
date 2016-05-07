/// <reference path="jquery.d.ts" />
/// <reference path="lib.d.ts" />
/// <reference path="storagemanager.ts" />
/// <reference path="notebook.ts" />
class FireNote {
    constructor(storageManager) {
        this._storageHandle = storageManager;
    }
    layoutUiWithNotes() {
        $("#note-list-nav").empty();
        let savedNotebook = this._savedNotebook;
        savedNotebook.sections.forEach(notebookSection => {
            notebookSection.notes.forEach(note => {
                //Load each note
                $("#note-list-nav").append('<li><a href="javascript:switchToNote({2}, {1})" >{0}</a></li>'.format(note.noteName, notebookSection.notes.indexOf(note), savedNotebook.sections.indexOf(notebookSection)));
            });
        });
        $("#note-list-nav").append('<li><a href="javascript:createNewNote()" class="red lighten-3">New Note</a></li>');
    }
    loadNotes() {
        this._savedNotebook = this._storageHandle.loadNotebook();
        this.layoutUiWithNotes();
    }
    loadNotesFromCache() {
        this.layoutUiWithNotes();
    }
    saveCurrentEditorContent() {
        if (this._currentNote) {
            let editorContent = tinyMCE.activeEditor.getContent();
            this._currentNote.noteInnerHtml = editorContent;
            fireNote.saveNotes();
        }
    }
    loadCurrentEditorContent() {
        let contentToLoad = this._currentNote.noteInnerHtml;
        tinyMCE.activeEditor.setContent(contentToLoad);
    }
    saveNotes() {
        this._storageHandle.saveNotebook(this._savedNotebook);
    }
    refreshNotes() {
        this.saveNotes();
        this.loadNotesFromCache();
    }
    switchToNote(sectionId, noteId) {
        let savedNotebook = this._savedNotebook;
        let currentNote = savedNotebook.sections[sectionId].notes[noteId];
        this._currentNote = currentNote;
        $("#titlebar").html(currentNote.noteName);
        this.loadCurrentEditorContent();
    }
    getCurrentNote() {
        return this._currentNote;
    }
}
jQuery.fn.selectText = function () {
    var doc = document;
    var element = this[0];
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    }
    else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};
$("#delete-note-btn").click(function () {
    if (confirm('Are you sure you want to delete this note? It cannot be recovered.')) {
    }
});
$("#rename-note-btn").click(function () {
    var titleBar = $("#titlebar");
    titleBar.prop("contenteditable", true);
    titleBar.focus();
    titleBar.blur(() => {
        let newTitle = titleBar.text();
        titleBar.prop("contenteditable", false);
        fireNote.getCurrentNote().noteName = newTitle;
        fireNote.refreshNotes();
    });
    titleBar.selectText();
    titleBar.keypress(function (e) { return e.which != 13; });
});
var currentStorageManager = new StorageManager();
var fireNote = new FireNote(currentStorageManager);
fireNote.loadNotes();
function switchToNote(sectionId, noteId) {
    fireNote.saveCurrentEditorContent();
    $("#editing-area").show();
    $("#intro").hide();
    fireNote.switchToNote(sectionId, noteId);
}
function createNewNote() {
}
setInterval(function () {
    fireNote.saveCurrentEditorContent();
}, 1000);
//# sourceMappingURL=firenote.js.map