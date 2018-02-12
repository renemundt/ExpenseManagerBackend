var request = require('request')
var modelMapper = require('./couch-model-mapper')

let baseUrl = process.env.EM_COUCH_URL

module.exports = {

    GetExpenses: (req, callback) => {

        let startDate = req.query.startDate
        let endDate = req.query.endDate

        if (startDate != null && endDate != null) {
            let url = `${baseUrl}/_design/timestamp/_view/expenses-view?startdate="${startDate}"&enddate="${endDate}"&include_docs=true`
            // url = `${baseUrl}/_design/timestamp/_view/expenses-view?startdate="2016-08-31T23:59:59.000Z"&enddate="2017-09-30T23:59:59.000Z"&include_docs=true`

            request.get({ url }, (error, response, body) => {
                if (error) return callback(error, null)
                callback(null, modelMapper.MapExpenses(JSON.parse(body).rows.map(x => x.doc)))
            })
        }
    },

    GetExpenseById: (req, callback) => {
        const url = `${baseUrl}/${req.params.expense_id}`
        request.get({ url }, (error, response, body) => {
            if (error) return callback(error, null)
            callback(null, modelMapper.MapExpense(JSON.parse(body)))
        })
    },

    CreateExpense: (req, callback) => {
        req.body.created = new Date()
        request.post({
            url: baseUrl,
            body: req.body,
            json: true
        }, (error, response, body) => {
            if (error) return callback(error, null)
            callback(null, { message: "Expense created" })
        })
    },


    UpdateExpense: (req, callback) => {
        const url = `${baseUrl}/${req.params.expense_id}`
        req.body.updated = new Date()
        request.get({ url }, (error, response, body) => {
            var rev = JSON.parse(body)._rev
            req.body._rev = rev
            request.put({
                url,
                body: req.body,
                json: true
            }, (error, response, body) => {
                if (error) return callback(error, null)
                callback(null, { message: "Expense updated" })
            })
        })
    },

    DeleteExpense: (req, callback) => {
        let url = `${baseUrl}/${req.params.expense_id}`
        request.get({ url }, (error, response, body) => {
            var bodyParsed = JSON.parse(body)
            url = `${baseUrl}/${req.params.expense_id}?rev=${bodyParsed._rev}`
            request.delete({
                url,
                json: true
            }, (error, response, body) => {
                if (error) return callback(error, null)
                callback(null, { message: "Expense deleted" })
            })
        })
    }
}
