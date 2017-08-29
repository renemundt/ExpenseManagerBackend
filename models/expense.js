var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ExpenseSchema = new Schema({
    amount: Number,
    created: Date,
    updated: Date,
    store: String,
    profile: {
        id: String,
        givenName: String
    }
})

module.exports = mongoose.model('Expense', ExpenseSchema)