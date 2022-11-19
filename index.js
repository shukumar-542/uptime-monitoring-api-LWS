//dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes')

// app objects- module scaffolding
const app = {};

//configration
app.config ={
      port : 3000,
};

// create server
app.createServer =()=>{
      const server = http.createServer(app.handleReqres);
      server.listen(app.config.port,()=>{
            console.log(`listening port ${app.config.port}`);
      })
}

//handle request and response

app.handleReqres = handleReqRes;

//start server
app.createServer();
