const router = require('express').Router();
const { User, Book, Quote } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Book.findAll({
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Quote,
                attributes: ['id', 'quote', 'page_number', 'speaker', 'user_id', 'book_id'],
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
    .then(dbBookData => res.json(dbBookData))
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

router.get('/:id', (req, res) => {
    Book.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Quote,
                attributes: ['id', 'quote', 'page_number', 'speaker', 'user_id', 'book_id'],
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
            if (!dbBookData) {
                res.status(404).json({ message: 'There is no book with this ID' })
                return
            }
            res.json(dbBookData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.post('/', withAuth, (req, res) => {
    Book.create({
        title: req.body.title,
        author: req.body.author,
        user_id: req.session.user_id
    })
    .then(dbBookData => res.json(dbBookData))
    .catch(err => {
        console.log(err)
        res.status(500).json(dbBookData)
    })
})

router.delete('/:id', withAuth, (req, res) => {
    Book.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbBookData => {
        if (!dbBookData) {
            res.status(404).json({message: 'There is not book with this id'})
            return
        }
        res.json(dbBookData)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

module.exports = router;