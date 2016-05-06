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
        localStorage.setItem(savedNotesLocalStorageKey, SerializationHelper.serialize(defaultNotebook));
    }
    loadNotebook() {
        let existingNotes = null;
        switch (this._noteStorageType) {
            case NoteStorageType.LocalStorage:
                let existingNotes = SerializationHelper.toInstance(new Notebook(), localStorage.getItem(savedNotesLocalStorageKey));
                break;
        }
        if (!existingNotes) {
            //reset notes and reload notebook
            this.reinitializeNotebook();
            existingNotes = this.loadNotebook();
        }
        return existingNotes;
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
}
//# sourceMappingURL=storagemanager.js.map