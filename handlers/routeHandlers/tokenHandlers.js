//Dependencies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {randomString} =  require('../../helpers/utilities');
const {parseJSON} =  require('../../helpers/utilities');
const { now } = require('lodash');


//module scaffolding
const handler ={};

handler.tokenHandlers =(requestProperties, callback)=>{
      const acceptedMethods = ['get','post','put','delete'];
      if(acceptedMethods.indexOf(requestProperties.method) > -1){
            handler._token[requestProperties.method](requestProperties,callback);
      }else{
            callback(405);
      }
}
handler._token ={};
handler._token.post=(requestProperties, callback)=>{
      const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
      const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
      
      if(phone && password){
            data.read('users',phone,(err,userData)=>{
                  const d = parseJSON(userData)
                  let hashPassword = hash(password);
                  
                  if(hashPassword === d.password){
                        const tokenId = randomString(20);
                        const expire = Date.now() + 60*60*1000;
                        const tokenObjects ={
                              phone,
                              id: tokenId,
                              expire
                        }
                        data.create('tokens',tokenId,tokenObjects,(err)=>{
                              if(!err){
                                    callback(200,tokenObjects)
                              }else{
                                    callback(400,{
                                          error: 'problem in server site'
                                    })
                              }
                        })
                  }else{
                        callback(400,{
                              error:"password invalid!"
                        })
                  }

            })
      }else{
            callback(400,{
                  error:'problem in your request'
            })
      }
}
handler._token.get=(requestProperties, callback)=>{
      const id = typeof(requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length > 0 ? requestProperties.queryStringObject.id : false;

      if(id){
            data.read('tokens',id,(err,tokenData)=>{
                  const token = {...parseJSON(tokenData)}
                  if(!err){
                        callback(200,token)
                  }else{
                        callback(404,{error: 'request user not found!'})
                  }
            })
      }
}
handler._token.put=(requestProperties, callback)=>{

      const id = typeof(requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;
      const extend = typeof(requestProperties.body.extend) === 'boolean' && requestProperties.body.extend === true ? true : false;
      
      if(id && extend){
            data.read('tokens',id,(err,tokenData)=>{
                  let tokenObject = parseJSON(tokenData);
                  if(tokenObject.expire > Date.now()){
                        tokenObject.expire = Date.now() + 60*60*1000;
                        data.update('tokens',id,tokenObject,(err)=>{
                              if(!err){
                                    callback(200)
                              }else{
                                    callback(400,{
                                          error:"there was problem in server site"
                                    })
                              }
                        })
                  }else{
                        callback(400,{
                              error: 'already expired!'
                        })
                  }
            })
      }else{
            callback(400,{
                  error: 'request user not found!'
            })
      }

}
handler._token.delete=(requestProperties, callback)=>{
      //Check the token is valid
      const id = typeof(requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

      if(id){
            data.read('tokens',id,(err,tokenData)=>{
                  if(!err && tokenData){
                        data.delete('tokens',id,(err)=>{
                              if(!err){
                                    callback(200,{
                                          message: 'user delete successfully!'
                                    })
                              }else{
                                    callback(400,{
                                          error: 'problem in server site!'
                                    })
                              }
                        })
                  }else{
                        callback(404,{
                              error: 'token is not valid!'
                        })
                  }
            })
      }
      
}

//token varification function

handler._token.verify = (id,phone, callback)=>{
      data.read('tokens',id,(err,tokenData)=>{
            if(!err && tokenData){
                  if(parseJSON(tokenData).phone === phone && parseJSON(tokenData).expire > Date.now()){
                        callback(true);
                  }else{
                        callback(false);
                  }
            }else{callback(false)}
      })
}

module.exports = handler;

