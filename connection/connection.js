const mongoose = require('mongoose');

const uri = 'mongodb+srv://dhavaldubariya35:vpWSh9kJxMm7crda@dvdp.qcjhzaz.mongodb.net/yash_indus'; // or your MongoDB connection string

const db = mongoose.connect(uri).then(()=> {
  console.log('Connected to MongoDB')
}).catch((error)=>{
  console.log(error)
});

module.exports = {
  db:db
} 