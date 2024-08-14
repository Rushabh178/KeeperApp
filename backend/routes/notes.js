import express from 'express';
import Note from './models/Note.js';

const router = express.Router();

// GET all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ key: 1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new note
router.post('/post', async (req, res) => {
  try {
    const lastNote = await Note.findOne().sort({ key: -1 });
    const newKey = lastNote ? lastNote.key + 1 : 1;
    
    const note = new Note({
      key: newKey,
      title: req.body.title,
      content: req.body.content,
    });

    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a note
router.delete('/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);

    // Re-index all notes
    const notes = await Note.find().sort({ key: 1 });
    await Promise.all(notes.map((note, index) => {
      note.key = index + 1;
      return note.save();
    }));

    res.json({ message: 'Note deleted and keys updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router; // Use export default to export the router
