const { stringify } = require('uuid');
const { db, ref, get, child, onValue, set } = require('../../fb/fb_database');
const { on } = require('nodemon');
const { ProviderId } = require('firebase/auth');

async function lookupCourseByID(ID) {
    try {
        const dataRef = ref(db, `Courses/${ID}`);
        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            return data;
        } else {
            return null;
        }
    } catch (error) {
        throw error; // Handle or rethrow the error as needed
    }
}

async function getNameStudentUID(uid) {
    const stuRef = ref(db, `Students/${uid}/information/name`)
    return new Promise( (resolve, reject) => {
        onValue(stuRef, (snapshot) => {
            resolve(snapshot.val());
        }, (error) => {
            reject(error);
        })
    })  
}
async function getStudentUID(id){
    const stuRef = ref(db, 'Students');
    let uid;
    return new Promise((resolve, reject) => {
        try{
            onValue(stuRef, (snapshot) => {
                snapshot.forEach( (childSnapshot) => {
                    const student = childSnapshot.val().information;
                    if( student.ID === id){
                        const uid = childSnapshot.key;
                        resolve(uid);
                        return;
                    }
                })
            })
        }
        catch (err){
            reject(err)
        }
    })
}
async function getNameStudent(id) {
    const stuRef = ref(db, 'Students');
    let name;
    return new Promise((resolve, reject) => {
        try{
            onValue(stuRef, (snapshot) => {
                snapshot.forEach( (childSnapshot) => {
                    let student = childSnapshot.val().information;
                    if( student.ID === id){
                        name = student.name;
                        resolve(student.name);
                        return;
                    }
                })
            })
        }
        catch (err){
            reject(err)
        }
    })
}

async function getTimetable(id) {
    const courseRef = ref(db, `Courses/${id}/calendar`);
    return new Promise((resolve, reject) => {
        onValue(courseRef, (snapshot) =>{
            if(snapshot.exists) {
                resolve(snapshot.val())
            }
        }, (err) => {
            reject(err)
        })
    })

}
// parameter: courseID
async function getStuList(id){
    return new Promise((resolve, reject) => {
        try{
            const courseRef = ref(db, `Courses/${id}/stuList`);
            var studentArray = [];
            
            onValue(courseRef, async (snapshot) => {
                var stringid = (snapshot.val());
                let list = stringid.split('-');
                const promises = list.map(async (studentID) => {
                    return getNameStudent(Number(studentID));
                });
                let names = await Promise.all(promises);
                for(let i in list ){
                    studentArray.push( {
                        id: list[i],
                        name: names[i]
                    })
                }
                resolve(studentArray);
            })
        }
        catch (error){
            reject(error);
        }
    })
}

// courses of students
async function allCourses(studentID){
    return new Promise((resolve, reject) => {
        try{
            let courseIDArray = [];
            const stuRef = ref(db, `/Students/${studentID}/learning_course`);
            onValue(stuRef, async (snapshot) => {
                snapshot.forEach( (childSnapshot) => {
                    var childData = childSnapshot.key;
                    courseIDArray.push(childData);
                    console.log(childData)
                })

                const promises = courseIDArray.map(async (courseID) => {
                    return await lookupCourseByID(courseID);
                });
    
                const results = await Promise.all(promises);
                resolve(results);
            })
        }
        catch(err){
            reject(err)
        }
    })
}

function removeDuplicate(firstArray, secondArray) {
    const secondSet = new Set(secondArray);
    const result = firstArray.filter(value => !secondSet.has(value));
    return result;
}

// register new courses
async function newCourses(stuID) {
    return new Promise( async (resolve, reject) => {
        try {
            let stuCourseID = [];
            const stuRef = ref(db, `/Students/${stuID}/learning_course`);
            onValue(stuRef, async (snapshot) => {
                snapshot.forEach( (childSnapshot) => {
                    var childData = childSnapshot.key;
                    stuCourseID.push(childData);
                })

                let allCourseID  = [];
                const courseRef = ref(db, '/Courses');
                onValue(courseRef, async (snapshot) => {
                    snapshot.forEach( (childSnapshot) => {
                        var childData = childSnapshot.key;
                        allCourseID.push(childData)
                    })
                
                    const courseID = removeDuplicate(allCourseID, stuCourseID);
                    const promises = courseID.map( async (cid) => {
                        return await lookupCourseByID(cid);
                    })
        
                    const results = await Promise.all(promises);
                    resolve(results);
                })
            })
        }
        catch(err) {
            reject(err);
        }
    })
    
}

async function getTeacherName(teachUid) {
    return new Promise((resolve, reject) => {
        const teachRef = ref(db, `/Teachers/${teachUid}/information/name`);
        onValue(teachRef, (snapshot) => {
            resolve(snapshot.val());
        }, (err) => {
            reject(err);
        })
    })
}

async function getCourseName(courseID) {
    const courseRef = ref(db, `Courses/${courseID}/name`);
    return new Promise( (resolve, reject) => {
        onValue(courseRef, (snapshot) => {
            resolve(snapshot.val())
        }, (err) =>{
            reject(err);
        })
    }) 
}

async function getCourseCredit(courseID) {
    const courseRef = ref(db, `Courses/${courseID}/credit`);
    return new Promise( (resolve, reject) => {
        onValue(courseRef, (snapshot) => {
            resolve(snapshot.val())
        }, (err) =>{
            reject(err);
        })
    }) 
}

async function allStudents() {
    const stuRef = ref(db, 'Students');
    let students = [];
    return new Promise((resolve, reject) => {
        onValue(stuRef, (snapshot) => {
            snapshot.forEach((childData) => {
               let stu = childData.val().information;
               students.push(stu)
            })
            console.log(students);
            resolve(students);
        }, (err) => {
            reject(err)
        })
    })
}

async function allTeacher() {
    const teachRef = ref(db, 'Teachers');
    let teachers = [];
    return new Promise((resolve, reject) => {
        onValue(teachRef, (snapshot) => {
            snapshot.forEach((childData) => {
                let teacher = childData.val().information;
                let teach_course = childData.val().teaching_course;
                let teacherUID = childData.key;
                Object.assign(teacher, {
                    teacherUID: teacherUID,
                    teaching_course: teach_course
                })
                console.log("check teacher: ", teacher);
                teachers.push(teacher);
            })
            resolve(teachers);
        }, (err) => {
            reject(err);
        })
    })
}

async function teacherTimetable(teacherID) {  //Lấy TKB - Xem TKB
    try {
        var calendar = {};
        await get(child(ref(db), `/Teachers/${teacherID}/teaching_course`))
            .then(async (snapshot) => {
                const courseID_list = Object.keys(snapshot.val());
                await Promise.all(courseID_list.map(async (courseID) => {
                    calendar[courseID] = await getTimetable(courseID);
                }));
            })
            .catch((error) => {
                throw (error);
            });
        return calendar;
    }
    catch (error) { 
        throw (error);
    }
}

async function viewAllCourse() {
    const courseRef = ref(db, '/Courses');
    return new Promise((resolve, reject) => {
        try {
            onValue(courseRef, (snapshot) => {
                resolve(snapshot.val())
            })
        } catch (error) {
            reject(err)
        }
    })
}

// getStudentUID(2213076)
//     .then((uid) => {
//         console.log("RESULT: ", uid);
//     })
//     .catch((err) => {
//         consosle.log(err);
//     })
module.exports = {getStudentUID, viewAllCourse, teacherTimetable, allStudents, allTeacher, getTeacherName, lookupCourseByID, getNameStudent, getStuList, allCourses, newCourses, getTimetable, getCourseName, getCourseCredit, getNameStudentUID};