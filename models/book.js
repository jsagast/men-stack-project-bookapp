const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    author:{
        type: String,
        require:true,
    },
    description:{
        type:String,
        required: true,
    },
    genre:{
        type: String,
        required: true,
    },
    pages:{
        type: Number,
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    favoritedByUsers:{
        type: [mongoose.Schema.Types.ObjectId],
        required:false,
        ref:'User'
    },
    pulledByUsers:{
        type: [mongoose.Schema.Types.ObjectId],
        required:false,
        ref:'User'
    },
  });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

