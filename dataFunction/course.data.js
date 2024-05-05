const { QuerySnapshot } = require('firebase/firestore');
const { db, firebase, getFirestore,  collection, addDoc } = require('../../fb/fb_database');

// const coursRef = ref(db, 'courses');
// const courses = [];

// onValue(coursRef, (snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//       const childData = childSnapshot.val();
//         courses.push(childData);
//     });
//     console.log(courses);
//   }, {
//     onlyOnce: true
//   });

db.collection("courses").get()
  .then( (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id}: ${doc.data()}`)
    })
  })

module.exports = courses;