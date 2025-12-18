
const express = require('express');
const router = express.Router();
const fetch= require('node-fetch');

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

router.get('/search', async(req,res)=>{//optional
  // console.log(req.query.search);
  try{
    const response= await fetch(`https://openlibrary.org/search.json?title=${req.query.search}&language=eng`);
    const data= await response.json();
    console.log(data);

    const results = data.docs
    .filter(item => item.has_fulltext)  // just full text
    .slice(0, 5)                         // first 5 only to avoid long list
    .map(item=> {
      const olid = item.cover_edition_key
      return {
        title: item.title,
        author: item.author_name?.[0] || 'Unknown',
        coverUrl: olid
          ? `https://covers.openlibrary.org/b/olid/${olid}-M.jpg`
          : '/images/no_cover.jpg'
      };
    });
    res.render('books/index-search.ejs', {
      results,
    });
  }catch(error) {
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


//post with API working
router.post('/', async (req, res) => {
  try {
    const exists = await Book.findOne({ name: req.body.name, author: req.body.author });

    if (exists) {
      req.flash('error', 'Book already exists in the collection');
      return res.redirect('/books');
    }
    const newBook=new Book(req.body);
    newBook.owner=req.session.user._id;
    await newBook.save();
    req.flash('success', 'Book created successfully!');
    // res.redirect('/books');
    res.redirect(`books/${newBook._id}/edit`);

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


// More code experimenting more ways

//post new
// router.post('/', async (req, res) => {
//   try {
//       const exists = await Book.findOne({ name: req.body.name, author: req.body.author });

//     if (exists) {
//       req.flash('error', 'Book already exists in the collection');
//       return res.redirect('/books/new');
//     }
//     const newBook=new Book(req.body);
//     newBook.owner=req.session.user._id;
//     await newBook.save();
//     req.flash('success', 'Book created successfully!');
//     res.redirect('/books');

//   } catch (error) {
//     req.flash('error', 'Something went wrong');
//     res.redirect('/');
//   }
// });


// //adding new with API
// router.post('/search', async (req, res) => {
//   try {
//     // const exists = await Book.findOne({ name: req.body.name, author: req.body.author });

//     // if (exists) {
//     //   req.flash('error', 'Book already exists in the collection');
//     //   return res.redirect('/books');
//     // };
//     const newBook= new Book(req.body);
//     newBook.owner=req.session.user._id;
//     await newBook.save();
//     res.redirect('books/new.ejs',{
//       newBook,
//     });
   
//     // req.flash('success', 'Book created successfully!');
//     // res.redirect('/books');

//   } catch (error) {
//     req.flash('error', 'Something went wrong');
//     res.redirect('/');
//   }
// });

// router.post('/', async (req, res) => {
//   try {
//       const exists = await Book.findOne({ name: req.body.name, author: req.body.author });

//     if (exists) {
//       req.flash('error', 'Book already exists in the collection');
//       return res.redirect('/books/new');
//     }
//     const newBook=new Book(req.body);
//     newBook.owner=req.session.user._id;
//     await newBook.save();
//     req.flash('success', 'Book created successfully!');
//     res.redirect('/books');

//   } catch (error) {
//     req.flash('error', 'Something went wrong');
//     res.redirect('/');
//   }
// });