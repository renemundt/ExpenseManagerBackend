var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ExpenseSchema = new Schema({
    amount: Number,
    store: String,
    created: Date,
    timeOfPurchase: Date,
    updated: Date,
    profile: {
        id: String,
        givenName: String
    }
})

module.exports = mongoose.model('Expense', ExpenseSchema)