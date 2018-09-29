# -*- coding: utf-8 -*-
"""
Created on Fri Apr 27 16:18:52 2018

@author: dell Precicion
"""

from bs4 import BeautifulSoup
import urllib.request
from time import sleep
import pandas as pd
import re

def regularIntervalMethod():
    url = "https://weather.com/weather/today/l/-37.81,144.96"
    weather = []
    req = urllib.request.urlopen(url)
    page = req.read()
    scraping = BeautifulSoup(page, 'lxml')
    
    
    #TIME CONVERSION FROM AM/PM TO 24HR FORMAT.
    
    #<div class="col-md-8 col-sm-7"><h3>Melbourne Current weather report</h3><small><strong>Local Time: Tue 24<sup>th</sup> Apr 9:50 pm</strong></small></div>  
#    <p class="today_nowcard-timestamp"><span>as of </span><span>3:08 pm AEST</span></p>
    getTime = scraping.findAll("p",attrs={"class":"today_nowcard-timestamp"})[0].text
    time = (re.findall('[0-9]+:[0-9]+', getTime))[0]
    hourSplit = int(time.split(':')[0])
    if getTime.find('pm') != -1: 
            time = time.replace(str(hourSplit)+':',str(hourSplit+12)+':')
    
    
    #TEMPERATURE   
#    <div class="today_nowcard-temp"><span class="">63<sup>°</sup></span></div>
    temperature = scraping.findAll("div",attrs={"class":"today_nowcard-temp"})[0].text
    temperature = (re.findall('[0-9]+', temperature))[0]
            
    #Pressure
    #<div class="report_text"><table class="table">
#    <div class="today_nowcard-sidecar component panel"><table><caption>Right Now</caption><tbody><tr><th>Wind</th><td><span class="">S 11 mph </span></td></tr><tr><th>Humidity</th><td><span class=""><span>60<span class="Percentage-8191otA9__percentSymbol__2GRZS">%</span></span></span></td></tr><tr><th>Dew Point</th><td><span class="">49<sup>°</sup></span></td></tr><tr><th>Pressure</th><td><span class="">30.30 in <span class="icon icon-font iconset-arrows icon-arrow-down-line" classname="icon icon-font iconset-arrows icon-arrow-down-line"></span></span></td></tr><tr><th>Visibility</th><td><span class="">8.0 mi</span></td></tr></tbody></table></div>
    getData = scraping.find_all("div",attrs={"class":"today_nowcard-sidecar component panel"})[0].text
    pressure = (re.findall('[0-9]+ in',getData))[0]
#    30.30 in
    
    #Humidity
    humidity = (re.findall('[0-9]+%',getData))[0]
    
    #WindSpeed
    #<div>Wind: 6 mph from SSW <i class="wi wi-wind wi-from-ssw" style="font-size: 38px; color: #A4F6E9;"></i></div>
#    getWindSpeed = scraping.find_all("div",attrs={"class":"col-md-6 col-xs-6 report_left"})[0].text
#    windSpeed = (re.findall('[0-9]+ mph',getWindSpeed))[0]
#    windSpeed = windSpeed.replace(' mph','')
#    windSpeed = int(windSpeed) * 1.60934
    
    print(time)
    print(temperature)
    print(pressure)
    print(humidity)
    
    
    
    weather.append(time)
    weather.append(temperature)
    weather.append(pressure.replace('in',''))    
    weather.append('0.'+humidity.replace('%',''))
#    weather.append(windSpeed)
     
    print (weather)
    return (weather)
    

def startRegularIntervalMethod():
    print("Scraping Procedure Started")
    weatherData = {'Time':[], 'Temperature':[], 'Pressure':[], 'Humidity':[]} 
    dataRecordCount = 0
    while dataRecordCount < 10:
        print("Collecting " +str(dataRecordCount)+ " Data Record")
        tmp = regularIntervalMethod()
        weatherData['Time'].append(tmp[0])
        weatherData['Temperature'].append(tmp[1])
        weatherData['Pressure'].append(tmp[2])
        weatherData['Humidity'].append(tmp[3])
#        weatherData['WindSpeed'].append(tmp[4])
        dataRecordCount +=1
        sleep (1)
    data = pd.DataFrame(weatherData)
    data.to_csv(r'F:\Rohail\Deakin University\MIT (Professional)\2018 Trimester 1\SIT742 Modern Data Science\task_1.1.csv',index=False)
    print("DONE - CHECK CSV FILE FOR RESULTS")


startRegularIntervalMethod()