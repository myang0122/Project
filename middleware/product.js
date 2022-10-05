const Product = require('../models/productSchema');

const productValidation = async function (req, res, next) {
	const productID = req.params.id;
	try {
    	const product = await Product.findById(productID);
    	if (product != null) {
    		res.locals.product = product;
    		next();
    	} else {
    		res.redirect('/');
    	}
    } catch (e) {
    	console.log(e);
    	res.redirect('/');
    }
}

module.exports = {
	productValidation,
};