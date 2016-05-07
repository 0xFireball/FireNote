/// <reference path="jquery.d.ts" />
/// <reference path="lib.d.ts" />
/// <reference path="storagemanager.ts" />
/// <reference path="notebook.ts" />

class FireNote {
    private _storageHandle: StorageManager;
    private _savedNotebook: Notebook;
    private _currentNote: Note;
    private _currentSection: NoteSection;

    constructor(storageManager: StorageManager) {
        this._storageHandle = storageManager;
    }
    private layoutUiWithNotes() {
        $("#note-list-nav").empty();
        let savedNotebook = this._savedNotebook;
        savedNotebook.sections.forEach(notebookSection => {
            notebookSection.notes.forEach(note => {
                //Load each note
                $("#note-list-nav").append('<li><a href="javascript:switchToNote({2}, {1})" >{0}</a></li>'.format(note.noteName, notebookSection.notes.indexOf(note), savedNotebook.sections.indexOf(notebookSection)));
            });
        });
        $("#note-list-nav").append('<li><a href="javascript:createNewNote()" class="red lighten-3">New Note</a></li>');
        $("#note-list-nav").append('<li><a href="javascript:showIntro()" class="red accent-3">Home</a></li>');
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
            let editorContent: string = tinyMCE.activeEditor.getContent();
            this._currentNote.noteInnerHtml = editorContent;
            fireNote.saveNotes();
        }
    }
    loadCurrentEditorContent() {
        let contentToLoad: string = this._currentNote.noteInnerHtml;
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
    switchToNote(sectionId: number, noteId: number) {
        let savedNotebook = this._savedNotebook;
        let currentSection = savedNotebook.sections[sectionId];
        if (!currentSection)
        {
            return;
        }
        let currentNote = currentSection.notes[noteId];
        this._currentNote = currentNote;
        this._currentSection = currentSection;
        $("#titlebar").html(currentNote.noteName);
        this.loadCurrentEditorContent();
    }
    getCurrentNote(): Note {
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

jQuery.fn.selectText = function () {
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

$("#rename-note-btn").click(function () {
    var titleBar = $("#titlebar");
    titleBar.prop("contenteditable", true);
    titleBar.focus();
    titleBar.blur(() => {
        let newTitle: string = titleBar.text();
        titleBar.prop("contenteditable", false);
        fireNote.getCurrentNote().noteName = newTitle;
        fireNote.refreshNotesFromCache();
    });
    titleBar.selectText();
    titleBar.keypress(function (e) { return e.which != 13; });
});


function showIntro() {
    $("#editing-area").hide();
    $("#intro").show();
    $("#titlebar").html("FireNote");
}

function hideIntro() {
    $("#editing-area").show();
    $("#intro").hide();
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

function switchToNote(sectionId: number, noteId: number) {
    fireNote.saveCurrentEditorContent();
    hideIntro();
    fireNote.switchToNote(sectionId, noteId);
}

function createNewNote() {
    fireNote.createNewNote();
}

setInterval(function () {
    fireNote.saveCurrentEditorContent();
}, 1000);