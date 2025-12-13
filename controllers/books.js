
const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Book = require('../models/book.js');
// const BookClub=require('../models/bookclub.js')

router.get('/', async (req, res) => {
   try {
    // const populatedRecipes = await Recipe.find({}).populate('owner').populate('ingredients');
    const books = await Book.find().populate('owner');
    // res.render ('books/index.ejs');
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
    const newBook=new Book(req.body);
    newBook.owner=req.session.user._id
    await newBook.save();
    res.redirect('/books');
  } catch (error) {
    console.log(error);
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

// POST add to shelf
router.post('/:bookId/pulled-by/:bookId', async (req, res) => {
    try {
        await Book.findByIdAndUpdate(req.params.bookId, {
            $push: { pulledByUsers:req.params.userId },
        })
        res.redirect(`/books/${req.params.bookId}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// //delete
// router.delete('/:recipeId', async (req, res) => {
//   try {
//     const recipe = await Recipe.findById(req.params.recipeId);
//     // if (listing.owner.equals(req.session.user._id)) {// for future improvements
//     await recipe.deleteOne();
//     res.redirect('/recipes');
//   // }
//   } catch (error) {
//     console.error(error);
//     res.redirect('/');
//   }
// });

// router.get('/:recipeId/edit', async (req, res) => {
//   try {
//     const currentRecipe = await Recipe.findById(req.params.recipeId);
//     const ingredients=await Ingredient.find()
//     res.render('recipes/edit.ejs', {
//       recipe: currentRecipe,
//       ingredients:ingredients
//     });
//   } catch (error) {
//     console.log(error);
//     res.redirect('/');
//   }
// });


// router.put('/:recipeId', async (req, res) => {
//   try {
//     const currentRecipe = await Recipe.findById(req.params.recipeId);
//     // if (currentListing.owner.equals(req.session.user._id)) {
//     currentRecipe.set(req.body);// to update
//     await currentRecipe.save();
//     res.redirect('/recipes');
//     // } else {
//     //   res.send("You don't have permission to do that.");
//     // }
//   } catch (error) {
//     console.log(error);
//     res.redirect('/');
//   }
// });

module.exports = router;
