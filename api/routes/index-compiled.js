'use strict';

module.exports = function (express, io) {

  var router = express.Router();

  io.on('connection', function (socket) {
    console.log('Connection on Index');
    /*socket.on('big', ()=> {
     console.log('big');
     });
     socket.emit('get', { 'get':'Express' });*/
  });

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.json({ index: 'index' });
  });

  return router;
};

//# sourceMappingURL=index-compiled.js.map