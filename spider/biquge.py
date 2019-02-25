import requests
from lxml import etree

url = 'http://www.xbiquge.la'
headers = {
    'Referer': 'http://www.xbiquge.la/',
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
}

class StorySpider():
    story_count = 0
    def get_types(self):
        '''
        获取所有类型
        '''
        type_id = 0
        response = requests.get(url,headers=headers).text
        html = etree.HTML(response)
        typeurls = html.xpath("/html/body/div[@id='wrapper']/div[@class='nav']/ul/li/a/@href")
        for i in typeurls[2:-2]:
            type_id += 1
            urls = url + i
            self.get_story(urls,type_id)

    def get_story(self,url,type_id):
        '''
        获取小说信息
        '''
        response = requests.get(url, headers=headers).text
        html = etree.HTML(response)
        story = html.xpath("/html/body/div[@id='wrapper']/div[@id='main']/div[@id='content']/div[@id='newscontent']/div[@class='l']/ul/li/span[@class='s2']/a")[:20]  #每个类下暂获取10本小说
        for i in story:
            self.story_count += 1   #小说id，小说表递增用
            story_url = i.xpath('./@href')[0]
            detail = requests.get(story_url,headers=headers)
            detail.encoding = 'utf-8'
            html = etree.HTML(detail.text)
            story_name = html.xpath('//*[@id="info"]/h1/text()')[0]
            story_author = html.xpath('//*[@id="info"]/p[1]/text()')[0].split('：')[-1]
            story_img = html.xpath('///*[@id="fmimg"]/img/@src')[0]
            story_intro = ''.join(html.xpath('//*[@id="intro"]/p[2]/text()')).strip()

            data = {
                'id': self.story_count,
                'story_name': story_name,
                'story_author': story_author,
                'story_img': story_img,
                'story_intro': story_intro,
                'type_id': type_id
            }

            #小说数据插入
            result = requests.post(url='http://127.0.0.1:8000/story/',data=data).json()['status']
            if result != 201:
                print('数据插去失败',data)
            print('小说：%s' % story_name)
            self.get_section(story_url,self.story_count)

    def get_section(self,story_url,article_id):
        '''
        获取小说章节
        '''
        response = requests.get(story_url,headers=headers)
        response.encoding = 'utf-8'
        html = etree.HTML(response.text)
        sections = html.xpath('//*[@id="list"]/dl/dd/a')[:50]  #暂获取50章
        for i in sections:
            section_url = 'http://www.xbiquge.la' + i.xpath('./@href')[0]   #章节url
            section_name = i.xpath('./text()')[0].split('章')[-1].strip()    #章节名

            section_detail = requests.get(url=section_url,headers=headers)
            section_detail.encoding = 'utf-8'
            section_html = etree.HTML(section_detail.text)
            section_content = ''.join(section_html.xpath('//*[@id="content"]/text()'))  #章节内容

            data = {
                'title':section_name,
                'contnets':section_content,
                'article_id':article_id,
            }
            result = requests.post(url='http://127.0.0.1:8000/section/', data=data).json()['status']
            if result != 201:
                print('数据插去失败', data)
            print('章节：%s'%section_name)



if __name__ == '__main__':
    spider = StorySpider()
    spider.get_types()