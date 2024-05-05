const { db, ref, get, child, onValue } = require('../../../fb/fb_database');
const { connectStorageEmulator } = require('firebase/storage');
const { auth, signInWithEmailAndPassword } = require('../../../fb/fb_auth');
const { response } = require('express');

class SiteController{
    // [GET]/course
    // async course(req, res){
    //     console.log(courseArray)
    //     console.log("DETAIL" + courseArray[0].material);
    //     res.render('course/course', {
    //         layout: 'main',
    //         stylesheet: '/css/app.css',
    //         courses: courseArray
    //     })
    // }

    // [GET] /
    intro(req, res, next){
        res.render('introduction', {
            layout: 'intro'
        });
    }

    // [GET] /loginl
    getlogin(req, res, next){
        res.render('login',{
            layout: 'log'
        });
    }

    // [GET] /:id


    // [POST] /login
    async login (req, res, next){
        const { email, password } = req.body;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(userCredential);
        console.log("user: ", user);
        const snapshot = await get(child(ref(db), `/Users/${user.uid}`));
        
        if (snapshot.exists()) {
            const userID = user.uid;
            const userData = snapshot.val(); // Get all user data from the snapshot
            const role = userData.role; // Access role from user data

            console.log(userID, role); // Check userID and role
            if(role === 'Teacher'){
                // res.status(200).json({userID, role});
                res.redirect(`/teacher/${userID}`);
            }
            else if(role === 'Student'){
                res.redirect(`/me/${userID}`);
            }
            else if(role === 'admin'){
                res.redirect(`/admin/${userID}`);
            }
        } 
        else {
            res.status(401).json({ error: "User data not found" });
        }
    } 
    catch (err) {
        res.status(401).json({ error: err.message });
    }
    }

    logout(req, res, next){
            auth.signOut();
            res.send("Logout");
    }
}

module.exports = new SiteController;