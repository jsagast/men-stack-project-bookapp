const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    instructions:{
        type:String,
        required: false,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    ingredients:{
        type: [mongoose.Schema.Types.ObjectId],
        required:false,
        ref:'Ingredient'
    },
  });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;

