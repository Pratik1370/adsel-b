# -*- coding: utf-8 -*-
"""
Created on Fri Apr 27 16:19:43 2018

@author: dell Precicion
"""

from bs4 import BeautifulSoup
import urllib.request
from time import sleep
from datetime import datetime
import pandas as pd
import re

def changeDetectionMethod():
    url = "https://weather.com/weather/today/l/-37.81,144.96"
    weather = []
    req = urllib.request.urlopen(url)
    page = req.read()
    scraping = BeautifulSoup(page, 'lxml')
    
    
    #TIME CONVERSION FROM AM/PM TO 24HR FORMAT.
    
    #<span id="wtct">18 Apr 2018 at 1:41:55 pm</span>   
    getTime = scraping.findAll("p",attrs={"class":"today_nowcard-timestamp"})[0].text
    time = (re.findall('[0-9]+:[0-9]+', getTime))[0]
    hourSplit = int(time.split(':')[0])
    if getTime.find('pm') != -1: 
            time = time.replace(str(hourSplit)+':',str(hourSplit+12)+':')
    
    
    #TEMPERATURE   
    #<div class="h2">22&nbsp;°C</div>
    temperature = scraping.findAll("div",attrs={"class":"today_nowcard-temp"})[0].text
    temperature = (re.findall('[0-9]+', temperature))[0]
    
    #Pressure
    #getPressure = scraping.findNext("div",attrs={"class":"five columns"})
    getData = scraping.find_all("div",attrs={"class":"today_nowcard-sidecar component panel"})[0].text
    pressure = (re.findall('[0-9]+ in',getData))[0]
    
    
    #Humidity
    humidity = (re.findall('[0-9]+%',getData))[0]
    
    #WindSpeed
    
    #getWindSpeed = scraping.find_all("div",attrs={"class":"three columns"})[0].text
   # windSpeed = (re.findall('[0-9]+ km/h',getWindSpeed))[0]
    
    
    weather.append(time)
    weather.append(temperature)
    weather.append(pressure.replace('mbar',''))    
    weather.append('0.'+humidity.replace('%',''))
   # weather.append(windSpeed.replace(' km/h',''))
     
    return (weather)


def start():
    print("Collecting 10 Weather Data by Tempreture Change of more than 1°C")
    idx = 0
    weatherData = {'Time':[], 'Temperature':[], 'Pressure':[], 'Humidity':[]}#, 'WindSpeed':[]}
    while idx < 10:
        tmp = changeDetectionMethod()
        oldtempreture = -100
        oldpressure = -100
        oldhumidity = -100
        oldwindspeed = -100
        currtempreture = float(tmp[1])
        currpressure = float(tmp[2])
        currhumidity = float(tmp[3])
        #currwindspeed = float(tmp[4])
        if idx != 0:
            oldtempreture = float(weatherData['Temperature'][idx-1])
            oldpressure = float(weatherData['Pressure'][idx-1])
            oldhumidity = float(weatherData['Humidity'][idx-1])
            #oldwindspeed = float(weatherData['WindSpeed'][idx-1])
            
        #collect data if any weatherData change is lareger than 1
        if abs(currtempreture - oldtempreture) < 1:             #temp different
            if abs(currpressure - oldpressure) < 1:             #
                if abs(currhumidity - oldhumidity) < 1:         #
                    #if abs(currwindspeed - oldwindspeed) < 1:   #
                        sleep(15)
                        continue
#        if abs(currtempreture - oldtempreture) < 1: sleep(1) continue

#        else if abs(currpressure - oldtempreture) < 1: sleep(1); continue
#        else if abs(currhumidity - oldtempreture) < 1: sleep(1); continue
#        else if abs(currwindspeed - oldtempreture) < 1: sleep(1); continue
#    
        print('collecting weather data '+str(idx))
        print('TEMPERATURE changes from '+str(oldtempreture)+' to '+str(currtempreture))
        print('PRESSURE changes from '+str(oldpressure)+' to '+str(currpressure))
        print('HUMIDITY changes from '+str(oldhumidity)+' to '+str(currhumidity))
        #print('WINDSPEED changes from '+str(oldwindspeed)+' to '+str(currwindspeed))
        weatherData['Time'].append(tmp[0])
        weatherData['Temperature'].append(tmp[1])
        weatherData['Pressure'].append(tmp[2])
        weatherData['Humidity'].append(tmp[3])
        #weatherData['WindSpeed'].append(tmp[4])
        idx +=1
        sleep(15)
    data = pd.DataFrame(weatherData)
    data.to_csv(r'F:\Rohail\Deakin University\MIT (Professional)\2018 Trimester 1\SIT742 Modern Data Science\task_1.2.csv', index=False)
    print('Endo of Test')
start()