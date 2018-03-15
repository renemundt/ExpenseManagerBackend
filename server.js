var express = require('express')
var http = require('http')
var WebSocket = require('ws')
var app = express()
var bodyParser = require('body-parser')
var expenseHandler = require('./expense-handler')
require('dotenv').config()

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
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})
app.use(authCheck)
// app.use(authCheck, scopeCheck)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var router = express.Router()
expenseHandler(router)
app.use('/api', router)

const server = http.createServer(app)

const wss = new WebSocket.Server({ server })

wss.on('connection', (ws) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);

        wss.clients
        .forEach(client => {
            if (client != ws) {
                client.send(`Hello, broadcast message -> ${message}`);
            }    
        });
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

var port = process.env.PORT || 8666

server.listen(port, () => {
    console.log(`Server started on port ${server.address().port} :)`);
})

// var port = process.env.PORT || 8666
// app.listen(port)

