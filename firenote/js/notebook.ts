class Note {
    noteName: string;
    noteUid: string;
}

class NoteSection {
    notes: Note[];
}

class Notebook {
    notebookName: string;
    sections: NoteSection[];
}