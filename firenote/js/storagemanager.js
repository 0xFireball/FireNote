/// <reference path="common.ts" />
/// <reference path="options.ts" />
//Storage manager - Manage storage across scopes (web/nodejs/mobile)
let savedNotesLocalStorageKey = "savednotes";
//The directory where notes are stored
var NoteStorageType;
(function (NoteStorageType) {
    NoteStorageType[NoteStorageType["LocalStorage"] = 0] = "LocalStorage";
    NoteStorageType[NoteStorageType["FileStorage"] = 1] = "FileStorage";
})(NoteStorageType || (NoteStorageType = {}));
class NotebookLoader {
    constructor(noteStorageType) {
        this._noteStorageType = noteStorageType;
    }
    reinitializeNotebook() {
        //Generate an empty notebook
        let defaultNotebook = new Notebook();
        defaultNotebook.notebookName = "Notebook1";
        defaultNotebook.sections = new Array();
        let defaultNotebookSection = new NoteSection();
        let defaultNote = new Note();
        defaultNote.noteName = "Welcome to FireNote!";
        defaultNotebookSection.notes = new Array();
        defaultNotebookSection.notes.push(defaultNote);
        defaultNotebook.sections.push(defaultNotebookSection);
        this.saveNotebook(defaultNotebook);
    }
    loadNotebook() {
        let existingNotes = null;
        let savedNoteData = null;
        switch (this._noteStorageType) {
            case NoteStorageType.LocalStorage:
                savedNoteData = localStorage.getItem(savedNotesLocalStorageKey);
                break;
            case NoteStorageType.FileStorage:
                var fs = require("fs");
                var osenv = require("osenv");
                let noteDirectoryOnDisk = osenv.home() + "/.firenote/";
                let notebookDataFile = noteDirectoryOnDisk + savedNotesLocalStorageKey;
                if (!fs.existsSync(noteDirectoryOnDisk)) {
                    fs.mkdirSync(noteDirectoryOnDisk);
                }
                if (fs.existsSync(notebookDataFile)) {
                    savedNoteData = fs.readFileSync(notebookDataFile, "utf8");
                }
                break;
        }
        if (savedNoteData) {
            //Saved notes exist
            existingNotes = SerializationHelper.toInstance(new Notebook(), savedNoteData);
        }
        else {
            //reset notes and reload notebook
            this.reinitializeNotebook();
            existingNotes = this.loadNotebook();
        }
        return existingNotes;
    }
    saveNotebook(notebookToSave) {
        let serializedNotebook = SerializationHelper.serialize(notebookToSave);
        switch (this._noteStorageType) {
            case NoteStorageType.LocalStorage:
                localStorage.setItem(savedNotesLocalStorageKey, serializedNotebook);
                break;
            case NoteStorageType.FileStorage:
                var fs = require("fs");
                var osenv = require("osenv");
                let noteDirectoryOnDisk = osenv.home() + "/.firenote/";
                let notebookDataFile = noteDirectoryOnDisk + savedNotesLocalStorageKey;
                if (!fs.existsSync(noteDirectoryOnDisk)) {
                    fs.mkdirSync(noteDirectoryOnDisk);
                }
                fs.writeFileSync(notebookDataFile, serializedNotebook); //asynchronously write file
                break;
        }
    }
}
class StorageManager {
    constructor() {
        this.initialize();
    }
    initialize() {
        if (is_nw()) {
            //Desktop app, use file storage
            this._notebookLoader = new NotebookLoader(NoteStorageType.FileStorage);
        }
        else {
            //Web/Mobile app, use `localStorage`
            this._notebookLoader = new NotebookLoader(NoteStorageType.LocalStorage);
        }
    }
    loadNotebook() {
        return this._notebookLoader.loadNotebook();
    }
    saveNotebook(notebookToSave) {
        this._notebookLoader.saveNotebook(notebookToSave);
    }
}
//# sourceMappingURL=storagemanager.js.map