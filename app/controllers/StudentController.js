const { response } = require('express');
const { db, ref, get, child, set, onValue } = require('../../../fb/fb_database');
const { course } = require('./SiteController');
const {getCourseName, getCourseCredit, lookupCourseByID, getNameStudent, getStuList, allCourses, newCourses, getNameStudentUID} = require('../../dataFunction/function');
const {courseUpdateList, GPA, getID, inforStu, transcript, courseRegister, getsTKB} = require('../../dataFunction/student')

class StudentController{
    // [GET] /me/transcript/:ID
    async gettranscript(req, res, next) {
        const dbRef = ref(db);
        const studentUID = req.params.ID //uuid
        let studentID  = await getID(studentUID);
        let studentName = await getNameStudent(studentID);
        let score;
        transcript(studentID)
            .then((course) =>{
                score = course;
                let final = [];
                let credit = [];
                console.log(course);
                Object.keys(course).map( (courseID) => {
                    final.push(course[courseID].exercise.final);
                    credit.push(course[courseID].credit);
                })
                console.log('final, credit: ', final + ', ' + credit);
                return GPA(final, credit);
            })
            .then(({GPA, totalCredit}) => {
                console.log('gpa + totalcredit: ', GPA + ', ' + totalCredit);
                res.render('student/transcript', {
                    layout: 'main',
                    role: 'me',
                    ID: studentUID,
                  
                    stylesheet: '/css/layouts.css',
                    stylesheet2: '/css/layout.css',
                    stylesheet3: '/css/transcript.css',
                    courses: score,
                    studentID: studentID,
                    name: studentName,
                    GPA: GPA,
                    totalCredit: totalCredit
                })
            })
            .catch((err) => console.log(err))
        }

    // [GET] /me/timetable/:ID
    async timetable(req, res, next){
        const studentUID = req.params.ID;
        const studentName =  await getNameStudentUID(studentUID);
        getsTKB(studentUID)
            .then(async (timetable) => {
                await Promise.all(Object.keys(timetable).map(async (courseID) => {
                    timetable[courseID].name = await getCourseName(courseID);
                    timetable[courseID].credit = await getCourseCredit(courseID);
                }))
                console.log(timetable);
                res.render('student/timetable', {
                    layout: 'main',
                    role: 'me',
                    ID: studentUID,
                  
                    stylesheet: '/css/layouts.css',
                    stylesheet: '/css/layout.css',
                    timetable: timetable,
                    name: studentName
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // [GET] /me/courses/register/:ID
    async getregister(req, res, next){
        const uuid = req.params.ID;
        await newCourses(uuid)
            .then( (courses) => {
                // res.json(courses);
                res.render('student/courseReg', {
                    layout: 'main',
                    role: 'me',
                    ID: uuid,
                    stylesheet: '/css/layouts.css', 
                    stylesheet2: '/css/',
                    courses: courses,
                    uuid: uuid
                })
            })
            .catch((err) => console.log(err));
    }

    // [POST] /me/courses/register/:ID
    async postRegister(req, res, next) {
        const courseID = req.body.courseID;
        const studentUID = req.params.ID;
        const studentID = await getID(studentUID);
        console.log('courseID: ', courseID);
        console.log('studentUID: ', studentUID);
        await courseUpdateList(studentID, courseID)
            .then(async () =>{
                await courseRegister(studentUID, courseID)
                    .then(() => {
                        res.redirect(`/me/courses/${studentUID}`);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
            .catch((err) => {
                console.log(err);
            })   
    }
    
    // [GET] /courseD/stuList/:courseID/:ID
    async getStuList(req, res, next) {
        const courseID = req.params.courseID;
        const stuUID = req.params.ID;
        await getStuList(courseID)
            .then((studentArray) => {
                res.render('student/stulist', {
                    layout: 'main',
                    ID: stuUID,
                    role: 'me',
                    stylehsheet: '/css/app.css',
                    stylesheet2: '/css/course.detail.css',
                    stylesheet3: '/css/layout.css',
                    students: studentArray,
                    courseID: courseID
                })
            })
    }
    
    // [GET] /me/courses/:ID
    async courses(req, res, next){
        let stuUid = req.params.ID;
        await allCourses(stuUid)
            .then((courses) => {
                // res.json(courses)
                res.render('student/allcourses', {
                    layout: 'main',
                    role: 'me',
                    ID: stuUid,
                  
                    stylesheet: '/css/layout.css',
                    stylesheet2: '/css/draft.css',
                    courses: courses,
                    uuid: stuUid
                })
            })
            .catch((err) => console.log(err));
    }

    // [GET] /me/courseD/:courseID/:ID
    async courseDetail(req, res, next) {
        const courseID = req.params.courseID;
        const studentID = req.params.ID;
        await lookupCourseByID(courseID)
            .then((result) => {
                const courses = result;
                const material = result.material;
                res.render('student/courseDetail', {
                    layout: 'main',
                    role: "me",
                    ID: studentID,
                  
                    stylehsheet: '/css/app.css',
                    stylesheet2: '/css/course.detail.css',
                    stylesheet3: '/css/layout.css',
                    course: courses,
                    material: material,
                
                });
            }) 
    }
    // [GET] /me/info/:ID
    info(req, res, next){
        const ID = req.params.ID;
        const stuRef = ref(db, `Students/${ID}`);
        onValue(stuRef, (snapshot) => {
            const stuInfo = snapshot.val().information;
            const stuTeaching = snapshot.val().teaching;
            console.log(stuInfo);
            res.render('student/info', {
                layout: 'main',
                role: 'me',
                stylesheet: '/css/course.detail.css',
                stylesheet2: '/css/info.css',
                stylesheet3: '/css/layout.css',
                stu: stuInfo,
                stuTeach: stuTeaching,
                ID: ID
            })

        });
    }

    // [GET] /me/:uid
    main(req, res, next){
        const id = req.params.uid;
        res.render('student/home',{
            layout: 'main',
            role: 'me',
            stylesheet: '/css/course.detail.css',
            stylesheet2: '/css/home.css',
            ID: id
        })
    }
}
module.exports = new StudentController;