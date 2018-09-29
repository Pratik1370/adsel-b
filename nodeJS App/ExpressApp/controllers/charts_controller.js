var csvjson =require('csvjson');
var fs = require('fs');
var moment = require('moment');
var express = require('express');
var router = express.Router();

var data = {};
var map_country_json = [];
var continent_json = [];
var cities = {};
var cities_2 = {};
var jsonObj1 = '';


function getYearMapping(country){

  var yearMapping = {};
  for (years in data){
   if(!(data[years]in yearMapping) && (years < 2013)){
      yearMapping[years] = [];
    }

    for(avgTemp in data[years][country]){
      if (years < 2013)
        yearMapping[years].push(parseFloat(data[years][country][avgTemp]).toFixed(2));
    }

  }

  return yearMapping;

}


function getContinentalMapping(country){

  var avg_temp = 0;
  if(data['2013']){
        
   var temp_data = data['2013'][country];
   var count=0;
   for(var index=0; index < temp_data.length ; index++){
      count += parseInt(temp_data[index],10);
    }

    avg_temp = parseFloat(count/(temp_data.length)).toFixed(2);
            
        
  }
  return avg_temp;

}

function groupBy( array)
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

      
        
        if(o.dt === '' || o.AverageTemperature === '' || o.AverageTemperatureUncertainty === '' || o.Country === ''){

            flag = i;
        } else {
            o.AverageTemperature = parseFloat(o.AverageTemperature);
            UncerAverageTemperature = parseFloat(o.AverageTemperatureUncertainty);

            date = moment(o.dt, 'YYYY-MM-DD').toDate();
            array[i].dt = date.getFullYear();
            year = array[i].dt;

            if(year > 2000){
              if(!(year in data)){
                data[year] = [];
              }
              if(!(o.Country in data[year])){
                data[year][o.Country]=[];
              }
              data[year][o.Country].push(o.AverageTemperature);
              
             

            }    
    }
  });


 
  var avg_temp = 0;
  if(data['2013']){
        for(country in data['2013']){
            var temp_data = data['2013'][country];
            var count=0;
            for(var index=0; index < temp_data.length ; index++){
                count += parseInt(temp_data[index],10);
            }
            avg_temp = parseFloat(count/(temp_data.length)).toFixed(2);
            map_country_json.push({name: country, value: avg_temp})
        }
}

  continent_json.push({name: 'Africa', value: getContinentalMapping('Africa')});
  continent_json.push({name: 'Asia', value: getContinentalMapping('Asia')});
  continent_json.push({name: 'Antartica', value: -7.5});
  continent_json.push({name: 'Europe', value: getContinentalMapping('Europe')});
  continent_json.push({name: 'Australia', value: getContinentalMapping('Australia')});
  continent_json.push({name: 'North America', value: getContinentalMapping('North America')});
  continent_json.push({name: 'South America', value: getContinentalMapping('South America')});
  
  
 

  return {'cities': cities, 'cities_2':cities_2, 'continent_data': continent_json, 'world_map_data': map_country_json};

//   return {'single_country_Unc_temp': single_country_Unc_temp, 'single_country_temp': single_country_temp, 'array': array, 'china_data': china_data};
}





exports.index = function(req, res){
    
    var currentPath = process.cwd();

    if (jsonObj1 == ''){
     
      const csvFilePath = currentPath+'/controllers/GlobalLandTemperaturesByCountry.csv'

    const csv=require('csvtojson')
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
            jsonObj1 = groupBy (jsonObj);
            
        });
    }
    
  
    setTimeout(function(){
        res.json(jsonObj1);
    },4000);
  


    
};

exports.test = function(req,res){
  console.log(req);

  
    var currentPath = process.cwd();

    if (jsonObj1 == ''){
     
      const csvFilePath = currentPath+'/controllers/GlobalLandTemperaturesByCountry.csv'

    const csv=require('csvtojson')
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
            jsonObj1 = groupBy (jsonObj);
            
        });
    }

   var selected_country = req;
    if (selected_country != ''){
       console.log(req);

  
     cities = getYearMapping(selected_country);
     jsonObj1 = {'cities': cities, 'cities_2':cities_2, 'continent_data': continent_json, 'world_map_data': map_country_json};
    }
};

exports.test_compare = function(req,res){
  console.log(req);

  
    var currentPath = process.cwd();

    if (jsonObj1 == ''){
     
      const csvFilePath = currentPath+'/controllers/GlobalLandTemperaturesByCountry.csv'

    const csv=require('csvtojson')
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
            jsonObj1 = groupBy (jsonObj);
            
        });
    }

   var selected_country = req;
   var selected_country_2 = selected_country.split("_");


    if (selected_country != ''){
       

  
     cities = getYearMapping(selected_country_2[0]);
     cities_2 = getYearMapping(selected_country_2[1]);
     jsonObj1 = {'cities': cities, 'cities_2':cities_2, 'continent_data': continent_json, 'world_map_data': map_country_json};
    }
};