class Note {
    noteName: string = "Untitled1";
    noteInnerHtml: string = "";
}

class NoteSection {
    notes: Note[];
}

class Notebook {
    notebookName: string;
    sections: NoteSection[];
}