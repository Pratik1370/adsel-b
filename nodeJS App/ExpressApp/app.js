var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  console.log(err.message);

  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/visualisations', function(req,res,html){
  res.sendFile(path.join(__dirname+ '/views/visualisations.html'))
});

//connecting sql
const mysql = require('mysql');  
const fs = require('fs');
const url = require("url");

let connectionString = "mysql://admin:MLNHPZBFCCDODITG@sl-us-south-1-portal.30.dblayer.com:52741/compose";

let mysqlurl = new url.URL(connectionString);

const connection = mysql.createConnection(  
    {
        host: mysqlurl.hostname,
        port: mysqlurl.port,
        user: mysqlurl.username,
    	password: mysqlurl.password,
    	database: mysqlurl.pathname.split("/")[1]
});

connection.query('SHOW DATABASES', (err, rows) => {  
    if (err) throw err;
    console.log('Connected!');
    for (let i = 0, len = rows.length; i < len; i++) {
        console.log(rows[i]['Database'])
    }

});

var sql = "create table if not exists temp(id int primary key auto_increment,title varchar(255)not null)";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });



  connection.query('select * from temp', function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });



module.exports = app;
