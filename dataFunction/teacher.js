const { db, ref, get, set, child, getTKB } = require('../fb/fb_database');
const { check_login } = require('../fb/fb_auth');

const express = require('express');
const   router = express.Router();

/*
xem lịch dạy
xem khóa học đang dạy
nhập diem
xem thong tin cá nhân
*/


function setTKB(courseID, location, weeks, date, time) { // Cập nhật lại TKB
    try {
        set(ref(db, `/Courses/${courseID}/calendar`), {
            location: location,
            weeks: weeks,
            date: date,
            time: time
        });
        return true;
    }
    catch (error) { 
        throw (error);
    }
} 



function setMaterial(courseID, bookName, link) { //Upload tên sách + link tài liệu
    try {
        console.log(courseID)
        set(ref(db, `/Courses/${courseID}/material`), {
            book: bookName,
            link: link
        });
        return true;
    }
    catch (error) { 
        throw (error);
    }
}

//############################################################################################################################################

// router.post("/nhap_diem", async function(req, res) { //GV nhap diem cho SV
//     // check_login();
//     const { courseID, studentID, BT, BTL, KT, final } = req.body; 
//     if(setScore(courseID, studentID, BT, BTL, KT, final)) res.status(200).send("Nhap diem OK");
//     else res.send("Error");
// });

// router.post("/tkb", function (req, res) { //Nhap TKB mới
//     // check_login();
//     const { courseID, location, weeks, date, time } = req.body;
//     if(setTKB(courseID, location, weeks, date, time )) res.status(200).send("Nhap TKB OK");
//     else res.send("Error");
// });

router.get("/tkb", async function (req, res) { //Xem tat ca TKB
    // check_login();
    const tkb = await getsTKB(req.body.uid);
    if(tkb) res.status(200).send(tkb);
    else res.send("Error");
});

router.post("/uploadmaterial", function(req, res) { // Upload tai lieu
    // check_login();
    const { courseID, bookName, link } = req.body;
    console.log(bookName)
    if(setMaterial(courseID, bookName, link)) res.status(200).send("Cap nhap tai lieu OK");
    else res.send("Error");
}); 

module.exports = router;
