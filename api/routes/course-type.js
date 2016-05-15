/**
 * Created by jonathan on 01/03/16.
 */
'use strict';

module.exports =  (express, io)  => {
  const courseTypeController = require('../controller/course-type-controller');
  const router = express.Router();
  const auth = require('../auth/auth');
  const utils = require('../utils/utils');

  io.on('connection', (socket) => {
    console.log('Connection on Course-Type');
    /*socket.on('big', () => {
     console.log('big');
     });
     socket.emit('get', { 'get':'Express' });*/
  });

  /* Middleware for authentication */
  router.use((req, res, next)  => {
    return auth.ensureAuthenticated(req, res, next);
  });

  /* GET Course Type listing. */
  router.get('/', (req, res)  => {
    courseTypeController.listCoursesType()
        .then((coursesType)  => {
          res.json({
            success: true,
            data: coursesType
          });
        })
        .catch((err)  => {
          res.json({
            success: false,
            data: err
          });
        });
  });

  /* GET Course Type by ID. */
  router.get('/:id', (req, res)  => {
    let courseType = {
      _id: req.params.id || ''
    };

    courseTypeController.validateCourseType(courseType, utils.OPERATION_STATUS.SELECT)
      .then((coursetype) => {
        return courseTypeController.getById(coursetype['_id']);
      })
      .then((result) => {
        if (result) {
          res.json({
            success: true,
            data: result
          });
        } else {
          res.status(404).json({
            success: false,
            data: '404 - Not Found'
          });
        }
      })
      .catch((err)  => {
        res.json({
          success: false,
          data: err
        });
      });
  });

  /* POST create a Course Type */
  router.post('/', (req, res)  => {
    let courseType = {
      description: req.body.description || ''
    };

    courseTypeController.validateCourseType(courseType, utils.OPERATION_STATUS.NEW)
      .then(courseTypeController.createCourseType)
      .then((result) => {
          res.json({
            success: true,
            data: result
          });
      })
      .catch((err) => {
        res.json({
          success: false,
          data: err
        });
      });
  });

  /* PUT update a Course Type */
  router.put('/', (req, res)  => {
    let courseType = {
      _id: req.body._id || '',
      description: req.body.description || ''
    };

    courseTypeController.validateCourseType(courseType, utils.OPERATION_STATUS.UPDATE)
      .then(courseTypeController.updateCourseType)
      .then((result)=>{
          res.json({
            success: true,
            data: result
          });
      })
      .catch((err) => {
          res.json({
            success: false,
            data: err
          });
      });
  });


  /* DELETE remove a Course Type by ID. */
  router.delete('/:id', (req, res)  => {
    var courseType = {
      _id: req.params.id || ''
    };

    courseTypeController.validateCourseType(courseType, utils.OPERATION_STATUS.DELETE)
      .then((coursetype) => {
        return courseTypeController.removeById(coursetype['_id']);
      })
      .then((result) => {
        if (result) {
          res.json({
            success: true,
            data: result
          });
        } else {
          res.status(404).json({
            success: false,
            data: '404 - Not Found'
          });
        }
      })
      .catch((err)  => {
        res.json({
          success: false,
          data: err
        });
      });
  });

  return router;
};