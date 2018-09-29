# -*- coding: utf-8 -*-
"""
Created on Fri Apr 27 15:49:30 2018

@author: dell Precicion
"""

from bs4 import BeautifulSoup
import urllib.request
from time import sleep
import pandas as pd
import re

def regularIntervalMethod():
    url = "https://www.timeanddate.com/weather/australia/melbourne"
    weather = []
    req = urllib.request.urlopen(url)
    page = req.read()
    scraping = BeautifulSoup(page, 'lxml')
    
    
    #TIME CONVERSION FROM AM/PM TO 24HR FORMAT.
    
    #<span id="wtct">18 Apr 2018 at 1:41:55 pm</span>   
    getTime = scraping.findAll("span",attrs={"id":"wtct"})[0].text
    time = (re.findall('[0-9]+:[0-9]+', getTime))[0]
    hourSplit = int(time.split(':')[0])
    if getTime.find('pm') != -1: 
    		time = time.replace(str(hourSplit)+':',str(hourSplit+12)+':')


    #TEMPERATURE   
    #<div class="h2">22&nbsp;°C</div>
    temperature = scraping.findAll("div",attrs={"class":"h2"})[0].text
    print (temperature)
    temperature = (re.findall('[0-9]+', temperature))[0]
            
    #Pressure
    #getPressure = scraping.findNext("div",attrs={"class":"five columns"})
    getData = scraping.find_all("div",attrs={"class":"five columns"})[0].text
    pressure = (re.findall('[0-9]+ mbar',getData))[0]

    
    #Humidity
    humidity = (re.findall('[0-9]+%',getData))[0]
    
    #WindSpeed
    
   # getWindSpeed = scraping.find_all("div",attrs={"class":"three columns"})[0].text
   # windSpeed = (re.findall('[0-9]+ km/h',getWindSpeed))[0]


    weather.append(time)
    weather.append(temperature)
    weather.append(pressure.replace('mbar',''))    
    weather.append('0.'+humidity.replace('%',''))
   # weather.append(windSpeed.replace(' km/h',''))
 
#    print (weather)
    return (weather)
    

def startRegularIntervalMethod():
    print("Scraping Procedure Started")
    weatherData = {'Time':[], 'Temperature':[], 'Pressure':[], 'Humidity':[]} #, 'WindSpeed':[]}
    dataRecordCount = 0
    while dataRecordCount < 10:
        print("Collecting " +str(dataRecordCount)+ " Data Record")
        tmp = regularIntervalMethod()
        weatherData['Time'].append(tmp[0])
        weatherData['Temperature'].append(tmp[1])
        weatherData['Pressure'].append(tmp[2])
        weatherData['Humidity'].append(tmp[3])
#       weatherData['WindSpeed'].append(tmp[4])
        dataRecordCount +=1
        sleep (1)
    data = pd.DataFrame(weatherData)
    data.to_csv(r'F:\Rohail\Deakin University\MIT (Professional)\2018 Trimester 1\SIT742 Modern Data Science\task_2.1.csv',index=False)
    print("DONE - CHECK CSV FILE FOR RESULTS")


startRegularIntervalMethod()