/// <reference path="common.ts" />
/// <reference path="options.ts" />

//Storage manager - Manage storage across scopes (web/nodejs/mobile)

let savedNotesLocalStorageKey = "savednotes";
//The directory where notes are stored

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
        this.saveNotebook(defaultNotebook);
    }
    loadNotebook(): Notebook {
        let existingNotes: Notebook = null;
        let savedNoteData: string = null;
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
    saveNotebook(notebookToSave: Notebook) {
        let serializedNotebook: string = SerializationHelper.serialize(notebookToSave);
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
    private _notebookLoader: NotebookLoader;
    private initialize() {
        if (is_nw()) {
            //Desktop app, use file storage
            this._notebookLoader = new NotebookLoader(NoteStorageType.FileStorage);
        }
        else {
            //Web/Mobile app, use `localStorage`
            this._notebookLoader = new NotebookLoader(NoteStorageType.LocalStorage);
        }
    }
    constructor() {
        this.initialize();
    }
    loadNotebook(): Notebook {
        return this._notebookLoader.loadNotebook();
    }
    saveNotebook(notebookToSave: Notebook) {
        this._notebookLoader.saveNotebook(notebookToSave);
    }
}