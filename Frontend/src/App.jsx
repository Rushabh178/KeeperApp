import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Note from "./components/Note";
import CreateArea from "./components/CreateArea";
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const getElement = async () => {
      try {
        const res = await axios.get("http://localhost:5000/notes");
        setNotes(res.data);
        console.log(res.data);
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };
    getElement();
  }, []);

  function addNote(newNote) {
    axios.post("http://localhost:5000/notes/post", newNote)
      .then((res) => {
        setNotes((prevNotes) => {
          return [...prevNotes, res.data];
        });
      })
      .catch((error) => {
        console.log("Post error:", error);
      });
  }

  function deleteNote(id) {
    axios.delete(`http://localhost:5000/notes/${id}`)
      .then(() => {
        setNotes((prevNotes) => {
          return prevNotes.filter((noteItem) => noteItem._id !== id);
        });
      })
      .catch((error) => {
        console.log("Delete error:", error);
      });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem) => {
        return (
          <Note
            key={noteItem._id}
            id={noteItem._id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
