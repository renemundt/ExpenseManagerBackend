module.exports = (router) => {

    var bodyParser = require('body-parser')
    var mongoose = require('mongoose')
    var Expense = require('./models/expense')

    mongoose.Promise = require('bluebird')

    mongoose.connect('mongodb://localhost/expense-manager')

    var db = mongoose.connection

    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', () => {
        // we are connected
    })

    router.use((req, res, next) => {
        console.log('route: ', req.originalUrl)
        next()
    })

    router.route('/expenses')

        .get((req, res) => {
            Expense.find((err, expenses) => {
                if (err)
                    res.send(err)
                res.json(expenses)
            })
        })

        .post((req, res) => {
            var expense = new Expense()
            expense.created = new Date()
            expense.amount = req.body.amount
            expense.store = req.body.store
            expense.profile.id = 'xxxxxx'
            expense.profile.givenName = 'René Mundt'

            expense.save((err) => {
                if (err)
                    res.send(err)
                res.json({ message: 'Expense created' })
            })
        })

    router.route('/expenses/:expense_id')

        .get((req, res) => {
            Expense.findById(req.params.expense_id, (err, expense) => {
                if (err)
                    res.send(err)
                res.json(expense)
            })
        })

        .put((req, res) => {
            Expense.findById(req.params.expense_id, (err, expense) => {
                if (err)
                    res.send(err)
                expense.updated = new Date()
                expense.amount = req.body.amount
                expense.store = req.body.store

                expense.save((err) => {
                    if (err)
                        res.send(err)
                    res.json({ message: 'Expense updated' })
                })
            })
        })

        .delete((req, res) => {
            Expense.remove({
                _id: req.params.expense_id
            }, (err) => {
                if (err)
                    res.send(err)
                res.json('Expense deleted')
            })
        })

}
