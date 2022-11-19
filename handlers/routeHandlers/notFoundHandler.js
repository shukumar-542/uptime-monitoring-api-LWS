//Not Found Handler

//module ScaffHolding

const handler = {};

handler.notFoundHandle =(requestProperties, callback) =>{
      console.log(requestProperties);
      callback(404,{
            message: 'Page Not found!'
      })
}

module.exports = handler;