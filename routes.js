// Application routes

// dependencies
const {samplaHandlers} = require('./handlers/routeHandlers/samplaHandlers');
const {userHandlers} = require('./handlers/routeHandlers/userHandler');
const {tokenHandlers} = require('./handlers/routeHandlers/tokenHandlers')

const routes ={
      sample:samplaHandlers,
      user :userHandlers,
      token : tokenHandlers,
      
}

module.exports = routes;