var csvjson =require('csvjson');
var fs = require('fs');
var moment = require('moment');

function scatter_years_plot(obj, year, scatter_years){
    var country = obj.Country;
      if(!(obj.Country in scatter_years)){
          scatter_years[country] = [];
        //   if(!(year in scatter_years.country)){
        //       scatter_years.country[year] = [];
        //   }
      }
    //   console.log(obj);
      scatter_years[country].push([obj.AverageTemperature, year])
  return scatter_years;
}

function groupBy( array)
{
  var groups = {};    
  var array2 = []; 
  var single_country_temp = []; 
  var china_data = [];
//   array2['country'] = [];
//   array2['temp'] = [];
  var flag = -1;
  var date;
  var cities = {};
  var scatter_years = {};
  var single_country_Unc_temp = [];
  var six_month_temp = {};

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
            o.AverageTemperature = parseFloat(AverageTemperature);
            UncerAverageTemperature = parseFloat(o.AverageTemperatureUncertainty);

            date = moment(o.dt, 'YYYY-MM-DD').toDate();
            array[i].dt = date.getFullYear();
            year = array[i].dt;

            if(key === "Canada"){
                if(year > 2010){
                    scatter_years = scatter_years_plot(o, array[i].dt, scatter_years);
                }
            }
            if(key === "Australia"){
                if(year > 2010){
                    scatter_years = scatter_years_plot(o, array[i].dt, scatter_years);
                    if(year >2011 && year < 2014 && (date.getMonth() < 7 && date.getMonth() > 0)){
                        if(!(year in six_month_temp)){
                            six_month_temp[year] = [];
                        }

                        console.log(date);
                        console.log(date.getMonth());
                        console.log(six_month_temp);
                    
                        // if(typeof six_month_temp.year === 'undefined'){
                            six_month_temp[year][date.getMonth()-1] = o.AverageTemperature;

                            // if(six_month_temp.year[date.getMonth()] < o.AverageTemperature){
                            //     six_month_temp.year[date.getMonth()] = o.AverageTemperature;
                            // }
                        // }
                    }
                }

                if(array[i].dt==2011){
                        var city = o.City;
                        if(!(city in cities)){
                            cities[city] = [];
                        }
                        single_country_temp.push(o.AverageTemperature);
                        single_country_Unc_temp.push(UncerAverageTemperature);
                        cities[city].push(o.AverageTemperature);
                    }
                // }
            }
            array[i].AverageTemperature = o.AverageTemperature;
            array[i].AverageTemperatureUncertainty = parseFloat(o.AverageTemperatureUncertainty);
            // array[i].dt = moment(o.dt, 'YYYY-MM-DD').toDate();
          /*  
            if(key === "China"){
                var array2 = {}; 
                array2['country'] = key;
                array2['temp'] = AverageTemperature;
                array2['city'] = o.City;
                // console.log(o);
                // console.log(array2);
                china_data.push(array2);
              }*/

            //   else{
            //     var prev_temp = array2['temp'][index];
            //     if(prev_temp < AverageTemperature){
            //         array2['temp'][index] = AverageTemperature;
            //   }
        // } 
    }
  });

  return {'single_country_Unc_temp': single_country_Unc_temp, 
        'single_country_temp': single_country_temp,'six_month_temp': six_month_temp ,
        'cities': cities, 'scatter_years': scatter_years};

//   return {'single_country_Unc_temp': single_country_Unc_temp, 'single_country_temp': single_country_temp, 'array': array, 'china_data': china_data};
}

exports.index = function(req, res){
    var currentPath = process.cwd();
    var jsonObj1 = '';

    const csvFilePath = currentPath+'/controllers/GlobalLandTemperaturesByMajorCity.csv'

    const csv=require('csvtojson')
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
            jsonObj1 = groupBy (jsonObj);
        });
    setTimeout(function(){
        // console.log(jsonObj1);
        // res.render('dashboard',{result: jsonObj1});
        res.json(jsonObj1);
    },5000);
  


    
};