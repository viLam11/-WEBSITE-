const siteRouter = require('./site.route');
const studentRouter = require('./student.route');
const teacherRouter = require('./teacher.route');
const adminRouter = require('./admin.route');

function route(app){
    app.use('/me', studentRouter);
    app.use('/teacher', teacherRouter);
    app.use('/admin', adminRouter);
    app.use('/', siteRouter);
}

module.exports = route;
