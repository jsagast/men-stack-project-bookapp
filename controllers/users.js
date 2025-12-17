const express = require('express')
const router = express.Router()
const Book= require('../models/book.js')
const BookClub=require('../models/bookclub.js')

//Profile Main Page
router.get('/profile', async (req, res) => {
    try {
    
        const myShelf = await Book.find({pulledByUsers: req.session.user._id}).populate('owner');

        const myBooks = await Book.find({owner: req.session.user._id}).populate('owner');

        const myFavoriteBooks = await Book.find({favoritedByUsers: req.session.user._id}).populate('owner');

        const myBookClubs=await BookClub.find({members:req.session.user._id,}).populate ('owner');
        
        res.render('profile/show.ejs', {
            myShelf,
            myBooks,
            myFavoriteBooks,
            myBookClubs,
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

module.exports = router

