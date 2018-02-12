module.exports = (router) => {

    router.use((req, res, next) => {
        console.log('route: ', req.originalUrl)
        next()
    })

    let activeDataStore = process.env.EM_STORE

    let expenseRepository

    switch(activeDataStore){
        case 'mongo':
            expenseRepository = require('./mongo/expenses-mongo-repository')
            break
        case 'couch':
            expenseRepository = require('./couch/expenses-couch-repository')
            break
        case 'lowdb':
            expenseRepository = require('./lowdb/lowdb-repository')
            break
        default:
            throw `NO OR WRONG DATA STORE TYPE PROVIDED: ${activeDataStore}`
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

    router.route('/health')

        .get((req, res) => {
            res.send('All is ok!')
        })
}

function sendResult(res, err, result) {
    if (err) res.send(err)
    else res.json(result)
}
