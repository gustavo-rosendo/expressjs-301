const path = require('path');

const express = require('express');
const app = express();

const helmet = require('helmet');
app.use(helmet({contentSecurityPolicy: false }));

const cookieParser = require('cookie-parser');
const { Router } = require('express');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false, limit: '5mb' }));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  if(req.query.msg === 'fail') {
    res.locals.msg = 'Sorry, wrong username/password.';
  }
  else {
    res.locals.msg = '';
  }
  next();
});

// app.param() - is good to use if you have many routes with the same wildcard (ex.: id)
// you can then do some checks 
// It takes 2 args:
// 1. param to look for in the route 
// 2. the callback to run (with the usuals)
app.param('id', (req, res, next, id) => {
  console.log('params called: ', id);
  // do some checks here (eg.: if id has something to do with stories or with blog...)
  next();
});

app.get('/', (req, res, next) => {
  res.send('Sanity check!');
});

app.get('/login', (req, res, next) => {
  // req.query is an object which has a property for each key in the query string
  // The query string is where you put INSECURE stuff because everyone can see it
  // console.log(req.query);
  res.render('login');
});

app.post('/process_login', (req, res, next) => {
  // req.body is made by urlenconded, which parses the http message for sent data
  // 
  const {username, password} = req.body;
  console.log('username: ', username);
  console.log('password: ', password);

  // check the db to see if the username/password are valid
  // if they are valid ...
  // - save their username in a cookie (data is saved in the browser)
  // - send the user to the welcome page
  if(password === "123123") {
    // res.cookie takes 2 args:
    // 1. name of the cookie
    // 2. value to set it with
    res.cookie('username', username);
    res.redirect('welcome');
  }
  else {
    // res.render('login');
    res.redirect('login?msg=fail&test=hello');
  }
});

app.get('/welcome', (req, res, next) => {
  res.render('welcome', {
    // req.cookies will have a property for each cookie we've set
    username: req.cookies.username
  });
});

// in a route, anytime something has a : in front, it is a wildcard!
// a wildcard will match anything in that slot
app.get('/story/:id', (req, res, next) => {
  // the req.params object always exists
  // it will have a property for each wildcard in the route
  res.send(`<h1>Story ${req.params.id}</h1>`);
});

app.get('/story/:storyId/:link', (req, res, next) => {
  // the req.params object always exists
  // it will have a property for each wildcard in the route
  res.send(`<h1>Story ${req.params.storyId} - ${req.params.link}</h1>`);
});

app.get('/logout', (req, res, next) => {
  res.clearCookie('username');
  res.render('login');
});

app.get('/statement', (req, res, next) => {
  // res.sendFile(path.join(__dirname, 'userStatements/BankStatementChequing.png'));

  // app has a download method!
  // it takes 2 args:
  // 1. filename
  // 2. optionally, you want to change the file name to download as
  // res.download also sets the headers for the download!
  // 1. content-disposition: 'attachment', with a filename of the 2nd arg
  res.download(path.join(__dirname, 'userStatements/BankStatementChequing.png'), 'statement_Gustavo.png', (error) => {
    // if there is an error in sending the file 
    // the headers may already be sent
    if(error) {
      // check if the headers have already been sent
      if(!res.headersSent) {
        res.redirect('/download/error');
      }
    }
  });
})

app.listen(3000);