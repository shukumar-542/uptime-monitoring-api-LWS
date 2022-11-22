//Dependencies
const data = require('../../lib/data');
const {parseJSON,randomString} = require('../../helpers/utilities');
const  tokenHandler = require('./tokenHandlers');
const {maxCheck} = require('../../helpers/environment')

//module scaffHolding

const handler ={};

handler.checkHandlers=(requestProperties, callback)=>{
      const acceptedMethods = ['get','post','put','delete'];
      if(acceptedMethods.indexOf(requestProperties.method) > -1){
            handler._check[requestProperties.method](requestProperties, callback)
      }else{
            callback(405);
      }
      
}
handler._check={};
handler._check.post = (requestProperties, callback)=>{
      // validation inputs
      const protocol = typeof(requestProperties.body.protocol) === 'string' && ["https","http"].indexOf(requestProperties.body.protocol) >-1 ? requestProperties.body.protocol :false;
      const url  = typeof(requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url :false;
      const method = typeof(requestProperties.body.method) === 'string' && ["POST","GET","PUT","DELETE"].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method :false;
      const successCode = typeof(requestProperties.body.successCode) === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode  :false;
      const timeOutSeconds = typeof(requestProperties.body.timeOutSeconds) === 'number' && requestProperties.body.timeOutSeconds % 1 === 0 && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <=5 ?requestProperties.body.timeOutSeconds :false;

     
      
      if(protocol && url && method && successCode && timeOutSeconds){
            const token = typeof(requestProperties.headerObjects.token) === 'string' ? requestProperties.headerObjects.token :false;
            //lookup the user phone by tohr token
            data.read('tokens',token,(err,tokenData)=>{
                  if(!err && tokenData){
                        const userPhone = parseJSON(tokenData).phone;
                        //lookup the user data
                        data.read('users',userPhone,(err,userData)=>{
                              if(!err && userData){
                                    tokenHandler._token.verify(token,userPhone,(tokenValid)=>{

                                          if(tokenValid){
                                    

                                                const userObject = parseJSON(userData);
                                                const userCheck = typeof(userObject.checks) === "object" && userObject.checks instanceof Array ? userObject.checks :[];

                                                if(userCheck.length < maxCheck){
                                                      const checkId = randomString(20);
                                                      const checkObjects ={
                                                            id: checkId,
                                                            userPhone,
                                                            protocol,
                                                            url,
                                                            method,
                                                            successCode,
                                                            timeOutSeconds
                                                      }
                                                      data.create('checks',checkId,checkObjects,(err)=>{
                                                            if(!err){
                                                                  userObject.checks = userCheck;
                                                                  userObject.checks.push(checkId);

                                                                  //save the new user data
                                                                  data.update('users',userPhone,checkObjects,(err)=>{
                                                                        if(!err){
                                                                              callback(200,checkObjects);
                                                                        }else{
                                                                              callback(500,{error:'server site error'})
                                                                        }
                                                                  })
                                                            }else{
                                                                  callback(500,{error: "server site error!"});
                                                                  
                                                            }
                                                      })
                                                }else{
                                                      callback(404,{error: "use has alread cross the max check limit!"});

                                                }
                                          }else{
                                                callback(404,{error: "user nots found"});

                                          }
                                    })
                              }else{
                                    callback(404,{error: "user not found"})
                              }
                              
                        })
                  }else{
                        callback(403,{error: " authentication not valid!"})
                  }
                  
            })
      }else{
            callback(400,{erro: 'problem in your request!'})
      }

}
handler._check.get = (requestProperties, callback)=>{
      //Check the id if valid
      const id =typeof(requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length > 0 ? requestProperties.queryStringObject.id : false;
      if(id){
            data.read('checks',id,(err,checkData)=>{
                  if(!err && checkData){
                        
                        const token = typeof(requestProperties.headerObjects.token) === 'string' && requestProperties.headerObjects.token.trim().length > 0 ? requestProperties.headerObjects.token : false;
                  //      console.log(checkData);
                        tokenHandler._token.verify(token,parseJSON(checkData).userPhone,(tokenIsvalid)=>{
                        if(tokenIsvalid){
                              callback(200,parseJSON(checkData))
                        }else{
                         callback(404,{error:'invalid token!'})
                        }
                       })
                       
                  }else{callback(400,{error:'problem in your request!'})}
            })
      }
      
}
handler._check.put = (requestProperties, callback)=>{
      const id = typeof(requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

      // validation inputs
      const protocol = typeof(requestProperties.body.protocol) === 'string' && ["https","http"].indexOf(requestProperties.body.protocol) >-1 ? requestProperties.body.protocol :false;
      const url  = typeof(requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url :false;
      const method = typeof(requestProperties.body.method) === 'string' && ["POST","GET","PUT","DELETE"].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method :false;
      const successCode = typeof(requestProperties.body.successCode) === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode  :false;
      const timeOutSeconds = typeof(requestProperties.body.timeOutSeconds) === 'number' && requestProperties.body.timeOutSeconds % 1 === 0 && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <=5 ?requestProperties.body.timeOutSeconds :false;

      if(id){
            // console.log(id);
            if(protocol || url || method || successCode || timeOutSeconds){
                  data.read('checks',id,(err,tokenData)=>{
                        

                       if(!err && tokenData){
                        let checkObject = parseJSON(tokenData);
                        const token = typeof(requestProperties.headerObjects.token) === 'string' ? requestProperties.headerObjects.token :false;
                        tokenHandler._token.verify(token,checkObject.userPhone,(tokenValid)=>{
                              if(tokenValid){
                                    if(protocol ){
                                          checkObject.protocol = protocol;
                                    }
                                    if(url ){
                                          checkObject.url = url;
                                    }
                                    if(method ){
                                          checkObject.method = method;
                                    }
                                    if(successCode ){
                                          checkObject.successCode = successCode;
                                    }
                                    if(timeOutSeconds ){
                                          checkObject.timeOutSeconds = timeOutSeconds;
                                    }
                                    data.update('checks',id,checkObject,(err)=>{
                                          if(!err){
                                                callback(200,)
                                          }else{
                                                callback(500,{err:"server side error"})
                                          }
                                    })
                              }else{
                                    callback(404,{error:'you have a problem in your request!'})
  
                              }
                        })
                       }else{
                        callback(404,{error:'you have a problem in tour request!'})

                       }

                  })
            }else{
                  callback(404,{error:'you have a problem in tour request!'})}
      }else{
            callback(404,{error:'you have a problem in tour request!'})
      }

}
handler._check.delete = (requestProperties, callback)=>{

      const id =typeof(requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length > 0 ? requestProperties.queryStringObject.id : false;
      if(id){
            data.read('checks',id,(err,checkData)=>{
                  if(!err && checkData){
                        
                        const token = typeof(requestProperties.headerObjects.token) === 'string' && requestProperties.headerObjects.token.trim().length > 0 ? requestProperties.headerObjects.token : false;
                  //      console.log(checkData);
                        tokenHandler._token.verify(token,parseJSON(checkData).userPhone,(tokenIsvalid)=>{
                        if(tokenIsvalid){
                              //delete the check data
                              data.delete('checks',id,(err)=>{
                                    if(!err){
                                          data.read('users',parseJSON(checkData).userPhone,(err,userData)=>{
                                                const userObject = parseJSON(userData);
                                                if(!err,userData){
                                                      let userChecks = typeof(userObject.checks) === 'object' && userObject.checks instanceof Array ?userObject.checks : [];
                                                      const checkPosition = userChecks.indexOf(id);
                                                      if(checkPosition > -1 ){
                                                            userChecks.splice(checkPosition,1);
                                                            userObject.checks =userChecks;
                                                            data.update('users',userObject.phone,userObject,(err)=>{
                                                                  if(!err){
                                                                        callback(200,)
                                                                  }else{
                                                                  callback(404,{error:'server site error'});

                                                                  }
                                                            })
                                                      }else{
                                                      callback(404,{error:'server site error'});

                                                      }
                                                }else{
                                                      callback(404,{error:'server site error'});

                                                }

                                          })
                                    }else{
                                          callback(404,{error:'server site error'});
                                    }
                              })
                        }else{
                         callback(404,{error:'invalid token!'})
                        }
                       })
                       
                  }else{callback(400,{error:'problem in your request!'})}
            })
      }
}


module.exports = handler;