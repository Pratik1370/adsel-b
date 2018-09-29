from bs4 import BeautifulSoup
import urllib.request
from time import sleep
import pandas as pd
import re
def regularintervalsampling():
    url = "https://weather.com/weather/today/l/-37.81,144.96"
    weather = []
    req = urllib.request.urlopen(url)
    page = req.read()
    scraping = BeautifulSoup(page, 'lxml')
    #Time converted into 24 hour format
    getTime = scraping.findAll("p",attrs={"class":"today_nowcard-timestamp"})[0].text
    time = (re.findall('[0-9]+:[0-9]+', getTime))[0]
    hourSplit = int(time.split(':')[0])
    if getTime.find('pm') != -1: 
            time = time.replace(str(hourSplit)+':',str(hourSplit+12)+':') 
    #Temperature   
    temperature = scraping.findAll("div",attrs={"class":"today_nowcard-temp"})[0].text
    temperature = (re.findall('[0-9]+', temperature))[0]
    temperature = (int(temperature)-32)*5/9
    temperature = round(temperature)
    temperature = str(temperature)
    #Humidity
    getData = scraping.find_all("div",attrs={"class":"today_nowcard-sidecar component panel"})[0].text
    humidity = (re.findall('[0-9]+%',getData))[0]
    #WindSpeed
    windSpeed = (re.findall('[0-9]+ mph',getData))[0]
    windSpeed = (re.findall('[0-9]+',windSpeed))[0]
    windSpeed = int(windSpeed)*1.60934
    windSpeed = round(windSpeed)
    windSpeed = str(windSpeed)  
    print(time)
    print(temperature+'°C')
    print(humidity)
    print(windSpeed+'km/h')    
    weather.append(time)
    weather.append(temperature)
    weather.append('0.'+humidity.replace('%',''))
    weather.append(windSpeed.replace('mph',''))     
    return (weather)
def regularintervalsamplingbegin():
    print("Web Scraping Initialized")
    weatherData = {'Time':[], 'Temperature':[], 'Humidity':[], 'WindSpeed':[]} 
    dataRecordCount = 0
    while dataRecordCount < 10:
        print("Collecting Data Record " +str(dataRecordCount+1))
        tmp = regularintervalsampling()
        weatherData['Time'].append(tmp[0])
        weatherData['Temperature'].append(tmp[1])
        weatherData['Humidity'].append(tmp[2])
        weatherData['WindSpeed'].append(tmp[3])
        dataRecordCount +=1
        sleep (1800)
    data = pd.DataFrame(weatherData)
    data.to_csv(r'F:\Rohail\Deakin University\MIT (Professional)\2018 Trimester 1\SIT742 Modern Data Science\task_2.1.csv',index=False)
    print("Data Collected-CSV File Compiled")
regularintervalsamplingbegin()