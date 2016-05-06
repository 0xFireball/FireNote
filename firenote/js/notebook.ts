class Note {
    noteName: string;
}

class NoteSection {
    notes: Note[];
}

class Notebook {
    notebookName: string;
    sections: NoteSection[];
}