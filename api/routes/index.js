'use strict';

module.exports =  (express, io) => {

  const router = express.Router();

  io.on('connection', (socket)=> {
    console.log('Connection on Index');
    /*socket.on('big', ()=> {
     console.log('big');
     });
     socket.emit('get', { 'get':'Express' });*/
  });

  /* GET home page. */
  router.get('/',  (req, res, next) => {
    res.json({index: 'index'});
  });

  return router;
};