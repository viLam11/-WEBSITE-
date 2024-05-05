const { db, set, ref, child } = require('../fb/fb_database');
const { auth, createUserWithEmailAndPassword, currentUser } = require('../fb/fb_auth');

const express = require('express');
const { verifyBeforeUpdateEmail } = require('firebase/auth');
const router = express.Router();

router.post("/createStu", function(req, res) {
    const { email, password } = req.body;
    const { ID, address, cccd, day_of_birth, gender, name, phone_number, major, status } = req.body;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const uid = userCredential.user.uid;
            const userRef = child(ref(db, "Users"), `${uid}`);
            const stuRef = child(ref(db, "Students"), `${uid}`);
            const scoreRef = child(ref(db, "Score"), `${ID}`);
            set(userRef, {  
                infomation: {
                    ID: ID,
                    address: address,
                    cccd: cccd,
                    day_of_birth: day_of_birth,
                    gender: gender,
                    name: name,
                    phone_number: phone_number 
                },
                role: "Student"
            });
            
            set(stuRef, {  
                infomation: {
                    ID: ID,
                    address: address,
                    cccd: cccd,
                    day_of_birth: day_of_birth,
                    gender: gender,
                    phone_number: phone_number,
                    email: email,
                    name: name,
                    major: major,
                    status: status
                },
                learning_course:""
            });

            set(scoreRef, {  
                course:"",
                name: name
            });
        })
        .catch((error) => {
            res.send(error.message);
        });
});

router.post("/createTeac", function (req, res) {
    const { email, password } = req.body;
    const { address, cccd, day_of_birth, gender, name, phone_number, falcuty, major, status } = req.body;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const uid = userCredential.user.uid;
            const userRef = child(ref(db, "Users"), `${uid}`);
            const teacRef = child(ref(db, "Teachers"), `${uid}`);
            set(userRef, {  
                infomation: {
                    ID: "",
                    address: address,
                    cccd: cccd,
                    day_of_birth: day_of_birth,
                    gender: gender,
                    name: name,
                    falcuty: falcuty,
                    phone_number: phone_number 
                },
                role: "Teacher"
            });
            
            set(teacRef, {  
                infomation: {
                    achieviment: "",
                    address: address,
                    cccd: cccd,
                    day_of_birth: day_of_birth,
                    falcuty: falcuty,
                    main_subject: "",
                    research_dir: "",
                    gender: gender,
                    name: name,
                    phone_number: phone_number,
                    email: email,
                    school: "",
                    status: status
                },
                teaching_course:""
            });

            set(scoreRef, {  
                course:"",
                name: name
            });
        })
        .catch((error) => {
            res.send(error.message);
        });
})

router.post("/createCou", function(req, res) {
    const { courseID, calendar, credit, description, material, name, stuList = "", teacher, thumnail} = req.body;
    const courseRef = child(ref(db, "Courses"), `${courseID}`);
    set(courseRef, {
            courseID: courseID,
            calendar: calendar,
            credit: credit,
            description: description,
            material: material,
            name: name,
            stuList: stuList,
            teacher: teacher,
            thumnail: thumnail
    });
});

module.exports = router;
