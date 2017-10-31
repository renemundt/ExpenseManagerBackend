module.exports = (router) => {

    router.use((req, res, next) => {
        console.log('route: ', req.originalUrl)
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        next()
    })

    let activeDataStore = require('config').get('active-data-store');

    let expenseRepository = activeDataStore == 'mongo' ? require('./mongo/expenses-mongo-repository') : require('./couch/expenses-couch-repository')

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
