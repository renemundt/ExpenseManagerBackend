var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var expenseHandler = require('./expense-handler')

const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
// const jwtAuthz = require('express-jwt-authz')
// const scopeCheck = jwtAuthz([ 'full_access' ]);

const authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://renemundt.eu.auth0.com/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: 'ExpenseManagerFrontends',
    // audience: 'http://localhost:8666/api',
    issuer: "https://renemundt.eu.auth0.com/",
    algorithms: ['RS256']
})

app.use(authCheck)
// app.use(authCheck, scopeCheck)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var router = express.Router()
expenseHandler(router)
app.use('/api', router)

var port = process.env.PORT || 8666
app.listen(port)

