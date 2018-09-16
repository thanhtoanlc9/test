const mongoose = require('mongoose');

// define the User model schema
const BlogSchema = new mongoose.Schema({
    title: { type: String, maxlength: 255 },
    seo_url: { type: String, maxlength: 255, unique: true },
    content: String,
    category_id: String,
    created_at: {type: Date, default: Date.now()},
}, { collection: 'blogs' });

module.exports = mongoose.model('Blog', BlogSchema);