var mongoose = require('mongoose')
var moment = require('moment')
var Expense = require('./models/expense')
var Expense = require('./models/expense')
var ModelMapper = require('./model-mapper')

mongoose.Promise = require('bluebird')

// mongoose.connect('mongodb://em_user:pwd4Mlab@ds119524.mlab.com:19524/expense-manager')
let connectionString = require('config').get('data-store.mongo.url');
mongoose.connect(connectionString)

var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    // we are connected
})

module.exports = {

    GetExpenses: (req, callback) => {

        let startDate = req.query.startDate
        let endDate = req.query.endDate

        if (startDate != null && endDate != null) {
            Expense.find({ 'created': { '$gte': startDate, '$lt': endDate } }, (err, expenses) => {
                if (err) return callback(err, null)
                callback(null, ModelMapper.MapExpenses(expenses))
            })
        }
        else {
            Expense.find((err, expenses) => {
                if (err) return callback(err, null)
                callback(null, ModelMapper.MapExpenses(expenses))
            })
        }
    },

    GetExpenseById: (req, callback) => {
        Expense.findById(req.params.expense_id, (err, expense) => {
            if (err) return callback(err, null)
            callback(ModelMapper.MapExpense(expense))
        })
    },

    CreateExpense: (req, callback) => {
        var expense = new Expense()
        expense.created = new Date()
        expense.amount = req.body.amount
        expense.store = req.body.store
        expense.profile.id = 'xxxxxx'
        expense.profile.givenName = 'René Mundt'

        expense.save((err) => {
            if (err) return callback(err, null)
            callback(null, { message: 'Expense created' })
        })
    },

    UpdateExpense: (req, callback) => {
        Expense.findById(req.params.expense_id, (err, expense) => {
            if (err) return callback(err, null)
            expense.updated = new Date()
            expense.amount = req.body.amount
            expense.store = req.body.store

            expense.save((err) => {
                if (err) return callback(err, null)
                callback(null, { message: 'Expense updated' })
            })
        })
    },

    DeleteExpense: (req, callback) => {
        Expense.remove({ _id: req.params.expense_id }, (err) => {
            if (err) return callback(err, null)
            callback(null, { message: 'Expense deleted' })
        })
    }

}
