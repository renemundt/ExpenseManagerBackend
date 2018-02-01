module.exports = (router) => {

    router.use((req, res, next) => {
        console.log('route: ', req.originalUrl)
        next()
    })

    let activeDataStore = require('config').get('active-data-store');

    let expenseRepository

    switch(activeDataStore){
        case 'mongo':
            expenseRepository = require('./mongo/expenses-mongo-repository')
            break
        case 'couch':
            expenseRepository = require('./couch/expenses-couch-repository')
            break
        default:
            expenseRepository = require('./lowdb/lowdb-repository')
            break
    }

    router.route('/expenses')

        .get((req, res) => {
            expenseRepository.GetExpenses(req, (err, result) => {
                sendResult(res, err, result)
            })
        })

        .post((req, res) => {
            expenseRepository.CreateExpense(req, (err, result) => {
                sendResult(res, err, result)
            })
        })

    router.route('/expenses/:expense_id')

        .get((req, res) => {
            expenseRepository.GetExpenseById(req, (err, result) => {
                sendResult(res, err, result)
            })
        })

        .put((req, res) => {
            expenseRepository.UpdateExpense(req, (err, result) => {
                sendResult(res, err, result)
            })
        })

        .delete((req, res) => {
            expenseRepository.DeleteExpense(req, (err, result) => {
                sendResult(res, err, result)
            })
        })
}

function sendResult(res, err, result) {
    if (err) res.send(err)
    else res.json(result)
}
