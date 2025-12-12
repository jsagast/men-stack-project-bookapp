
const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient=require('../models/ingredient.js')

router.get('/', async (req, res) => {
   try {
    const populatedRecipes = await Recipe.find({}).populate('owner').populate('ingredients');
    res.render('recipes/index.ejs',{
      recipes:populatedRecipes,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/new', async(req,res)=>{
    const ingredients=await Ingredient.find()
    res.render('recipes/new.ejs',{
      ingredients:ingredients,
    });
});

//new recipe
router.post('/', async (req, res) => {
  try {
    const newRecipe=new Recipe(req.body);
    // console.log(newRecipe);
    newRecipe.owner=req.session.user._id
    await newRecipe.save();
    res.redirect('/recipes');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

//show
router.get('/:recipeId', async (req, res) => {
  try {
    const populatedRecipes = await Recipe.findById(req.params.recipeId).populate('owner').populate('ingredients');
    res.render('recipes/show.ejs', {
      recipe: populatedRecipes,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

//delete
router.delete('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    // if (listing.owner.equals(req.session.user._id)) {// for future improvements
    await recipe.deleteOne();
    res.redirect('/recipes');
  // }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.get('/:recipeId/edit', async (req, res) => {
  try {
    const currentRecipe = await Recipe.findById(req.params.recipeId);
    const ingredients=await Ingredient.find()
    res.render('recipes/edit.ejs', {
      recipe: currentRecipe,
      ingredients:ingredients
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


router.put('/:recipeId', async (req, res) => {
  try {
    const currentRecipe = await Recipe.findById(req.params.recipeId);
    // if (currentListing.owner.equals(req.session.user._id)) {
    currentRecipe.set(req.body);// to update
    await currentRecipe.save();
    res.redirect('/recipes');
    // } else {
    //   res.send("You don't have permission to do that.");
    // }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
