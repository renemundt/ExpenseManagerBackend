var Expense = require('./models/expense')
var ModelMapper = require('./model-mapper')

module.exports = {

    GetAllExpenses: function (callback) {
        Expense.find((err, expenses) => {
            if (err) return callback(err, null)
            callback(null, ModelMapper.MapExpenses(expenses))
        })
    }
}