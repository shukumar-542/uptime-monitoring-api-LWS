//sample handlers

//module scaffolding
const handler ={};

handler.samplaHandlers =(requestProperties, callback)=>{
      console.log(requestProperties);
      callback(200,{
            message : 'this is sample page!'
      })
}

module.exports = handler;
