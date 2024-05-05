const express = require('express');
const router = express.Router();
const studentController = require('../app/controllers/StudentController');

router.get('/info/:ID', studentController.info);
router.get('/courses/register/:ID', studentController.getregister);
router.post('/courses/register/:ID', studentController.postRegister);
router.get('/courses/:ID', studentController.courses);
router.get('/courseD/stuList/:courseID/:ID', studentController.getStuList);
router.get('/courseD/:courseID/:ID', studentController.courseDetail);
router.get('/transcript/:ID', studentController.gettranscript);
router.get('/timetable/:ID', studentController.timetable);
router.get('/:uid', studentController.main);

module.exports = router;