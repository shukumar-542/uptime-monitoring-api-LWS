//Dependencies 
const fs = require('fs');
const path =  require('path');

//module ScaffHolding
const lib ={};

// base directory of data folder 
lib.basedir = path.join(__dirname,'/../.data/');

// write for data file
lib.create = (dir,file,data,callback)=>{
      //open file for writting
      fs.open(`${lib.basedir + dir}/${file}.json`,'wx',(err,fileDescriptor)=>{
            if(!err && fileDescriptor){

                  //convert the data to string
                  const stringData = JSON.stringify(data);
                  fs.writeFile(fileDescriptor, stringData,(err)=>{
                        if(!err){
                              fs.close(fileDescriptor, (err)=>{
                                    if(!err){
                                          callback(false)
                                    }else{
                                          callback('error for file closing!')
                                    }
                              })
                        }else{
                              callback('error writting for new file!!');
                        }
                  })

            }else{
                  callback('could not create new file it may exist');
            }
      })
}

//Read data from file

lib.read =(dir,file,callback)=>{
      fs.readFile(`${lib.basedir + dir}/${file}.json`,'utf8',(err,data)=>{
            callback(err,data);
      })
}

//update Existing file

lib.update=(dir,file,data,callback)=>{
      fs.open(`${lib.basedir + dir}/${file}.json`,'r+',(err,fileDescriptor)=>{
            if(!err && fileDescriptor){
                  //convert data to string
                  const stringData = JSON.stringify(data);

                  //file truncate
                  fs.ftruncate(fileDescriptor,(err)=>{
                        if(!err){
                              fs.writeFile(fileDescriptor,stringData,(err)=>{
                                    if(!err){
                                          fs.close(fileDescriptor,(err)=>{
                                                if(!err){
                                                      callback(false);
                                                }else{
                                                      callback('error for file closing');
                                                }
                                          })
                                    }else{
                                          callback('error for write file!')
                                    }
                              })
                        }else{
                              callback('error for file truncate')
                        }
                  })
            }else{
                  callback('error for file updating file does not exist');
            }
      })
}

//delete existing file

lib.delete=(dir,file,callback)=>{
      fs.unlink(`${lib.basedir + dir}/${file}.json`,(err)=>{
            if(!err){
                  callback(false);
            }else{
                  callback('error for deleting')
            }
      })
}

module.exports = lib;