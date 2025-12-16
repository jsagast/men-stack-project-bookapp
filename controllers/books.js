
const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Book = require('../models/book.js');

router.get('/', async (req, res) => {
   try {
    const books = await Book.find().populate('owner');
    res.render('books/index.ejs',{
      books,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

//Get for New
router.get('/new', async(req,res)=>{
    const books=await Book.find()
    res.render('books/new.ejs',{
      books,
    });
});

//post new
router.post('/', async (req, res) => {
  try {
      const exists = await Book.findOne({ name: req.body.name, author: req.body.author });

    if (exists) {
      req.flash('error', 'Book already exists in the collection');
      return res.redirect('/books/new');
    }
    const newBook=new Book(req.body);
    newBook.owner=req.session.user._id;
    await newBook.save();
    req.flash('success', 'Book created successfully!');
    res.redirect('/books');

  } catch (error) {
    req.flash('error', 'Something went wrong');
    res.redirect('/');
  }
});


//show book detail
router.get('/:bookId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate('owner');
    const userHasFavorited = book.favoritedByUsers.some((user) =>
            user.equals(req.session.user._id)
    );
    const userHasPulled = book.pulledByUsers.some((user) =>
            user.equals(req.session.user._id)
    );
    res.render('books/show.ejs', {
      book, 
      userHasFavorited,
      userHasPulled
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// POST if favorite 
router.post('/:bookId/favorited-by/:userId', async (req, res) => {
    try {
        await Book.findByIdAndUpdate(req.params.bookId, {
            $push: { favoritedByUsers: req.params.userId },
        })
        res.redirect(`/books/${req.params.bookId}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});


//Delete
router.delete('/:bookId', async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId)
        if (book.owner.equals(req.session.user._id)) {
            await book.deleteOne();
            req.flash('success', 'Book has been removed successfully!');
            res.redirect('/books');
        } else {
            res.send("You don't have permission to do that.")
        }
    } catch (error) {
        console.error(error)
        res.redirect('/')
    }
});

//Update

router.get('/:bookId/edit', async (req, res) => {
  try {
    const currentBook = await Book.findById(req.params.bookId);
    res.render('books/edit.ejs', {
      book: currentBook,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.put('/:bookId', async (req, res) => {
  try {
    const currentBook = await Book.findById(req.params.bookId);
    if (currentBook.owner.equals(req.session.user._id)) {
    currentBook.set(req.body);// to update
    await currentBook.save();
    res.redirect('/books');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


// POST add to shelf
router.post('/:bookId/pulled-by/:userId', async (req, res) => {
    try {
        await Book.findByIdAndUpdate(req.params.bookId, {
            $push: { pulledByUsers:req.params.userId },
        })
        res.redirect(`/books/${req.params.bookId}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});

router.delete('/:bookId/favorited-by/:userId', async (req, res) => {
    try {
        await Book.findByIdAndUpdate(req.params.bookId, {
            $pull: { favoritedByUsers: req.params.userId },
        })
        res.redirect(`/books/${req.params.bookId}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});

router.delete('/:bookId/pulled-by/:userId', async (req, res) => {
    try {
        await Book.findByIdAndUpdate(req.params.bookId, {
            $pull: { pulledByUsers: req.params.userId },
        })
        res.redirect(`/books/${req.params.bookId}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});


module.exports = router;
