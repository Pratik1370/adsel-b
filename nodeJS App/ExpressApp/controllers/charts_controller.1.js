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
      scatter_years[country].push([obj.AverageTemperature, year])
  return scatter_years;
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
        
        
        if(o.dt === '' || o.AverageTemperature === '' || o.AverageTemperatureUncertainty === '' || o.Country === ''){

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
            if(key === "Australia"){
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

exports.aa = function(req, res){
    console.log(req);
};

exports.index = function(req, res){
    // console.log(req);
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
        // res.render('map',{result: jsonObj1});
        res.json(jsonObj1);
    },5000);
};
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
    var single_country_temp = []; 
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
  
              if(key === country_name){
                //   if(year > 2010){
                //     //   scatter_years = scatter_years_plot(o, array[i].dt, scatter_years);
                //       if(year >2011 && year < 2014 && (date.getMonth() < 7 && date.getMonth() > 0)){
                //           if(!(year in six_month_temp)){
                //               six_month_temp[year] = [];
                //           }
                //               six_month_temp[year][date.getMonth()-1] = o.AverageTemperature;
                //         }
                //   }
                  if(array[i].dt>2000){
                      var year = array[i].dt;
                      var month_year = date.getMonth()+'-'+year;
                    //   var city = o.dt;
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
                      
                    //   single_country_temp.push(o.AverageTemperature);
                    //   single_country_Unc_temp.push(UncerAverageTemperature);
                      cities[year].push(o.AverageTemperature);
                  }
  
                  // }
              }
              array[i].AverageTemperature = o.AverageTemperature;
              array[i].AverageTemperatureUncertainty = parseFloat(o.AverageTemperatureUncertainty);
             
          
                  // World Map 
  
                //   if(array[i].dt == 2013){
                //       if(!(o.Country in map_data)){
                //           map_data[o.Country] = [];
                //       }else{
                //           map_data[o.Country].push(o.AverageTemperature);
                //       }
                //   }    
      }
    });
    // var map_country_json = [];
//     var avg_temp = 0;
//     if(map_data){
//           for(country in map_data){
//               var temp_data = map_data[country];
//               var count=0;
//               for(var index=0; index < temp_data.length ; index++){
//                   count += parseInt(temp_data[index],10);
//               }
//               avg_temp = count/(temp_data.length);
//               map_country_json.push({name: country, value: avg_temp})
//           }
//   }
  
    return cities;
  
  //   return {'single_country_Unc_temp': single_country_Unc_temp, 'single_country_temp': single_country_temp, 'array': array, 'china_data': china_data};
  }
  
  
    function getCountryData(req, res){
    var currentPath = process.cwd();
      var jsonObj1 = '';
      var country = req;
      const csvFilePath = currentPath+'/controllers/GlobalLandTemperaturesByCountry.csv'
  
      const csv=require('csvtojson')
      csv()
          .fromFile(csvFilePath)
          .then((jsonObj)=>{
              jsonObj1 = groupBy (jsonObj, country);
              console.log(jsonObj1);
          });
      setTimeout(function(){
        //   res.render('visualisations_data',jsonObj1);  
        return 'aaaaaa';
      },50000);
  
  }
exports.get_detail = function(req, res){
        var ab = getCountryData(req, res);
        console.log(ab);

        return ab;

};