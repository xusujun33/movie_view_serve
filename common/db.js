const mongoose = require('mongoose');
const url = 'mongodb://localhost/movieServer';
mongoose.connect(url);

module.exports = mongoose;