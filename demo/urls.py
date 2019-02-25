from django.conf.urls import url
from . import views
from django.views.generic.base import TemplateView

urlpatterns = [
    url(r'^$', views.IndexView.as_view()),
    url(r'^lists/(?P<pk>\d+)/$',views.ListView.as_view()),   #分类列表页
    url(r'^details/(?P<pk>\d+)/$',views.DetailView.as_view()),   #详情页
    url(r'^contents/(?P<pk>\d+)/$',views.ContentView.as_view()),   #详情页
    url(r'^serach/$',views.SerachView.as_view()),   #检索


    url(r'^story/$',views.StoryView.as_view()),
    url(r'^section/$',views.SectionView.as_view()),
]