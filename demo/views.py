from django.http import JsonResponse
from django.shortcuts import render,redirect
from django.views.generic.base import View

# Create your views here.
from .models import TypeInfo
#类别全局
def globar_type(request):
    typeinfo = TypeInfo.objects.all()
    context = {
        'typeinfo':typeinfo,
    }
    return context

import random
class IndexView(View):
    def get(self,request):
        is_top_article = ArticleInfo.objects.all().filter(istop=True)
        is_top_list = []
        for i in is_top_article:
            is_top_list.append(i)
        random.shuffle(is_top_list)


        new_item = []
        type_info = TypeInfo.objects.all()
        for type in type_info:
            for item in type.articleinfo_set.all().order_by('-id')[:2]:
                new_item.append(item)
        random.shuffle(new_item)
        context = {
            'articleinfo':is_top_list[:4],
            'type_info':type_info,
            'new_item':new_item,
            'is_top_list':is_top_list[:9],
        }

        return render(request,'index.html',context=context)


class ListView(View):
    def get(self,request,pk):
        new_article_info = ArticleInfo.objects.filter(type_id=pk).order_by('-id')[:6]  #列表页推荐
        article_info = ArticleInfo.objects.filter(type_id=pk)
        typename = TypeInfo.objects.get(id=pk).name
        context = {
            'new_article_info':new_article_info,
            'article_info':article_info,
            'typename': typename
        }
        return render(request,'list.html',context=context)

from .models import SectionInfo
class DetailView(View):
    def get(self,request,pk):
        article = ArticleInfo.objects.get(id=pk)
        new_section = article.sectioninfo_set.all()
        context = {
            'article':article,
            'new_section':new_section.last().title,  #最新章节名
            'count':new_section.count(),             #最新章节的序号
        }
        return render(request,'detail.html',context=context)

class ContentView(View):
    def get(self,request,pk):
        section =  SectionInfo.objects.get(id=pk)
        p = request.GET.get('p')   #获取第几章
        context = {
            'section':section,
            'p':p,
        }
        return render(request, 'content.html', context=context)




from .models import ArticleInfo
class StoryView(View):
    def post(self,request):
        id = request.POST.get('id')
        story_name = request.POST.get('story_name')
        story_author = request.POST.get('story_author')
        story_img = request.POST.get('story_img')
        story_intro = request.POST.get('story_intro')
        type_id = request.POST.get('type_id')

        ArticleInfo.objects.create(id = id,
                                   storyname = story_name,
                                   author = story_author,
                                   intro = story_intro,
                                   coverimg = story_img,
                                   type_id = type_id
                                   )
        return JsonResponse({'status': 201})


class SectionView(View):
    def post(self,request):
        title = request.POST.get('title')
        contnets = request.POST.get('contnets')
        article_id = request.POST.get('article_id')
        SectionInfo.objects.create(
            title=title,
            contnets = contnets,
            article_id = article_id
        )
        return JsonResponse({'status': 201})

from django.db.models import Q
from spider.tasks import serach_job
import time

class SerachView(View):
    def get(self,request):
        serachfields = request.GET.get('serach')
        if len(serachfields)==0:
            return render(request, 'serach.html')
        article = ArticleInfo.objects.filter(Q(storyname__contains=serachfields)|Q(author__contains=serachfields))
        if article.count() != 0:
            context = {
                'article':article,
                'serachfields':serachfields,
            }
            return render(request, 'serach.html', context)
        else:
            last_id = ArticleInfo.objects.latest('id').id
            serach_job.delay(serachfields,last_id)
            time.sleep(8)
            article = ArticleInfo.objects.filter(Q(storyname__contains=serachfields) | Q(author__contains=serachfields))
            context = {
                'article': article,
                'serachfields': serachfields,
            }
            return render(request, 'serach.html', context)
