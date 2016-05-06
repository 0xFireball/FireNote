/// <reference path="jquery.d.ts" />
/// <reference path="lib.d.ts" />
/// <reference path="storagemanager.ts" />
/// <reference path="notebook.ts" />

class FireNote {
    private _storageHandle: StorageManager;
    private _savedNotebook: Notebook;
    private _currentNote: Note;
    constructor(storageManager: StorageManager) {
        this._storageHandle = storageManager;
    }
    private layoutUiWithNotes() {
        let savedNotebook = this._savedNotebook;
        savedNotebook.sections.forEach(notebookSection => {
            notebookSection.notes.forEach(note => {
                //Load each note
                $("#note-list-nav").append('<li><a href="javascript:switchToNote({2}, {1})" >{0}</a></li>'.format(note.noteName, notebookSection.notes.indexOf(note), savedNotebook.sections.indexOf(notebookSection)));
            });
        });
    }
    loadNotes() {
        this._savedNotebook = this._storageHandle.loadNotebook();
        this.layoutUiWithNotes();
    }
    loadNotesFromCache() {
        this.layoutUiWithNotes();
    }
    saveNotes() {
        this._storageHandle.saveNotebook(this._savedNotebook);
    }
    refreshNotes() {
        this.saveNotes();
        this.loadNotesFromCache();
    }
    switchToNote(sectionId: number, noteId: number) {
        let savedNotebook = this._savedNotebook;
        let currentNote = savedNotebook.sections[sectionId].notes[noteId];
        this._currentNote = currentNote;
        $("#titlebar").html(currentNote.noteName);
    }
    getCurrentNote() : Note {
        return this._currentNote;
    }
}

jQuery.fn.selectText = function() {
    var doc = document;
    var element = this[0];
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
        let newTitle: string = titleBar.text();
        titleBar.prop("contenteditable", false);
        fireNote.getCurrentNote().noteName = newTitle;
        fireNote.refreshNotes();
    });
    titleBar.selectText();
    titleBar.keypress(function(e) { return e.which != 13; });
});

var currentStorageManager = new StorageManager();
var fireNote = new FireNote(currentStorageManager);
fireNote.loadNotes();

function switchToNote(sectionId: number, noteId: number) {
    fireNote.switchToNote(sectionId, noteId);
}