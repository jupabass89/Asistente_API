var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('../BD/firebase');

var app = express();

let results = [];

// MIDDLEWARES

app.use(express.json());

app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if(req.method ==='OPTIONS'){
  res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
  return res.status(200).json({});
  }
  next();
  });

//GET

app.get('/', async function (req, res) {
  results = [];
  await db.collection('reports').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let data = doc.data();
        data.id = doc.id;
        results.push(data);
      });
    })
    .catch(error => {
      console.log(error);
    });
  res.send(results);
});

//POST

app.post('/', function (req, res) {
  let data = req.body;
  db.collection('reports').add(data)
    .then(() => {
      res.status(200).send({
          response: '200 OK'
        }
      );
    });
});

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json({
    message: res.local.message,
    error: res.locals.error
  });
});

module.exports = app;
