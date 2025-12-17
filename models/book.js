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
    },
    genre:{
        type: String,
    },
    pages:{
        type: Number,
    },
    coverURL:{
        type: String,
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

