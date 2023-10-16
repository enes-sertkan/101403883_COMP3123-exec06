const express = require('express');
const router = express.Router();
const noteModel = require('../models/NotesModel.js');
const middleware = require('../middleware.js');

// Create a new Note
router.post('/notes', middleware.validateNote, (req, res) => {
    // Validate request
    if (!req.body.noteTitle || !req.body.noteDescription || !req.body.priority) {
        return res.status(400).send({
            message: "Note title, description, and priority are required"
        });
    }

    // Create a new note using the Note model
    const newNote = new noteModel({
        noteTitle: req.body.noteTitle,
        noteDescription: req.body.noteDescription,
        priority: req.body.priority
    });

    // Save the new note to the database
    newNote.save()
        .then(note => {
            res.send(note);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Note."
            });
        });
});

// Retrieve all Notes
router.get('/notes', middleware.validateNote, (req, res) => {
    // Fetch all notes from the database
    noteModel.find()
        .then(notes => {
            res.send(notes);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
});

// Retrieve a single Note with noteId
router.get('/notes/:noteId', middleware.validateNote, (req, res) => {
    const noteId = req.params.noteId;
    // Find a note by its unique ID
    noteModel.findById(noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + noteId
                });
            }
            res.send(note);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving note with id " + noteId
            });
        });
});

// Update a Note with noteId
router.put('/notes/:noteId', middleware.validateNote, (req, res) => {
    const noteId = req.params.noteId;
    // Find and update the note by its ID
    noteModel.findByIdAndUpdate(noteId, {
        noteTitle: req.body.noteTitle,
        noteDescription: req.body.noteDescription,
        priority: req.body.priority
    }, { new: true })
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + noteId
                });
            }
            res.send(note);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating note with id " + noteId
            });
        });
});

// Delete a Note with noteId
router.delete('/notes/:noteId', middleware.validateNote, (req, res) => {
    const noteId = req.params.noteId;
    // Find and remove the note by its ID
    noteModel.findByIdAndRemove(noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + noteId
                });
            }
            res.send({ message: "Note deleted successfully!" });
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete note with id " + noteId
            });
        });
});

module.exports = router;
