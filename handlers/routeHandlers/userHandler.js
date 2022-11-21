//dependencies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');
const  tokenHandler = require('./tokenHandlers')
//user handler  scaffolding
const handler ={};

handler.userHandlers =(requestProperties, callback)=>{
      

      const acceptedMethods = ['get','post','put','delete'];
      if(acceptedMethods.indexOf(requestProperties.method) > -1){
            handler._users[requestProperties.method](requestProperties, callback);
      }else{
            callback(405)
      }
      
}
handler._users ={};
handler._users.post = (requestProperties, callback)=>{
      const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
      const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
      const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
      const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
      const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'string' && requestProperties.body.tosAgreement.trim().length > 0 ? requestProperties.body.tosAgreement : false;
      
      if( firstName && lastName && phone && password && tosAgreement){
            // check user does'n exist in database
            data.read('users',phone,(err)=>{
                  if(err){
                        const userObjects ={
                              firstName,
                              lastName,
                              phone,
                              password : hash(password),
                              tosAgreement
                        }
                        //create new User and store in database
                        data.create('users',phone,userObjects,(err)=>{
                              if(!err){
                                    callback(200,{
                                          message:'succesfully'
                                    })
                              }else{
                                    callback(500,{
                                          error:'could not create user!'
                                    })
                              }
                        })
                  }else{
                        callback(500,{
                              error:'problem in server site!'
                        })
                  }
            })
      }else{
            callback(400,{
                  error:'you have a problem in your request!'
            })
      }
}
handler._users.get = (requestProperties, callback)=>{
      //check the phone number is valid
      const phone = typeof(requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone :false;
      

      if(phone){
            let token = typeof(requestProperties.headerObjects.token) === 'string' ? requestProperties.headerObjects.token :false;
            
            tokenHandler._token.verify(token,phone,(tokenId)=>{
                  if(tokenId){
                        data.read('users',phone,(err,u)=>{
                              // console.log(u);
            
                              const user = {...parseJSON(u)}
                              if(!err && user){
                                    delete user.password;
                                    callback(200,user)
                              }else{
                                    callback(404,{
                                          error:'user not found'
                                    })
                              }
                        })
                  }else{
                        callback(403,{error:"unauthenticated user!"})
                  }
            })
            
      }else{
            callback(404,{
                  error:'user not found'
            })
      }
}
handler._users.put = (requestProperties, callback)=>{
      const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
      const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
      const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
      const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;     


      if(phone){

            if(firstName || lastName || password){
                  //verify token 
                  let token = typeof(requestProperties.headerObjects.token) === 'string' ? requestProperties.headerObjects.token :false;
            
            tokenHandler._token.verify(token,phone,(tokenId)=>{
                  if(tokenId){
                        data.read('users',phone,(err,uData)=>{
                              const userData = {...parseJSON(uData)}
                              if(!err && userData){
                                    if(firstName){
                                          userData.firstName = firstName
                                    }
                                    if(lastName){
                                          userData.lastName = lastName
                                    }
                                    if(password){
                                          userData.password = hash(password)
                                    }
                                    data.update('users',phone,userData,(err)=>{
                                          if(!err){
                                                callback(200,{
                                                      message:"updated"
                                                })
                                          }else{
                                                callback(500,{
                                                      error: 'problem in server site!'
                                                })
                                          }
                                    })
                              }else{
                                    callback(404,{
                                          error:'user not found!'
                                    })
                              }
                        })
                  }else{
                        callback(403,{error:"unauthenticated user!"})
                  }
            })
                  //lookup user in database
                  
            }else{
                  callback(404,{
                        error: 'you have problem in your request!'
                  })
            }
      }else{
            callback(404,{
                  error:'phone Number does not exist!'
            })
      }
      
}
handler._users.delete = (requestProperties, callback)=>{
    //check the phone number  is valid
    const phone = typeof(requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone :false;

    if(phone){

      let token = typeof(requestProperties.headerObjects.token) === 'string' ? requestProperties.headerObjects.token :false;
            
      tokenHandler._token.verify(token,phone,(tokenId)=>{
            if(tokenId){
               //lookup user
      data.read('users',phone,(err,userData)=>{
            if(!err && userData){
                  data.delete('users',phone,(err)=>{
                        if(!err){
                              callback(200,{message: 'user deleted!'})
                        }else{
                              callback(500,{
                                    error:'there was a problem in server site!'
                              })
                        }
                  })
            }else{
                  callback(404,{
                        error: "no user such that!"
                  })
            }
      })   
            }else{
                  callback(403,{error:"unauthenticated user!"})
            }
      })
      
      
    }

}





module.exports = handler;