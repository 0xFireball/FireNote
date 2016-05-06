/// <reference path="common.ts" />
//Storage manager - Manage storage across scopes (web/nodejs/mobile)
let savedNotesLocalStorageKey = "savednotes";
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
        switch (this._noteStorageType) {
            case NoteStorageType.LocalStorage:
                let savedNoteData = localStorage.getItem(savedNotesLocalStorageKey);
                if (!savedNoteData)
                    break;
                existingNotes = SerializationHelper.toInstance(new Notebook(), savedNoteData);
                break;
        }
        if (!existingNotes) {
            //reset notes and reload notebook
            this.reinitializeNotebook();
            existingNotes = this.loadNotebook();
        }
        return existingNotes;
    }
    saveNotebook(notebookToSave) {
        let serializedNotebook = SerializationHelper.serialize(notebookToSave);
        localStorage.setItem(savedNotesLocalStorageKey, serializedNotebook);
    }
}
class StorageManager {
    constructor() {
        this.initialize();
    }
    initialize() {
        if (is_nw()) {
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