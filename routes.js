// Application routes

// dependencies
const {samplaHandlers} = require('./handlers/routeHandlers/samplaHandlers');
const {userHandlers} = require('./handlers/routeHandlers/userHandler');
const {tokenHandlers} = require('./handlers/routeHandlers/tokenHandlers');
const {checkHandlers} = require('./handlers/routeHandlers/checkHandler')

const routes ={
      sample:samplaHandlers,
      user :userHandlers,
      token : tokenHandlers,
      check : checkHandlers,
      
}

module.exports = routes;