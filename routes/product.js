const express = require('express');
const router = express.Router();
const Product = require('../models/productSchema');
const {isAuthenticated} = require('../middleware/auth');
const {productValidation} = require('../middleware/product');
const User = require('../models/userSchema');


router.get('/:id', productValidation, async function(req, res, next) {
    res.render('product', {
    	user: res.locals.user, 
    	page: 'home', 
    	product: res.locals.product
    });
});

router.post('/:id/addToCart', isAuthenticated, productValidation, async function(req, res, next) {
	let count = parseInt(req.body.count);
	if (count <= 0) {
		return res.redirect('/');
	}

	// const user = await User.findById('633b6ab8a6855d09efa79886');
	const user = res.locals.user;
	const productID = req.params.id;

	if (user.cart.has(productID)) {
		count += user.cart.get(productID);
	}
	user.cart.set(productID, count);

	await user.save();
	console.log("successfull add to cart");
    res.end();
});

module.exports = router;