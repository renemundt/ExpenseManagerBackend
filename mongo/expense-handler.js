var ExpensesRepository = require('./expenses-repository')

module.exports = (router) => {

    router.use((req, res, next) => {
        console.log('route: ', req.originalUrl)
        next()
    })

    router.route('/expenses')

        .get((req, res) => {
            ExpensesRepository.GetExpenses(req, (err, expenses) => {
                if (err) res.send(err)
                res.json(expenses)
            })
        })

        .post((req, res) => {
            ExpensesRepository.CreateExpense(req, (err, message) => {
                if (err) res.send(err)
                res.json(message)
            } )
        })

    router.route('/expenses/:expense_id')

        .get((req, res) => {
            ExpensesRepository.GetExpenseById(req, (err, expense) => {
                if (err) res.send(err)
                res.json(expense)
            })
        })

        .put((req, res) => {
            ExpensesRepository.UpdateExpense(req, (err, message) => {
                if (err) res.send(err)
                res.json(message)
            })
        })

        .delete((req, res) => {
            ExpensesRepository.DeleteExpense(req, (err, message) => {
                if (err) res.send(err)
                res.json(message)
            })
        })

}
