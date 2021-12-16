const router = require('express').Router();
const { User, Book, Quote } = require("../../models");
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    User.findAll({
        exclude: ['password']
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Book,
                attribute: ['id', 'title', 'author', 'created_at']
            },
            {
                model: Quote,
                attribute: ['id', 'quote', 'page_number', 'speaker', 'user_id', 'book_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'no user found' })
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => {
            req.session.save(() => {
                    req.session.user_id = dbUserData.id,
                    req.session.username = dbUserData.username,
                    req.session.loggedIn = true;

                res.json(dbUserData)
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500)
        })
})

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'User not found' })
                return;
            }
            // uses the instance method created in the User model to check passwords
            const validPassword = dbUserData.checkPassword(req.body.password);

            if (!validPassword) {
                res.status(400).json({ message: 'Incorrect password' })
                return;
            }

            req.session.save(() => {
                // declare all the session variables
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json({ user: dbUserData, message: 'You are now logged in' })
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

// Log a user out
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end()
        })
    } else {
        res.status(404).end()
    }
})

router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this ID' })
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        });
});


module.exports = router;