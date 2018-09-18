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



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

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

function scatter_years_plot(obj, year, scatter_years){
  var country = obj.Country;
    if(!(obj.Country in scatter_years)){
        scatter_years[country] = [];
      //   if(!(year in scatter_years.country)){
      //       scatter_years.country[year] = [];
      //   }
    }
    scatter_years[country].push([obj.AverageTemperature, year])
return scatter_years;
}

function groupBy( array, country_name)
{
  var groups = {};    
  var array2 = []; 
  var single_country_temp = []; 
  var china_data = [];
  var year_temp = 0;
//   array2['country'] = [];
//   array2['temp'] = [];
  var flag = -1;
  var date;
  var cities = {};
  var scatter_years = {};
  var single_country_Unc_temp = [];
  var six_month_temp = {};
  var map_data={};
    var year_check = {};
  array.forEach( function( o,i )
  {
      if(flag != -1){
        var a = array.slice(flag,1);
        flag = -1;
      }

      var key = o.Country;
        var AverageTemperature = o.AverageTemperature;
        
        
        if(o.dt === '' || o.AverageTemperature === '' || o.AverageTemperatureUncertainty === '' || o.City === '' || o.Country === ''){

            flag = i;
        } else {
            o.AverageTemperature = parseFloat(AverageTemperature).toFixed(2);
            UncerAverageTemperature = parseFloat(o.AverageTemperatureUncertainty);

            date = moment(o.dt, 'YYYY-MM-DD').toDate();
            array[i].dt = date.getFullYear();
            year = array[i].dt;

            if(key === "Canada"){
                if(year > 2010){
                    scatter_years = scatter_years_plot(o, array[i].dt, scatter_years);
                }
            }
            if(key === country_name){
                if(year > 2010){
                    scatter_years = scatter_years_plot(o, array[i].dt, scatter_years);
                    if(year >2011 && year < 2014 && (date.getMonth() < 7 && date.getMonth() > 0)){
                        if(!(year in six_month_temp)){
                            six_month_temp[year] = [];
                        }
                    
                        // if(typeof six_month_temp.year === 'undefined'){
                            six_month_temp[year][date.getMonth()-1] = o.AverageTemperature;

                            // if(six_month_temp.year[date.getMonth()] < o.AverageTemperature){
                            //     six_month_temp.year[date.getMonth()] = o.AverageTemperature;
                            // }
                        // }
                    }
                }

                // if(array[i].dt>=1900 && array[i].dt<=2000){
                //         var city = o.City;
                //         if(!(city in cities)){
                //             cities[city] = [];
                //         }
                //         single_country_temp.push(o.AverageTemperature);
                //         single_country_Unc_temp.push(UncerAverageTemperature);
                //         cities[city].push(o.AverageTemperature);
                //     }

                if(array[i].dt>2000){
                    var year = array[i].dt;
                    var month_year = date.getMonth()+'-'+year;
                    var city = o.dt;
                    if(month_year in year_check){
                        year_temp = ((year_check[month_year]) + (o.AverageTemperature))/2;
                        // console.log(year_check[month_year]);
                    }else{
                        year_temp = o.AverageTemperature;

                    }
                    
                    year_check[month_year] = o.AverageTemperature;
                    if(!(year in cities)){
                        cities[year] = [];
                    }
                    
                    single_country_temp.push(o.AverageTemperature);
                    single_country_Unc_temp.push(UncerAverageTemperature);
                    cities[year].push(o.AverageTemperature);
                }

                // }
            }
            array[i].AverageTemperature = o.AverageTemperature;
            array[i].AverageTemperatureUncertainty = parseFloat(o.AverageTemperatureUncertainty);
           
        
                // World Map 

                if(array[i].dt == 2013){
                    if(!(o.Country in map_data)){
                        map_data[o.Country] = [];
                    }else{
                        map_data[o.Country].push(o.AverageTemperature);
                    }
                }    
    }
  });
  var map_country_json = [];
  var avg_temp = 0;
  if(map_data){
        for(country in map_data){
            var temp_data = map_data[country];
            var count=0;
            for(var index=0; index < temp_data.length ; index++){
                count += parseInt(temp_data[index],10);
            }
            avg_temp = count/(temp_data.length);
            map_country_json.push({name: country, value: avg_temp})
        }
}
// console.log(cities);

// var country_decade_temp = [];
// if(cities){
//     for(year in cities){
//         var temp_data = cities[year];
//         var count=0;
//         for(var index=0; index < temp_data.length ; index++){
//             count += parseInt(temp_data[index],10);
//         }
//         console.log(year);
//         avg_temp = count/(temp_data.length);
//         country_decade_temp.push({name: country, value: avg_temp})
//     }
// }
// console.log(map_country_json);

  return {'single_country_Unc_temp': single_country_Unc_temp, 
        'single_country_temp': single_country_temp,'six_month_temp': six_month_temp ,
        'cities': cities, 'scatter_years': scatter_years, 'world_map_data': map_country_json};

//   return {'single_country_Unc_temp': single_country_Unc_temp, 'single_country_temp': single_country_temp, 'array': array, 'china_data': china_data};
}


// var getCountryData = function (req, res) {
  function getCountryData(req, res){
  var currentPath = process.cwd();
    var jsonObj1 = '';
    var country = req.query.name;
    const csvFilePath = __dirname+'/controllers/GlobalLandTemperaturesByMajorCity.csv'
        console.log(csvFilePath);

    const csv=require('csvtojson')
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
            jsonObj1 = groupBy (jsonObj, country);
            console.log(jsonObj1);
        });
    setTimeout(function(){
        // console.log(jsonObj1);
        res.render('visualisations_data',{jsonObj1: jsonObj1});
        // res.json(jsonObj1);
        // return callback(null, jsonObj1);

    },50000);
    // return callback(null, jsonObj1);

}



app.get('/visualisations_data', function(req,res,next){
  console.log('**********************************')
  console.log(req.query.name)
  getCountryData(req, res);
});

app.get('/map', function(req,res,html){
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
