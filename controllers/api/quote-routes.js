const router = require('express').Router();
const { Quote } = require('../../models');

router.get('/', (req, res) => {
    Quote.findAll()
        .then(dbQuoteData => res.json(dbQuoteData))
        .catch(err => res.json(err))
});

router.post('/', (req, res) => {
        Quote.create({
            quote: req.body.quote,
            page_number: req.body.page_number,
            speaker: req.body.speaker,
            user_id: req.body.user_id,
            book_id: req.body.book_id
        })
            .then(dbQuoteData => res.json(dbQuoteData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
});

router.delete('/:id', (req, res) => {
    Quote.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbQuoteData => {
            if (!dbQuoteData) {
                res.status(404).json({ message: 'Quote not found' })
                return
            }
            res.json(dbQuoteData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

module.exports = router;