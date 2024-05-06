const { db, ref, get, child, onValue, set } = require('./fb_database');

const courseArray = [];
const coursRef = ref(db, 'courses');
const materialArray = [];

onValue(coursRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        courseArray.push(childData);
        materialArray.push(childData.material);
        });
        console.log('1: ' , courseArray);
        console.log(materialArray);
    }, {
        onlyOnce: true
    });

console.log('2:', courseArray);

const materialRef = ref(db, '/courses/MT1003/material');
set(materialRef, {
  c2: 'chapter 2'
})
