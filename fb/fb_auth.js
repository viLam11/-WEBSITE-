const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { db, ref, get, child } = require('../fb/fb_database');
const { fb_app } = require("./firebase");

const auth = getAuth(fb_app);

const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const dbRef = ref(db);
        get(child(dbRef, `/Users/${userCredential.user.uid}`))
            .then((snapshot) => {
            if (snapshot.exists()) {
                // localStorage.setItem("ID", JSON.stringify(userCredential.user.uid));
                // localStorage.setItem("personInf", JSON.stringify(snapshot.val().personal_details));
            }
            else console.log("No data available");
            })
            .catch((error) => {
                console.error(error);
            });
    }
    catch(error) {
        alert("Error code " + error.code + ": " + error.errorMessage);
    }

};

module.exports  = { auth, signIn, signInWithEmailAndPassword };
