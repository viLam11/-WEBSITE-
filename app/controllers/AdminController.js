const { response } = require('express');
const { db, ref, get, child, set, onValue } = require('../../../fb/fb_database');
const { course } = require('./SiteController');
const { v4: uuidv4 } = require('uuid');
const {viewAllCourse, getTeacherName, lookupCourseByID, getNameStudent, getStuList, allCourses, newCourses, getTimetable, getCourseName, getCourseCredit, getNameStudentUID, allStudents, allTeacher, getStudentUID} = require('../../dataFunction/function');
const {getID, inforStu, transcript , courseRegister, courseUpdateList, getsTKB, GPA} = require('../../dataFunction/student')
class AdminController{
    // [GET] /admin/createT
    getFormT(req, res, next) {
        const adminID = req.params.ID;
        res.render('admin/createTeacher', {
            layout: 'main',
            stylesheet: '/css/app.css',
            stylesheet2: '/css/layout.css',
            stylesheet3: '',
        })
    }

    // [POST] /admin/createT/:ID
    async postTeacher(req, res, next) {
        const adminUID = req.params.ID;
        const newTeacher = req.body;
        // res.json(newTeacher);
        const adminID = req.params.ID;
        newTeacher.id = uuidv4();
        const teachRef = ref(db, `/Teachers/${newTeacher.ID}/information`);
        await set(teachRef, newTeacher);
        res.redirect(`/admin/teachers/${adminUID}`);
    }   

    // [GET] /admin/createS/:ID
    getFormS(req, res, next) {
        const adminID = req.params.ID;
        res.render('admin/createStudent', {
            layout: 'main',
            role: 'admin',
            ID: adminID,
            stylesheet: '/css/app.css',
            stylesheet2: '/css/layout.css',
            stylesheet3: '',
        })
    }

    // [POST] /admin/createS
    async postStudent(req, res, next) {
        const newStudent = req.body;
        const studentID = req.body.ID;
        const studentUID = uuidv4();
        const adminUid = req.params.ID;
        // res.json(newStudent);
        const studentRef = ref(db, `/Students/${studentUID}/information`);
        await set(studentRef, newStudent);
        res.redirect(`/admin/students/${adminUid}`);
    }   

    // [GET] /admin/createC/:ID
    getFormC(req, res, next) {
        const adminID = req.params.ID;
        res.render('admin/createCourse', {
            layout: 'main',
            role: 'admin',
            ID: adminID,
            stylesheet: '/css/app.css',
            stylesheet2: '/css/layout.css',
            stylesheet3: '',
        })
    }

    // [POST] /admin/createC/:ID
    async postCourse(req, res, next) {
        const adminID = req.params.ID;
        const newCourse = req.body;
        // res.json(req.body);
        const courseRef = ref(db, `/Courses/${newCourse.courseID}`);
        await set(courseRef, newCourse);
        console.log('Path: ', `admin/courses/${adminID}`);
        res.redirect(`/admin/courses/${adminID}`);
    }   

    // [GET] /admin/:ID
    getIndex(req, res, next) {
        let uid = req.params.ID;
        res.render('admin/home', {
            layout: 'main', 
            role: 'admin',
            ID: uid,
            stylesheet: '/css/app.css',
            stylesheet2: '/css/layout.css',
            stylesheet3: '/css/home.css'
        })
    }

    // [GET] /admin/course/:ID
    async viewCourses(req, res, next) {
        
        const adminUid = req.params.ID;
        viewAllCourse()
            .then((courses) => {
                // res.json(courses);
                res.render('course/course', {
                    layout: 'main',
                    role: 'admin',
                    ID: adminUid,
                    courses: courses
                })
            })
            .catch((err) => {
                console.log(err)
            })
       
    }
    
    // [GET] /admin/course/:courseID
    async courseDetail(req, res, next) {
        const courseID = req.params.courseID;
        const adminUid = req.params.ID;
        await lookupCourseByID(courseID)
            .then((result) => {
                const courses = result;
                const material = result.material;
                // res.json({
                //     course: courses,
                //     material: material
                // })
                res.render('student/courseDetail', {
                    layout: 'main',
                    role: "admin",
                    ID: adminUid,
                    stylehsheet: '/css/app.css',
                    stylesheet2: '/css/course.detail.css',
                    stylesheet3: '/css/layout.css',
                    course: courses,
                    material: material,
                
                });
            }) 
    }
    
    // [GET] /admin/students/:ID
    async viewStudents(req, res, next) {
        const adminUid = req.params.ID;
        allStudents() 
            .then((students) => {
                // res.json(students);
                res.render('admin/allStudent', {
                    layout: 'main',
                    role: 'admin',
                    ID: adminUid,
                    students: students,
                    stylesheet: '/css/layouts.css',
                    stylesheet: '/css/layout.css'
                })
            })
    }

    // [GET] /admin/teachers/:ID
    async viewTeachers(req, res, next){
        const adminUid = req.params.ID;
        let teachers = [];
        allTeacher() 
            .then((teachers) => {
                teachers = teachers;
                // res.json(teachers);
                res.render('admin/allTeachers', {
                    layout: 'main',
                    role: 'admin',
                    ID: adminUid,
                    teachers: teachers,
                    stylesheet: '/css/layouts.css',
                    stylesheet: '/css/layout.css'
                })
            })
    }

    // [GET] /admin/stuScore/:studentID/:ID
    async studentScore(req, res, next) {  
        const adminUid = req.params.ID;
        console.log("ADMIN UID: ", adminUid);
        const studentID  = req.params.studentID;
        // let studentName = await getNameStudent(studentID);
        let score;
        transcript(studentID)
            .then((course) =>{
                score = course;
                let final = [];
                let credit = [];
                Object.keys(course).map( (courseID) => {
                    final.push(course[courseID].exercise.final);
                    credit.push(course[courseID].credit);
                })
                console.log('final, credit: ', final + ', ' + credit);
                return GPA(final, credit);
            })
            .then(({GPA, totalCredit}) => {
                console.log('gpa + totalcredit: ', GPA + ', ' + totalCredit);
                // res.json(score);
                res.render('student/transcript', {
                    layout: 'main',
                    role: 'admin',
                    ID: adminUid,
                    stylesheet: '/css/layouts.css',
                    stylesheet2: '/css/layout.css',
                    stylesheet3: '/css/transcript.css',
                    courses: score,
                    studentID: studentID,
                    GPA: GPA,
                    totalCredit: totalCredit
                })
            })
            .catch((err) => console.log(err))
    }

    // [GET] /admin/stuInfo/:studentID/:ID
    async studentInfo(req, res, next) {
        const studentID = req.params.studentID;
        const adminUid = req.params.ID;
        const studentUID = await getStudentUID(Number(studentID));
        const stuRef = ref(db, `Students/${studentUID}`);
        onValue(stuRef, (snapshot) => {
            const stuInfo = snapshot.val().information;
            const stuTeaching = snapshot.val().teaching;
            // console.log(stuInfo);
            // res.json({stuInfo, stuTeaching});
            res.render('student/info', {
                layout: 'main',
                role: 'admin',
                ID: adminUid,
                stylesheet: '/css/course.detail.css',
                stylesheet2: '/css/info.css',
                stylesheet3: '/css/layout.css',
                stu: stuInfo,
                stuTeach: stuTeaching
            })

        });
    }

    // [GET] /admin/teacherInfo/:teacherID/:ID
    async teacherInfo(req, res, next){
        // res.json("Teacher infor");
        const adminUID = req.params.ID;
        const teacherID = req.params.teacherID;
        const tName = await getTeacherName(teacherID);
        const teachRef = ref(db, `Teachers/${teacherID}/information`);
        onValue(teachRef, (snapshot) => {
            const teacherInfo = snapshot.val();
            // res.json(teacherInfo);
            res.render('teacher/info', {
                layout: 'main',
                stylesheet: '/css/course.detail.css',
                stylesheet2: '/css/info.css',
                stylesheet3: '/css/layout.css',
                teach: teacherInfo,
                name: tName,
                role: 'admin',
                ID: adminUID
            })

        });
    }
}

module.exports = new AdminController;