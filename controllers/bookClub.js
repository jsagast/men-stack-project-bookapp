const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Book = require('../models/book.js');
const BookClub=require('../models/bookclub.js')

router.get('/', async (req, res) => {
   try {
    const bookClubs = await BookClub.find().populate('owner');
    res.render('bookclubs/index.ejs',{
      bookClubs,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

//Get for New
router.get('/new', async(req,res)=>{
    const bookClubs=await BookClub.find();
    const books=await Book.find();
    res.render('bookclubs/new.ejs',{
      bookClubs,
      books,
    });
});

//post new
router.post('/', async (req, res) => {
  try {
      const exists = await BookClub.findOne({ name: req.body.name});

    if (exists) {
      req.flash('error', 'Book Club name is already taken');
      return res.redirect('/bookclubs/new');
    }
    const newBookClub=new BookClub(req.body);
    newBookClub.owner=req.session.user._id;
    await newBookClub.save();
    req.flash('success', 'Club created successfully!');
    res.redirect('/bookclubs');

  } catch (error) {
    req.flash('error', 'Something went wrong');
    res.redirect('/');
  }
});


//show club detail
router.get('/:bookclubId', async (req, res) => {
  try {
    const bookClub = await BookClub.findById(req.params.bookclubId).populate('owner').populate('shelf').populate('members');
    const books=await Book.find();
    const userHasJoined = bookClub.members.some((user) =>
      user.equals(req.session.user._id)
    );
    res.render('bookclubs/show.ejs', {
      bookClub, 
      userHasJoined,
      books
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


//Delete
router.delete('/:bookclubId', async (req, res) => {
    try {
        const bookClub = await BookClub.findById(req.params.bookclubId)
        if (bookClub.owner.equals(req.session.user._id)) {
            await bookClub.deleteOne();
            req.flash('success', 'Book has been removed successfully!');
            res.redirect('/bookclubs');
        } else {
            res.send("You don't have permission to do that.")
        }
    } catch (error) {
        console.error(error)
        res.redirect('/')
    }
});

// POST JOIN GROUP
router.post('/:bookclubId/joined-by/:userId', async (req, res) => {
    try {
        await BookClub.findByIdAndUpdate(req.params.bookclubId, {
            $push: { members: req.params.userId },
        })
        res.redirect(`/bookclubs/${req.params.bookclubId}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});


router.delete('/:bookclubId/joined-by/:userId', async (req, res) => {
    try {
        await BookClub.findByIdAndUpdate(req.params.bookclubId, {
            $pull: { members: req.params.userId },
        })
        res.redirect(`/bookclubs/${req.params.bookclubId}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});

//Delete Book
router.delete('/:bookclubId/:bookId', async (req, res) => {
    try {
        await BookClub.findByIdAndUpdate(req.params.bookclubId, {
            $pull: { shelf: req.params.bookId },
        })
        res.redirect(`/bookclubs/${req.params.bookclubId}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});

//Add Book

router.post('/:bookclubId', async (req, res) => {
    try {
        await BookClub.findByIdAndUpdate(req.params.bookclubId, {
            // $push: { shelf: req.body.bookId},
            $addToSet:{shelf: req.body.bookId},
        })
        res.redirect(`/bookclubs/${req.params.bookclubId}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});

//update frequency

router.put('/:bookclubId', async (req, res) => {
    try {
        const currentBookClub=await BookClub.findById (req.params.bookclubId);
        currentBookClub.frequency = req.body.frequency;
        await currentBookClub.save();
        res.redirect(`/bookclubs/${req.params.bookclubId}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});

module.exports = router;

