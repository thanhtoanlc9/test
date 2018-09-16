const Blog = require('mongoose').model('Blog');

exports.getBlogList = async(req, res, next) => {

    try {
        const listBlog = await Blog
            .find({})
            .where('category_id').in(['1', '2', '3', '4', '5', '6'])
            .select('_id seo_url title category_id')
            .exec();

        res.json(listBlog);

    } catch (err) {
        next(err);
    }

}