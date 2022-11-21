// utilities for json realData

//Dependenciesconst crypto = require('crypto');

const crypto = require('crypto');
const environments = require('./environment');
//Module scaffHolding
const utitlities = {};

//Parse json string to objects
utitlities.parseJSON =(jsonString) =>{
      let output;
      try{ 
            output = JSON.parse(jsonString)
      }catch{
            return output ={};
      }
      return output
}

//Hash to string
utitlities.hash =(str) =>{
      if(typeof(str) === 'string' && str.length > 0){
            const hash = crypto.createHmac('sha256', environments.secretKey)
            .update(str)
            .digest('hex');
            return hash;    
      }else{
            return false;
      }
}
module.exports =utitlities;