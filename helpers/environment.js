//using Environment variables

const { type } = require("os");

//Module scaffolding
const environment={};

environment.staging={
      port: 3000,
      envName: 'staging',
      secretKey : 'aslkjhkjkvhghg',
      maxCheck: 5
}
environment.production={
      port:5000,
      envName:'production',
      secretKey : 'asdfdgdgfhghgh',
      maxCheck: 5
}

//Determine which environment was passed 
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

//export crossponding environment object

const environmentToExport = typeof environment[currentEnvironment] === 'object' ? environment[currentEnvironment] : environment.staging;

module.exports = environmentToExport;