const path = require('path')
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const app = express();
const port = 4000;


const route = require('./routes');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
//HTTP logger
app.use(morgan('combined'));

app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: {
        sum: (a, b) => a+b,
        eq: function (a, b) {
            return a === b;
        },
        or: function (a, b, c) {
          return a || b || c;
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));


// route
route(app);

// 127.0.0.1 - localhost
app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})
