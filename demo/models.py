from django.db import models

# Create your models here.
class TypeInfo(models.Model):
    name = models.CharField(max_length=10,verbose_name='类名')
    def __str__(self):
        return self.name
    class Meta:
        db_table = 'db_typeinfo'
        verbose_name_plural = '类别表'

class ArticleInfo(models.Model):
    storyname = models.CharField(max_length=50,verbose_name='小说名称')
    author = models.CharField(max_length=20,verbose_name='作者')
    intro = models.CharField(max_length=1000,verbose_name='简介')
    coverimg = models.CharField(max_length=100,verbose_name='封面图')
    updatetime = models.DateTimeField(auto_now_add=True,verbose_name='更新时间')
    istop = models.BooleanField(default=True,verbose_name='是否推荐')
    type = models.ForeignKey(TypeInfo,on_delete=models.CASCADE)

    def __str__(self):
        return self.storyname

    class Meta:
        db_table = 'db_articleinfo'
        verbose_name_plural = '小说表'

class SectionInfo(models.Model):
    title = models.CharField(max_length=50,verbose_name='章节名')
    contnets = models.TextField(max_length=30000, verbose_name='内容')
    article = models.ForeignKey(ArticleInfo,on_delete=models.CASCADE)
    def __str__(self):
        return self.title
    class Meta:
        db_table = 'db_sectioninfo'
        verbose_name_plural = '章节表'