import express, { json } from 'express';
import BookModel from '../models/books.js';

const router = express.Router();

//create
router.post("/addbookscard", (req, res) => {
    BookModel.create(req.body)
        .then(books => res.json(books))
        .catch(err => res.json(err))
});

//showing all books
router.get('/allbooks', (req, res) => {
    BookModel.find({})
        .then(books => res.json(books))
        .catch(err => res.json(err))
})

//mca books get
router.get('/mca_books', async (req, res) => {
    try {
        const mcaBooks = await BookModel.find({ department: 'MCA' });
        res.json(mcaBooks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//bca books get
router.get('/bca_books', async (req, res) => {
    try {
        const bcaBooks = await BookModel.find({ department: 'BCA' });
        res.json(bcaBooks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Btech books get
router.get('/btech_books', async (req, res) => {
    try {
        const btechBooks = await BookModel.find({ department: 'B.Tech' });
        res.json(btechBooks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Mtech books get
router.get('/mtech_books', async (req, res) => {
    try {
        const mtechBooks = await BookModel.find({ department: 'M.Tech' });
        res.json(mtechBooks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//bba books get
router.get('/bba_books', async (req, res) => {
    try {
        const bbaBooks = await BookModel.find({ department: 'BBA' });
        res.json(bbaBooks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//mba books get
router.get('/mba_books', async (req, res) => {
    try {
        const mbaBooks = await BookModel.find({ department: 'MBA' });
        res.json(mbaBooks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//view
//get Book by id
router.get('/book/:id', (req, res) => {
    const id = req.params.id;
    BookModel.findById(id)
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: "Book not found" });
            }
            res.json(book);
        })
        .catch(err => {
            console.error("Error retrieving book:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});


// updating 
//get data
router.get('/getbook/:id', (req, res) => {
    const id = req.params.id;
    BookModel.findById({ _id: id })
        .then(books => res.json(books))
        .catch(err => res.json(err))
})

router.put('/updatebookscard/:id', (req, res) => {
    const id = req.params.id;
    BookModel.findByIdAndUpdate({ _id: id }, {
        bname: req.body.bname,
        auther: req.body.auther,
        publishYear: req.body.publishYear,
        edition: req.body.edition,
        department: req.body.department,
        semester: req.body.semester,
        blink: req.body.blink
    })
        .then(books => res.json(books))
        .catch(err => res.json(err))
})

// delete

router.delete('/deletebook/:id', (req, res) => {
    const id = req.params.id;
    BookModel.findByIdAndDelete({ _id: id })
        .then(res => res.json(res))
        .catch(err => res.json(err))
})

export { router as BookRouter };