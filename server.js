var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var expenseHandler = require('./expense-handler')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var router = express.Router()
expenseHandler(router)
app.use('/api', router)

var port = process.env.PORT || 8666
app.listen(port)
