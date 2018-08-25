var csvjson =require('csvjson');
var fs = require('fs');
var moment = require('moment');

function groupBy( array)
{
  var groups = {};    var array2 = {}; var single_country_temp = []; var china_data = [];
//   array2['country'] = [];
//   array2['temp'] = [];
  var flag = -1;
  var date;
  array.forEach( function( o,i )
  {
      if(flag != -1){
        //   console.log('In flag');
        var a = array.slice(flag,1);
        flag = -1;
      }

      var innerarray = [];
      var key = o.Country;
        // var index = array2['country'].indexOf(key);
        var AverageTemperature = o.AverageTemperature;

        
        if(o.dt === '' || o.AverageTemperature === '' || o.AverageTemperatureUncertainty === '' || o.City === '' || o.Country === ''){
            // console.log('flag '+i);
            flag = i;
        } else {
            AverageTemperature = parseFloat(AverageTemperature);
            if(key === "China"){
                single_country_temp.push(AverageTemperature);
            }
            array[i].AverageTemperature = AverageTemperature;
            array[i].AverageTemperatureUncertainty = parseFloat(o.AverageTemperatureUncertainty);
            // array[i].dt = moment(o.dt, 'YYYY-MM-DD').toDate();
            date = moment(o.dt, 'YYYY').toDate();
            array[i].dt = date.getFullYear();
            if(key === "China"){
                var array2 = {}; 
                array2['country'] = key;
                array2['temp'] = AverageTemperature;
                array2['city'] = o.City;
                // console.log(o);
                // console.log(array2);
                china_data.push(array2);
              }
            //   else{
            //     var prev_temp = array2['temp'][index];
            //     if(prev_temp < AverageTemperature){
            //         array2['temp'][index] = AverageTemperature;
            //   }
        // } 
    }
  });
  console.log(array[87335]);
  return {'single_country_temp': single_country_temp, 'array': array, 'china_data': china_data};
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
        res.render('dashboard',{result: jsonObj1});
    },2000);
  


    
};