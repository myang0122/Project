const express = require('express');
const router = express.Router();
const Product = require('../models/productSchema');
const {isAuthenticated} = require('../middleware/auth');
const {productValidation} = require('../middleware/product');
const User = require('../models/userSchema');


router.get('/cart', isAuthenticated, async function(req, res, next) {
	// const user = await User.findById('633b6ab8a6855d09efa79886');
	const user = res.locals.user;
	const items = await getOrderDetails(user.cart);
    res.render('cart', {
    	user: user, 
    	page: 'cart', 
    	items: items,
    });
});

router.get('/order', isAuthenticated, async function(req, res, next) {
	// const user = await User.findById('633b6ab8a6855d09efa79886');
	const user = res.locals.user;

	const orders = [];
	for (let i = 0; i < user.orders.length; i++) {
		const order = user.orders[i].toObject();
		const {items, ...others} = order;
		let details = await getOrderDetails(items);
		details = details.map(detail => {
			return {
				itemName: detail.product.name,
				itemCount: detail.itemCount,
			};
		});
		orders.push({
			...others,
			items: details,
		});
	}

	res.render('order', {
    	user: user, 
    	page: 'order', 
    	orders: orders,
    });
});

router.post('/order', isAuthenticated, async function(req, res, next) {
	// const user = await User.findById('633b6ab8a6855d09efa79886');
	const user = res.locals.user;

	if (user.cart.size > 0) {
		user.orders.push({
	  		items: user.cart,
	  		name: req.body.name,
	    	phone: req.body.phone,
	    	email: req.body.email,
	    	billing_address: req.body.billing,
	    	shipping_address: req.body.shipping,
	    	payment_method: req.body.paymentMethod,
	    	status: 'Pending',
	  	});
	  	user.cart = new Map();

  		await user.save();
	}
  	
    res.end();
});

async function getOrderDetails(orders) {
	const items = [];
	if (orders == null) {
		return items
	}

	for (const [productID, itemCount] of orders) {
		const product = await Product.findById(productID);
		items.push({
			product: product,
			itemCount: itemCount,
		});
	}
	return items;
}

module.exports = router;