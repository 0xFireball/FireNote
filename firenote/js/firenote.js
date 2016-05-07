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
        $("#note-list-nav").append('<li><a href="javascript:showIntro()" class="red accent-1">Home</a></li>');
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
    refreshNotesFromCache() {
        this.saveNotes();
        this.loadNotesFromCache();
    }
    refreshNotes() {
        this.saveNotes();
        this.loadNotes();
    }
    switchToNote(sectionId, noteId) {
        let savedNotebook = this._savedNotebook;
        let currentSection = savedNotebook.sections[sectionId];
        if (!currentSection) {
            return;
        }
        let currentNote = currentSection.notes[noteId];
        this._currentNote = currentNote;
        this._currentSection = currentSection;
        $("#titlebar").html(currentNote.noteName);
        this.loadCurrentEditorContent();
    }
    getCurrentNote() {
        return this._currentNote;
    }
    removeCurrentNote() {
        var currentNoteIndex = this._currentSection.notes.indexOf(this._currentNote);
        this._currentSection.notes.splice(currentNoteIndex, 1);
        this.refreshNotes();
    }
    createNewNote() {
        let newNote = new Note();
        newNote.noteName = "Untitled Note";
        if (!this._currentSection) {
            this._currentSection = this._savedNotebook.sections[0]; //For now, use default section]
        }
        this._currentSection.notes.push(newNote);
        let currentSectionId = this._savedNotebook.sections.indexOf(this._currentSection);
        let currentNoteId = this._currentSection.notes.indexOf(newNote);
        switchToNote(currentSectionId, currentNoteId);
    }
}
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
        });
    }
});
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
$("#rename-note-btn").click(function () {
    var titleBar = $("#titlebar");
    titleBar.prop("contenteditable", true);
    titleBar.focus();
    titleBar.blur(() => {
        let newTitle = titleBar.text();
        titleBar.prop("contenteditable", false);
        fireNote.getCurrentNote().noteName = newTitle;
        fireNote.refreshNotesFromCache();
    });
    titleBar.selectText();
    titleBar.keypress(function (e) { return e.which != 13; });
});
function reShowEditor() {
    $("#intro").hide();
    $("#editing-area")
        .show()
        .animateCss('fadeInLeftBig');
    $("#note-actions").fadeIn();
}
function showIntro() {
    $("#editing-area").hide();
    $("#intro").fadeIn(1000);
    $("#titlebar").html("FireNote");
    $("#note-actions").fadeOut();
}
function hideIntro() {
    let intro = $("#intro");
    if (intro.is(":visible"))
        intro.fadeOut(1200);
    $("#editing-area").fadeIn(1200);
    $("#note-actions").fadeIn();
}
var currentStorageManager = new StorageManager();
var fireNote = new FireNote(currentStorageManager);
fireNote.loadNotes();
$("#delete-note-btn").click(function () {
    if (confirm('Are you sure you want to delete this note? It cannot be recovered.')) {
        //Delete
        fireNote.removeCurrentNote();
        showIntro();
    }
});
function switchToNote(sectionId, noteId) {
    fireNote.saveCurrentEditorContent();
    reShowEditor();
    fireNote.switchToNote(sectionId, noteId);
}
function createNewNote() {
    fireNote.createNewNote();
    fireNote.refreshNotesFromCache();
}
setInterval(function () {
    fireNote.saveCurrentEditorContent();
}, 1000);
showIntro();
//# sourceMappingURL=firenote.js.map