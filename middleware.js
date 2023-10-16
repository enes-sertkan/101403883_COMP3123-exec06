const noteModel = require('./models/Notes.js');

// Middleware for validating note requests
const validateNote = (req, res, next) => {
    if (!req.body.noteTitle || !req.body.noteDescription || !req.body.priority) {
        return res.status(400).send({
            message: "Note title, description, and priority are required"
        });
    }

    if (!['HIGH', 'LOW', 'MEDIUM'].includes(req.body.priority)) {
        return res.status(400).send({
            message: "Invalid priority. Must be 'HIGH', 'LOW', or 'MEDIUM'."
        });
    }

    // If the request is valid, proceed to the next middleware or route handler
    next();
};

module.exports = {
    validateNote
};
