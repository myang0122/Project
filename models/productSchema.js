const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    url: String,
    info: String,
});

module.exports = mongoose.model('Product', productSchema);