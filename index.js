//dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environment');
const data = require('./lib/data')

// app objects- module scaffolding
const app = {};


// testing for file system
// data.delete('test','newfile',(err)=>{
//       console.log(err);
// });

// //configration
// app.config ={
//       port : 3000,
// };

// create server
app.createServer =()=>{
      const server = http.createServer(app.handleReqres);
      server.listen(environment.port,()=>{

            // console.log(`production environment ${process.env.NODE_ENV}`);

            console.log(`listening port ${environment.port}`);
      })
}

//handle request and response

app.handleReqres = handleReqRes;

//start server
app.createServer();
