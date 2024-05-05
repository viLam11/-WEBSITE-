const { db, ref, get, set, child, onValue, update } = require('../../fb/fb_database');
const { check_login, currentUser } = require('../../fb/fb_auth');
const { reauthenticateWithCredential } = require('firebase/auth');

async function inforStu(stuUid) {
    const dbRef = ref(db);
    get(child(dbRef, `/Users/${user.user.uid}`))
        .then((snapshot) => {
            return snapshot.val();
        })
        .catch((error) => {
            console.error(error);
        });  
}

async function GPA(score, credit){
    if(!score || !credit) return;
    let totalScore = 0;
    let totalCredit = 0;
    for(let i in score){
        totalScore += score[i]*credit[i];
        totalCredit += credit[i];
    }
    const GPA = totalScore/totalCredit;
    return {GPA, totalCredit};
}

// khoa hoc và diem so -- thong tin sinh vien MyBK
async function transcript(id) {
    const dbRef = ref(db);
    return new Promise( (resolve, reject) => {
        get(child(dbRef, `/Score/${id}/course`))
        .then((snapshot) => {
            resolve(snapshot.val());
        })
        .catch((error) => {
            reject(error);
        });
    } )
}

async function getCourseInfo(courseID) {
    const courseRef = ref(db, `Courses/${courseID}`);
    return new Promise((resolve, reject) => {
        onValue(courseRef, (snapshot) => {
            const credit = snapshot.val().credit;
            const name = snapshot.val().name;
            resolve( {
                courseID: courseID,
                credit: credit,
                name: name
            });
        }, (err) => {
            reject(err);
        })
    })
}
// async function courseUpdateList(studentID, courseID) {
//     const courseRef = ref(db, `Courses/${courseID}/stuList`);
//     let stuList = "";
//     try {
//         const snapshot = await get(courseRef);
//         stuList = snapshot.val() || "";
//         console.log("Student list: ", stuList);
//         stuList += '-' + studentID;
//         console.log("Check student List: ", stuList);

//         await update(ref(db, `Courses/${courseID}/`), {stuList: stuList});
//         console.log("New student list updated successfully");
//         return Promise.resolve();
//     } catch (error) {
//         console.error("Error updating student list:", error);
//         return Promise.reject(error);
//     }
// }

// async function courseRegister(uid, courseID) {
//     const stuRef = ref(db, `Students/${uid}/learning_course/${courseID}`);
//     try {
//         const courseInfo = await getCourseInfo(courseID);
//         console.log(courseInfo);
//         await set(stuRef, courseInfo);
//         return Promise.resolve();
//     } catch (error) {
//         console.error("Error registering course:", error);
//         return Promise.reject(error);
//     }
// }

//cập nhật thông tin khóa học ở nhánh Students
function courseRegister(uid, courseID) { 
    const stuRef = ref(db, `Students/${uid}/learning_course/${courseID}`);
    return new Promise((resolve, reject) => {
        getCourseInfo(courseID)
            .then((courseInfo) => {
                console.log(courseInfo);
                set(stuRef, courseInfo);
                resolve();
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            })
    })
}


async function courseUpdateList(studentID, courseID) { // cập nhật thêm mssv vào stuList
    const courseRef = ref(db, `Courses/${courseID}/stuList`);
    return new Promise( async (resolve, reject) => {
        let stuList = "";
        await get(courseRef)
            .then((snapshot) => {
                stuList = snapshot.val();
                console.log("Student list: ", stuList);
                stuList += '-' +  studentID;
                console.log("Check student List: ", stuList);
            })
            .catch((err) => {
                console.log(err);
            });
        
        await update(ref(db, `Courses/${courseID}/`), {stuList: stuList})
                    .then(() => {
                    console.log("New student list updated successfully");
                    resolve();
                    })
                    .catch((error) => {
                    console.error("Error updating student list:", error);
                    reject(error);
                    });
    })
} 


async function getTimetable(id) {
    const courseRef = ref(db, `Courses/${id}/calendar`);
    return new Promise ( (resolve, reject) => {
        get(courseRef)
            .then((snapshot) => {
                resolve(snapshot.val()) 
            })
            .catch((err) => {
                reject(err)
            })
    })
  
}

//post đăng ky khóa học
// router.post("/course", function (req, res) {
//     // check_loginlearn
//     if(courseRegister(req.body.uid, req.body.courseInfo) && 
//         courseUpdateList(req.body.uid, req.body.courseInfo)) res.status(200).send("Add successful");
//     else res.send("Error");
// });

//###################################################################################
async function getsTKB(studentID) { 
    return new Promise( async (resolve, reject) => {
        try {
            let calendar = {};
            const snapshot = await get(ref(db, `/Students/${studentID}/learning_course`));
            const courseID_list = Object.keys(snapshot.val());
            
            await Promise.all( courseID_list.map(async (courseID)  => {
                calendar[courseID] = await getTimetable(courseID);
            }))

            // console.log('Calendar 1: ', calendar);
            resolve(calendar);
        }
        catch (error) { 
            reject (error);
        }
    })
}

async function getID(uuid){
    const stuRef = ref(db, `Students/${uuid}/information/ID`);
    return new Promise( (resolve, reject) => {
        onValue(stuRef, (snapshot) => {
            resolve(snapshot.val())
        }, (err) =>{
            reject(err);
        })
    }) 
}

// transcript('2222222')
//     .then((score) => {
//         console.log(score)
//     })
//     .catch((err) => {
//         console.log(err)
//     })


 module.exports = {courseUpdateList, courseRegister, getID, inforStu, transcript, courseRegister, courseUpdateList, getsTKB, GPA}
