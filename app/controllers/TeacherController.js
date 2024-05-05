const { response } = require('express');
const { db, ref, get, child, set, onValue } = require('../../../fb/fb_database');
const { course } = require('./SiteController');
const { promise } = require('readdirp');
const {teacherTimetable, allStudents, allTeacher, getTeacherName, lookupCourseByID, getNameStudent, getStuList, allCourses, newCourses, getTimetable, getCourseName, getCourseCredit, getNameStudentUID}
     = require('../../dataFunction/function');

// router.get('/courses/:ID', teacherController.allCourses);
// router.get('/info/:ID', teacherController.info);
// router.get('/timetable/:ID', teacherController.timetable);

let courseArray = [];
const idArray = [];
class TeacherController{
    // [GET] /teacher/courses/:ID
    async allCourses(req, res, next){
        let promises = [];
        let ID = req.params.ID;
        let teacher = {};
        await get(ref(db, `/Teachers/${ID}/information`))
            .then( (snapshot) => {
                teacher = snapshot.val();
            })

        const teachRef = ref(db, `Teachers/${ID}/teaching_course`);
        onValue(teachRef, (snapshot) => {
             snapshot.forEach((childSnapshot) => {
                let id = childSnapshot.key;
                idArray.push(id);
                console.log("course id: ", id);
                promises.push(lookupCourseByID(id));
            }) 
            
            console.log(idArray);
            Promise.all(promises)
            .then((result) => {
                courseArray = result;
                res.render('teacher/courses', {
                    layout: 'main',
                    stylesheet: '/css/app.css',
                    stylesheet2: '/css/layout.css',
                    stylesheet3: '/css/course.detail.css',
                    courses: courseArray,
                    teacher: teacher,
                    ID: ID,
                    role: "teacher"
                })
            })
            
        })
    }

    // [GET] /courses/:courseID/:teachID 
    async getCourseDetail(req, res, next){
        const courseID = req.params.courseID;
        const teacherID = req.params.teachID;
        await lookupCourseByID(courseID)
            .then((result) => {
                const course = result;
                const material = result.material;
                // res.json({course, material});
                res.render('teacher/courseDetail', {
                    layout: 'main',
                    role: "teacher",
                    ID: teacherID,
                    stylehsheet: '/css/app.css',
                    stylesheet2: '/css/course.detail.css',
                    stylesheet3: '/css/layout.css',
                    course: course,
                    material: material
                });
            })
       
    }

    // [GET] /teacher/scores/:courseID/:teachID
    async updateScore(req, res, next){
        const courseID = req.params.courseID;
        const teachID = req.params.teachID;
        let students;
        const courseName = await getCourseName(courseID);
        const teacherName = await  getTeacherName(teachID);
        getStuList(courseID)
            .then((stuList) =>{
                students = stuList;
                // console.log('Techer name: ', teacherName);
                // console.log('student: ', students);
                // res.json(stuList );
                res.render('teacher/nhapdiem', {
                    layout: 'main',
                    ID: teachID,
                    role: 'teacher',
                    stylesheet: '/css/layouts.css', 
                    stylesheet2: '/css/',
                    students: students,
                    teacherName: teacherName,
                    courseName: courseName
                 })
            })
            .catch((err)=>{
                console.log(err)
            })
       
            
       
    }
    
    // [POST] /teacher/score/:courseID/:teachID
    async postScore(req, res, next){
        const {exercise, assign, test, lab, final} = req.body;
        const courseID = req.params.courseID;
        const teachID = req.params.teachID;
        let students;
        let newData = [];
        getStuList(courseID)
            .then((stuList) =>{
                students = stuList;
                for(let i in students) {
                    console.log(`${students[i].id}`)
                    let scoreRef = ref(db, `Score/${students[i].id}/course/${courseID}/exercise`);
                    set(scoreRef, {
                        BT: exercise[i],
                        BTL: assign[i],
                        KT: test[i],
                        TN: lab[i],
                        final: final[i]
                    })
                }
                // /courses/:courseID/:teachID 
                res.redirect(`/teacher/${courseID}/${teachID}`)
            })
            .catch((err) =>{
                console.log(err);
            })
            

    }
    //[GET] /teacher/info/:ID
    async info(req, res, next){
        // res.json("Teacher infor");
        const ID = req.params.ID;
        const tName = await getTeacherName(ID);
        const teachRef = ref(db, `Teachers/${ID}/information`);
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
                role: 'teacher',
                ID: ID
            })

        });
    }
    // [GET] Cannot GET /teacher/studentList/:courseID/:ID
    async getStuList(req, res, next) {
        const courseID = req.params.courseID;
        const stuUID = req.params.ID;
        await getStuList(courseID)
            .then((studentArray) => {
                res.render('teacher/stulist', {
                    layout: 'main',
                    ID: stuUID,
                    role: 'teacher',
                    stylehsheet: '/css/app.css',
                    stylesheet2: '/css/course.detail.css',
                    stylesheet3: '/css/layout.css',
                    students: studentArray,
                    courseID: courseID
                })
            })
    }
    // [GET] /teacher/timetable/:ID
    async timetable(req, res, next){
        const teacherUid = req.params.ID;
        const teacherName = await getTeacherName(teacherUid);
        teacherTimetable(teacherUid)
            .then(async (timetable) => {
                await Promise.all(Object.keys(timetable).map(async (courseID) => {
                    timetable[courseID].name = await getCourseName(courseID);
                    timetable[courseID].credit = await getCourseCredit(courseID);
                }))
                res.render('teacher/timetable', {
                    layout: 'main',
                    timetable: timetable,
                    role: 'teacher',
                    ID: teacherUid,
                    stylesheet: '/css/layout.css',
                    stylesheet2: '/css/layouts.css',
                    name: teacherName
                })
            })
    }

    // [GET]/teacher/:ID
    index(req, res, next){
        const ID = req.params.ID;
        const teachRef = ref(db, `Teachers/${ID}/information`);
        onValue(teachRef, (snapshot) => {
            const teacherInfo = snapshot.val();
            console.log(teacherInfo);
            res.render('teacher/home', {
                layout: 'main',
                stylesheet: '/css/course.detail.css',
                stylesheet2: '/css/home.css',
                stylesheet3: '/css/layout.css',
                teacherInfo: teacherInfo,
                ID: ID,
                role: 'teacher'
            })

        });
    }

}
module.exports = new TeacherController;