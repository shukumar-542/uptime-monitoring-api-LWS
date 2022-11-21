// Application routes

// dependencies
const {samplaHandlers} = require('./handlers/routeHandlers/samplaHandlers');
const {userHandlers} = require('./handlers/routeHandlers/userHandler');

const routes ={
      sample:samplaHandlers,
      user :userHandlers,
      
}

module.exports = routes;