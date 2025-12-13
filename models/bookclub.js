const mongoose=require('mongoose');

const bookClubSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    members:{
        type: [mongoose.Schema.Types.ObjectId],
        required:false,
        ref:'User'
    },
    shelf:{
        type: [mongoose.Schema.Types.ObjectId],
        required:false,
        ref:'Book'
    }
  })
  
const BookClub = mongoose.model('BookClub', bookClubSchema);

module.exports = BookClub;

