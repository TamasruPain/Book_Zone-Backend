import express, { json } from 'express';
import QueryModel from '../models/queries.js';


const router = express.Router();


//create
router.post("/makeQuery", (req, res) => {
    const { name, email, subject, text } = req.body;

    if (!name || !email || !subject || !text) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    QueryModel.create({ name, email, subject, text })
        .then(queries => res.json(queries))
        .catch(err => res.status(500).json({ error: err.message }))
})

//get all the queries

router.get('/queries', (req, res) => {
    QueryModel.find({})
        .then(queries => res.json(queries))
        .catch(err => res.status(500).json({ error: err.message }));
});

// View
// Get query by id
router.get('/queries/:id', (req, res) => {
    const id = req.params.id;
    QueryModel.findById(id)
        .then(queries => {
            if (!queries) {
                return res.status(404).json({ error: "not found" });
            }
            res.json(queries);
        })
        .catch(err => {
            console.error("Error retrieving student:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});


// Delete
router.delete('/deleteQuery/:id', (req, res) => {
    const id = req.params.id;
    QueryModel.findByIdAndDelete(id)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

export { router as QueryRouter };
