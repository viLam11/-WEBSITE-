const { response } = require('express');
const { db, ref, get, child, set, onValue } = require('../../../fb/fb_database');
const { course } = require('./SiteController');

class CourseController{
    // [POST] course/store
    async store(req, res, next){
      const formdata = req.body;
      const courseRef = ref(db, `/courses/${formdata.id}`);
      console.log('KHÓA HỌC MỚI: ', formdata);
      await set(courseRef, formdata);
      res.redirect('/course');
    }

    // [GET] course/create
    create(req, res, next){
        res.render('create');
    }

    // [GET] course/:slug
    async show(req, res, next){
        const slug = req.params.slug
        const courseDetailRef = ref(db, `/Courses/${slug}`)
        let courseDetail = {};
        let material = {};
        await get(courseDetailRef)
            .then( (snapshot) => {
                courseDetail = snapshot.val();
                material = courseDetail.material;
                console.log('COURSE DETAIL: ', courseDetail);
                res.render('course/detail', {
                    layout: 'main',
                    stylesheet: '/css/course.detail.css',
                    course: courseDetail,
                    material: material
                }) 
            })
    }

    async index(){
        const courseRef = ref(db, '/Courses');
        let courseArray = [];
        onValue(courseRef, (snapshot) => {
            snapshot.forEach( (childSnapshot) => {
                courseArray.push(childSnapshot.val());
            })

            res.render('course/course', {
                layout: 'main',
                stylesheet: '/css/course.detail.css',
                stylesheet2: '/css/layout.css',
                courses: courseArray
            })
        })
    }
}

module.exports = new CourseController;