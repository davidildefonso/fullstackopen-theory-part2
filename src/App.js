import React, { useState, useEffect } from "react";
import Note from "./components/Note.js";
import noteService from './services/notes.js';



const App = () => {

  const [notes, setNotes] = useState([]);
 	const [newNote, setNewNote] = useState(
    'a new note...'
  );
	const [showAll, setShowAll] = useState(false);

	const hook = () => {		
		noteService
			.getAll()
			.then((data) => {
					setNotes(data)	
			});
		
	}

	useEffect(hook, []);

  const addNote = (event) => {
			event.preventDefault();

			const noteObject = {
				content: newNote,
				date: new Date().toISOString(),
				important: Math.random() < 0.5		
			};

			noteService
				.create( noteObject)
				.then((data) => {
						setNotes(notes.concat( {...noteObject, id: data.id} ));
						setNewNote('');	
				});

	
  }

	const handleNoteChange = (event) => { 
    setNewNote(event.target.value);
  }

	const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important ) ; 


	const toggleImportance = (id) => {
			const targetNote = notes.find(note => note.id === id);		
			const noteObject = {...targetNote,  important: !targetNote.important};

			noteService
					.update( id,  noteObject)
					.then((data) => {
							setNotes(notes.map( note => note.id === id ? data : note ));
					})
					.catch(error => {
								alert(
									`the note '${targetNote.content}' was already deleted from server`
								)
								setNotes(notes.filter(n => n.id !== id))
					});
		
	}


  return (
    <div>
      <h1>Notes</h1>
			<div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
            <Note key={note.id} note={note} toggleImportance = {toggleImportance} />
        )}
      </ul>
			 <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form> 
    </div>
  )
};

export default App;