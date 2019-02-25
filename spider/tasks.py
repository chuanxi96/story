import re

import requests
from lxml import etree
from celery import Celery
broker_url = 'redis://127.0.0.1:6379/0'
result_backend = 'redis://127.0.0.1:6379/1'
app = Celery('tasks', broker=broker_url, backend=result_backend)


headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
}
class SerachSpider():
    def get_res(self,serach,last_id):
        url = 'https://www.qb5200.tw/s.php?q='+ serach
        response = requests.get(url,headers=headers)
        html = etree.HTML(response.text)
        urls = html.xpath("//div[@class='bookinfo']/h4[@class='bookname']/a/@href")
        if len(urls) == 0:
            return 0
        url = 'https://www.qb5200.tw'+ html.xpath("//div[@class='bookinfo']/h4[@class='bookname']/a/@href")[0]
        self.get_detail(url,last_id)

    def get_detail(self,url,last_id):
        last_id += 1
        response = requests.get(url,headers=headers)
        html = etree.HTML(response.text)
        story_name = html.xpath("/html/body/div[@class='book']/div[@class='path']/div[@class='p']/a[2]/text()")[0]
        story_author = html.xpath("/html/body/div[@class='book']/div[@class='info']/div[@class='small']/span[1]/text()")[0].split('：')[-1]
        story_img = 'https://www.qb5200.tw'+html.xpath("/html/body/div[@class='book']/div[@class='info']/div[@class='cover']/img/@src")[0]
        story_intro = re.sub(r'\s+','',''.join(html.xpath("/html/body/div[@class='book']/div[@class='info']/div[@class='intro']/text()")))

        data = {
            'id': last_id,
            'story_name': story_name,
            'story_author': story_author,
            'story_img': story_img,
            'story_intro': story_intro,
            'type_id': 1
        }
        result = requests.post(url='http://127.0.0.1:8000/story/', data=data).json()['status']
        if result != 201:
            print('数据插入失败', data)
        print('小说：%s' % story_name)

        sections = html.xpath("/html/body/div[@class='listmain']/dl/dd/a")[9:19]  #先搜素10章节
        for i in sections:
            title = i.xpath('./text()')[0].split('章 ')[-1]
            urls = 'https://www.qb5200.tw'+i.xpath('./@href')[0]
            self.contents(title,urls,last_id)

    def contents(self,title,urls,last_id):
        response = requests.get(url=urls,headers=headers)
        html = etree.HTML(response.text)
        content =''.join(html.xpath("/html/body[@id='wrapper']/div[@class='book reader']/div[@class='content']/div[@id='content']/text()"))

        data = {
            'title': title,
            'contnets': content,
            'article_id': last_id,
        }
        result = requests.post(url='http://127.0.0.1:8000/section/', data=data).json()['status']
        if result != 201:
            print('数据插入失败', data)
        print('章节：%s' % title)


@app.task(name='serach_job')
def serach_job(serach,last_id):
    spider = SerachSpider()
    spider.get_res(serach,last_id)