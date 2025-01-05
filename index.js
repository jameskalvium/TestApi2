const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let books = require('./data.json');

app.post('/books', (req, res) => {
    const { book_id, title, author, genre, year, copies } = req.body;

    if (!book_id || !title || !author || !genre || !year || !copies) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    if (typeof book_id !== 'string' || typeof title !== 'string' || typeof author !== 'string' ||
        typeof genre !== 'string' || typeof year !== 'number' || typeof copies !== 'number') {
        return res.status(400).json({ error: 'Invalid data types.' });
    }


    if (year < 0 || copies < 0) {
        return res.status(400).json({ error: 'Year and copies should be greater than zero.' });
    }

    if (books.some(book => book.book_id === book_id)) {
        return res.status(400).json({ error: 'Book already exists.' });
    }

    const newBook = { book_id, title, author, genre, year, copies };
    books.push(newBook);
    res.status(201).json(newBook);
});


app.get('/books', (req, res) => {
    res.status(200).json(books);
});


app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.book_id === req.params.id);

    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    res.status(200).json(book);
});


app.put('/books/:id', (req, res) => {
    const{ year, copies } = req.body;
    const bookIndex = books.findIndex(b => b.book_id === req.params.id);
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }
    if (year && typeof year !== 'number') {
        return res.status(400).json({ error: 'Year should number.' });
    }
    if (copies && typeof copies !== 'number') {
        return res.status(400).json({ error: 'Copies should number.' });
    }

    const updatedBook = { ...books[bookIndex], ...req.body };
    books[bookIndex] = updatedBook;

    res.status(200).json(updatedBook);
});


app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.book_id === req.params.id);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    books.splice(bookIndex, 1);
    res.status(200).json({ message: 'Book deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});