//Dependencies
const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('../routes');
const {notFoundHandle} = require('../handlers/routeHandlers/notFoundHandler');
const {parseJSON} =  require('../helpers/utilities')
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

   
       req.on('data', (buffer)=>{
            realData += decoder.write(buffer)
       })
       req.on('end',()=>{
            realData += decoder.end();

            requestProperties.body = parseJSON(realData);

            chosenHandlers(requestProperties , (statusCode,payload)=>{
                statusCode = typeof(statusCode) === 'number' ? statusCode: 500;
                payload = typeof(payload) === 'object' ? payload :{};
                
                const payloadStringify = JSON.stringify(payload);
      
                // return final response
                res.setHeader('content-type','application/json');
                res.writeHead(statusCode);
                res.end(payloadStringify);
                
            });
      
            // console.log(realData);
            // res.end('hello world !!');

       })

}
module.exports = handler;