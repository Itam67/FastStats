from io import SEEK_CUR
import requests
import csv
from bs4 import BeautifulSoup

topics = []
urls = ['https://ourworldindata.org/world-population-growth','https://ourworldindata.org/age-structure','https://ourworldindata.org/gender-ratio','https://ourworldindata.org/life-expectancy','https://ourworldindata.org/fertility-rate']
all_links =[]


page = requests.get("https://ourworldindata.org/charts")
soup = BeautifulSoup(page.content, 'html.parser')

headers = soup.find_all('h2')

for header in headers:
    topics.append(header.get_text())

sections = soup.find_all('section')
for section in sections:
    topic_links = [] 
    for topic_link in section.find_all('a'):
        if("/grapher" in topic_link.get('href')):
            if("https:" in topic_link.get('href')):
                topic_links.append(topic_link.get('href'))
            else:
                topic_links.append("https://ourworldindata.org"+topic_link.get('href'))    
           
    if topic_links:
        all_links.append(topic_links)




with open('stats.csv','a') as fd:
    for i in range(len(all_links)):
        all_links[i].insert(0,topics[i])
        writer = csv.writer(fd)
        writer.writerow(all_links[i])

