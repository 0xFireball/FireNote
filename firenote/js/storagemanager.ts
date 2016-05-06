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
        let defaultNotebook = new Notebook();
        defaultNotebook.notebookName = "Notebook1";
        defaultNotebook.sections = new Array<NoteSection>();
        let defaultNotebookSection = new NoteSection();
        let defaultNote = new Note();
        defaultNote.noteName = "Welcome to FireNote!";
        defaultNotebookSection.notes = new Array<Note>();
        defaultNotebookSection.notes.push(defaultNote);
        defaultNotebook.sections.push(defaultNotebookSection);
        let serializedNotebook: string = SerializationHelper.serialize(defaultNotebook);
        localStorage.setItem(savedNotesLocalStorageKey, serializedNotebook);
    }
    loadNotebook() : Notebook {
        let existingNotes: Notebook = null;
        switch (this._noteStorageType) {
            case NoteStorageType.LocalStorage:
                let savedNoteData: string = localStorage.getItem(savedNotesLocalStorageKey);
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
}

class StorageManager {
    private _notebookLoader: NotebookLoader;
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
    loadNotebook() : Notebook {
        return this._notebookLoader.loadNotebook();
    }
}