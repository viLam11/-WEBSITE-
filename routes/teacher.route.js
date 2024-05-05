const express = require('express');
const router = express.Router();
const teacherController = require('../app/controllers/TeacherController');

router.get('/courses/:ID', teacherController.allCourses);
router.get('/info/:ID', teacherController.info);
router.get('/timetable/:ID', teacherController.timetable);
router.get('/studentList/:courseID/:ID', teacherController.getStuList);
router.get('/score/:courseID/:teachID', teacherController.updateScore);
router.post('/score/:courseID/:teachID', teacherController.postScore);
router.get('/:courseID/:teachID', teacherController.getCourseDetail);
router.get('/:ID', teacherController.index);

module.exports = router;