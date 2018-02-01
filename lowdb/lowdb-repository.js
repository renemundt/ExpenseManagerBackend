const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid')
const moment = require('moment')
 
const adapter = new FileSync('db.json')
const db = low(adapter)
  
module.exports = {

    GetExpenses: (req, callback) => {

        let startDate = moment.parseZone(req.query.startDate)
        let endDate = moment.parseZone(req.query.endDate)

        let expenses = db.get('expenses').value()       

        if (startDate != null && endDate != null) {
            let expensesFiltered = expenses.filter(e => {
                if (moment.parseZone(e.timeOfPurchase).isAfter(startDate) && moment.parseZone(e.timeOfPurchase).isBefore(endDate)) {
                    return e
                }
            })
            callback(null, expensesFiltered)            
        }
        else {
            callback(null, expenses)
        }
    },

    GetExpenseById: (req, callback) => {
        var expense = db.get('expenses')
            .find({ id: req.params.expense_id })
            .value()
        callback(expense)
    },

    CreateExpense: (req, callback) => {
        req.body.id = shortid.generate()
        req.body.created = new Date()
        req.body.amount = Number(req.body.amount)
        
        db.get('expenses')
            .push(req.body)
            .write()
        callback(null, { message: 'Expense created' })
    },

    UpdateExpense: (req, callback) => {
        req.body.updated = new Date()
        req.body.amount = Number(req.body.amount)
        db.get('expenses')
            .find({ id: req.params.expense_id}) // remember to refactor expense_id
            .assign(req.body)
            .write()
        callback(null, { message: 'Expense updated' })
    },

    DeleteExpense: (req, callback) => {
        db.get('expenses')
            .remove({ id: req.params.expense_id}) 
            .write()
        callback(null, { message: 'Expense deleted' })
    }

}
