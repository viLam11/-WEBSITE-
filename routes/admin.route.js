const express = require('express');
const route = express.Router();
const adminController = require('../app/controllers/AdminController');

route.get('/students/:ID', adminController.viewStudents);
route.get('/teachers/:ID', adminController.viewTeachers);
route.get('/teacherInfo/:teacherID/:ID', adminController.teacherInfo);
route.get('/courses/:ID', adminController.viewCourses);
route.get('/course/:courseID/:ID', adminController.courseDetail)
route.get('/createT/:ID', adminController.getFormT);
route.post('/createT/:ID', adminController.postTeacher);
route.get('/createS/:ID', adminController.getFormS);
route.post('/createS/:ID', adminController.postStudent);
route.get('/createC/:ID', adminController.getFormC);
route.post('/createC/:ID', adminController.postCourse);
route.get('/stuScore/:studentID/:ID', adminController.studentScore);
route.get('/stuInfo/:studentID/:ID', adminController.studentInfo);
route.get('/:ID', adminController.getIndex);

module.exports = route;