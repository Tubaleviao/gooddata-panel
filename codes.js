var fs = require('fs');
var apis = require('./apis.js');

exports.painel = (socket)=>{
  socket.on('getData', (data)=>{
    apis.schedules().then(schedules => socket.emit('schedules', schedules)).catch(err => console.log(err));   
  });
};

exports.options = {
  key: fs.readFileSync('/etc/path/privkey.pem'),
  cert: fs.readFileSync('/etc/path/fullchain.pem')
}

