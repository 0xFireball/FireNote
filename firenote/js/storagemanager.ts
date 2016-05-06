/// <reference path="common.ts" />

//Storage manager - Manage storage across scopes (web/nodejs/mobile)

let savedNotesLocalStorageKey = "savednotes";

enum NoteStorageType {
    LocalStorage,
    FileStorage
}

class NotebookLoader {
    private _noteStorageType: NoteStorageType;
    constructor(noteStorageType: NoteStorageType) {
        this._noteStorageType = noteStorageType;
    }
    reinitializeNotebook() {
        //Generate an empty notebook
        let defaultNotebook = new Notebook() ;
        localStorage.setItem(savedNotesLocalStorageKey, SerializationHelper.serialize(defaultNotebook));
    }
    loadNotebook() {
        let existingNotes: Notebook = null;
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
    _notebookLoader: NotebookLoader;
    private initialize() {
        if (is_nw()) {
            //Desktop app, use file storage

        }
        else {
            //Web/Mobile app, use `localStorage`
            this._notebookLoader = new NotebookLoader(NoteStorageType.LocalStorage);
        }
    }
    constructor() {
        this.initialize();
    }
    loadNotebook() {
        return this._notebookLoader.loadNotebook();
    }
}