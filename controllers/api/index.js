const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const bookRoutes = require('./book-routes');
const quoteRoutes = require('./quote-routes');

router.use('/users', userRoutes);
router.use('/book', bookRoutes);
router.use('/quote', quoteRoutes);

module.exports = router;