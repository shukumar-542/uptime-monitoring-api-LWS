//Dependencies
const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('../routes');
const {notFoundHandle} = require('../handlers/routeHandlers/notFoundHandler')
//Module scaffolding
const handler ={};

handler.handleReqRes = (req,res)=>{
      const parseUrl = url.parse(req.url, true);
      const path = parseUrl.pathname;
      const trimedPath = path.replace(/^\/+|\/+$/g,'');
      const method = req.method.toLowerCase();
      const queryStringObject = parseUrl.query;
      const headerObjects = req.headers;

      const requestProperties = {
          parseUrl,
          path,
          trimedPath,
          method,
          queryStringObject,
          headerObjects,
      }

      // console.log(headerObjects);
      const decoder = new StringDecoder('utf8');
      let realData = '';

      const chosenHandlers =  routes[trimedPath] ? routes[trimedPath] : notFoundHandle;

      chosenHandlers(requestProperties , (statusCode,payload)=>{
          statusCode = typeof(statusCode) === 'number' ? statusCode: 500;
          payload = typeof(payload) === 'object' ? payload :{};
          
          const payloadStringify = JSON.stringify(payload);

          // return final response

          res.writeHead(statusCode);
          res.end(payloadStringify);
      })

       req.on('data', (buffer)=>{
            realData += decoder.write(buffer)
       })
       req.on('end',()=>{
            realData += decoder.end()
            console.log(realData);
            res.end('hello can you here me shukumar ghosh??');

       })

}
module.exports = handler;