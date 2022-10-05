const User = require('../models/userSchema');

const isAuthenticated = async function (req, res, next) {
	if (req.session.user == null) {
		res.redirect('/');
	} else {
		res.locals.user = await User.findById(req.session.user._id);
		next();
	}
}

module.exports = {
	isAuthenticated,
};