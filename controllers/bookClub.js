const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/book.js');
const Ingredient=require('../models/bookclub.js')

router.get('/', async (req, res) => {
    const ingredients=await Ingredient.find()
    res.render('ingredients/index-new.ejs',{ingredients: ingredients});
});

router.post('/', async (req, res) => {
  try {
    const exists= await Ingredient.findOne({ name: req.body.name });
    !exists? await Ingredient.create(req.body): null;
    // await Ingredient.create(req.body);
    res.redirect('/ingredients');
  } catch (error) {
    console.log(error);
    res.redirect('/ingredients');
  }
});


module.exports = router;

