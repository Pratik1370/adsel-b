var createError = require('http-errors');
var express = require('express');
var ejs = require('ejs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var csv=require('csvtojson');
var csvjson =require('csvjson');
var fs = require('fs');
var router = express.Router();
var moment = require('moment');
var app = express();
var session = require('express-session');

app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true,
}));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');


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
  console.log(req.params.name)
  res.sendFile(path.join(__dirname+ '/views/visualisations.html'))
});

function groupBy( array, country_name)
{

  var flag = -1;
  var date;
  var year;
  var cities = {};
  var year_check = {};
  array.forEach( function( o,i )
  {
      if(flag != -1){
        var a = array.slice(flag,1);
        flag = -1;
      }

      var key = o.Country;
        var AverageTemperature = o.AverageTemperature;
        
        
        if(o.dt === '' || o.AverageTemperature === '' || o.AverageTemperatureUncertainty === '' || o.Country === ''){

            flag = i;
        } else {
            o.AverageTemperature = parseFloat(AverageTemperature).toFixed(2);
            UncerAverageTemperature = parseFloat(o.AverageTemperatureUncertainty);

            date = moment(o.dt, 'YYYY-MM-DD').toDate();
            array[i].dt = date.getFullYear();
            year = array[i].dt;

            if(key === country_name){
                if(year >2000 && year < 2013){
                    // var year = array[i].dt;
                    var month_year = date.getMonth()+'-'+year;
                    if(month_year in year_check){
                        year_temp = ((year_check[month_year]) + (o.AverageTemperature))/2;
                    }else{
                        year_temp = o.AverageTemperature;

                    }
                    
                    year_check[month_year] = o.AverageTemperature;
                    if(!(year in cities)){
                        cities[year] = [];
                    }
                    cities[year].push(o.AverageTemperature);
                }

                // }
            }
            // array[i].AverageTemperature = o.AverageTemperature;
            // array[i].AverageTemperatureUncertainty = parseFloat(o.AverageTemperatureUncertainty);
         
    }
  });

  return {'cities': cities};

}

  function getCountryData(req, res){
  var currentPath = process.cwd();
    var jsonObj1 = '';
    var country = req.query.name;
    const csvFilePath = __dirname+'/controllers/GlobalLandTemperaturesByCountry.csv'
        // console.log(csvFilePath);

    const csv=require('csvtojson')
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
            jsonObj1 = groupBy (jsonObj, country);
            // console.log(jsonObj1);
        });
    setTimeout(function(){
        // console.log(jsonObj1);
        res.render('visualisations_data',{jsonObj1: jsonObj1});
        // res.json(jsonObj1);

    },50000);

}



app.get('/visualisations_data', function(req,res,next){
  // console.log('**********************************')
  // console.log(req.query.name)
  getCountryData(req, res);
});

app.get('/map', function(req,res){
  // res.render('map');

  res.sendFile(path.join(__dirname+ '/views/map.html'))
});

//connecting sql
// const mysql = require('mysql');  
// const fs = require('fs');
// const url = require("url");

// let connectionString = "mysql://admin:MLNHPZBFCCDODITG@sl-us-south-1-portal.30.dblayer.com:52741/compose";

// let mysqlurl = new url.URL(connectionString);

// const connection = mysql.createConnection(  
//     {
//         host: mysqlurl.hostname,
//         port: mysqlurl.port,
//         user: mysqlurl.username,
//     	password: mysqlurl.password,
//     	database: mysqlurl.pathname.split("/")[1]
// });

// connection.query('SHOW DATABASES', (err, rows) => {  
//     if (err) throw err;
//     console.log('Connected!');
//     for (let i = 0, len = rows.length; i < len; i++) {
//         console.log(rows[i]['Database'])
//     }

// });

// var sql = "create table if not exists temp(id int primary key auto_increment,title varchar(255)not null)";
//   connection.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
//   });



//   connection.query('select * from temp', function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });



module.exports = app;
