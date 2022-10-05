const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const {ObjectId} = require('mongodb');

const userSchema = new mongoose.Schema({
    username: {
    	type: String, 
    	unique: true,
    },
    password: String, 
    email: {
    	type: String, 
    	unique: true,
    },
    cart: {
    	type: Map,
    	of: Number,
    	default: new Map([]),
	},
    orders: [{
    	items: {
    		type: Map,
    		of: Number,
    	},
    	name: String,
    	phone: String,
    	email: String,
    	billing_address: String,
    	shipping_address: String,
    	payment_method: String,
    	status: String,
	}],
});

userSchema.pre("save", async function(next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);