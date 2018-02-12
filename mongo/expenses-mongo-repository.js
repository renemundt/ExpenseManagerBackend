var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID
var ModelMapper = require('./model-mapper')
var moment = require('moment')

let url = process.env.EM_MONGO_URL
let user = process.env.EM_MONGO_USER
let password = encodeURIComponent(process.env.EM_MONGO_PASSWORD)
var db

const mongoUrl = `mongodb://${user}:${password}@${url}`

MongoClient.connect(mongoUrl, function (err, client) {
    if (err) throw err
    db = client.db('expense-manager')
    console.log('Connected')
})

module.exports = {

    GetExpenses: (req, callback) => {

        console.log('process.env.EM_STORE', process.env.EM_STORE)

        let startDate = moment(req.query.startDate).toDate()
        let endDate = moment(req.query.endDate).toDate()

        if (startDate != null && endDate != null) {
            db.collection('expenses').find(
                { "timeOfPurchase": { "$gte": startDate, "$lt": endDate } }).toArray((err, expenses) => {
                    if (err) return callback(err, null)
                    callback(null, ModelMapper.MapExpenses(expenses))
                })
        } else {
            db.collection('expenses').find().toArray((err, expenses) => {
                if (err) return callback(err, null)
                callback(null, ModelMapper.MapExpenses(expenses))
            })
        }
    },

    GetExpenseById: (req, callback) => {
        db.collection('expenses').findOne({"_id": ObjectId(req.params.expense_id)}, (err, expense) => {
            if (err) return callback(err, null)
            callback(ModelMapper.MapExpense(expense))
        })
    },

    CreateExpense: (req, callback) => {
        req.body.created = new Date()
        req.body.amount = Number(req.body.amount)
        req.body.timeOfPurchase = moment.parseZone(req.body.timeOfPurchase).toDate()
        const expense = req.body

        db.collection('expenses').insertOne(expense,
            (err, result) => {
                if (err) { return callback(err, null); console.log('err creating expense', err)}
                callback(null, { message: 'Expense created' });
            }
        )
    },

    UpdateExpense: (req, callback) => {
        db.collection('expenses').updateOne(
            { "_id": ObjectId(req.body.id) },
            {
                $set: {
                    "amount": Number(req.body.amount),
                    "store": req.body.store,
                    "timeOfPurchase": moment.parseZone(req.body.timeOfPurchase).toDate(),
                    "updated": new Date()
                }
            }, (err, results) => {
                if (err) return callback(err, null)
                callback(null, { message: 'Expense updated' });
            }
        )
    },

    DeleteExpense: (req, callback) => {
        db.collection('expenses').deleteMany(
            {
                "_id": ObjectId(req.params.expense_id)
            }, (err, results) => {
                if (err) return callback(err, null)
                callback(null, { message: 'Expense deleted' })
            }
        )
    }

}
