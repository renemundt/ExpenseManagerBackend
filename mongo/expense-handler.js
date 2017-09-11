var ExpensesRepository = require('./expenses-repository')

module.exports = (router) => {

    router.use((req, res, next) => {
        console.log('route: ', req.originalUrl)
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        res.header('Access-Control-Allow-Headers', 'Content-Type')
        next()
    })

    router.route('/expenses')

        .get((req, res) => {
            ExpensesRepository.GetExpenses(req, (err, result) => {
                sendResult(res, err, result)
            })
        })

        .post((req, res) => {
            ExpensesRepository.CreateExpense(req, (err, result) => {
                sendResult(res, err, result)
            })
        })

    router.route('/expenses/:expense_id')

        .get((req, res) => {
            ExpensesRepository.GetExpenseById(req, (err, result) => {
                sendResult(res, err, result)
            })
        })

        .put((req, res) => {
            ExpensesRepository.UpdateExpense(req, (err, result) => {
                sendResult(res, err, result)
            })
        })

        .delete((req, res) => {
            ExpensesRepository.DeleteExpense(req, (err, result) => {
                sendResult(res, err, result)
            })
        })
}

function sendResult (res, err, result) {
    if (err) res.send(err)
    res.json(result)
}
