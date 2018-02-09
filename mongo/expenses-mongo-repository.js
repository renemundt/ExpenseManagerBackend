var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID
var ModelMapper = require('./model-mapper')
var moment = require('moment')

let url = require('config').get('data-store.mongo.url')
let user = require('config').get('data-store.mongo.user')
let password = encodeURIComponent(require('config').get('data-store.mongo.password'))
var db

const fuckingPassword = encodeURIComponent('bVCYlcjXK2LheeZZXZDA1QwqfvHsGA3afQG35PzKx7AaOGw0xv6jj0APDhnyi7AY8GlmeoXyYR1BJBAnUs9pgA==')
let  fuckingUrl ='mongodb://expensemanagercosmosdb:' + fuckingPassword +'@expensemanagercosmosdb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb'

const mongoUrl = `mongodb://${user}:${password}@${url}`

MongoClient.connect(mongoUrl, function (err, client) {
    if (err) throw err
    db = client.db('expense-manager')
    console.log('Connected')
})

module.exports = {

    GetExpenses: (req, callback) => {

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
