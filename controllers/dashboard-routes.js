const router = require('express').Router();
const { Book, User, Quote } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Book.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'title',
            'author',
            'created_at'
        ],
        include: [
            {
                model: Quote,
                attributes: ['id', 'quote', 'page_number', 'speaker', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbBookData => {
        const books = dbBookData.map(book => book.get({ plain: true }))
        res.render('dashboard', { books, loggedIn: true })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})


module.exports = router;