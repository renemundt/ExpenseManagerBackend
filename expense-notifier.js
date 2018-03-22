module.exports = (server) => {

    var WebSocket = require('ws')
    
    const wss = new WebSocket.Server({ server })
    
    wss.on('connection', (ws) => {
    
        //connection is up, let's add a simple simple event
        ws.on('message', (message) => {
    
            //log the received message and send it back to the client
            console.log('received: %s', message)
    
            wss.clients
            .forEach(client => {
                if (client != ws) {
                    client.send(`An expense with amount ${message} has changed, please update`)
                }    
            })
        })
    
        //send immediatly a feedback to the incoming connection    
        ws.send(`Must update`)
    })
    
}
