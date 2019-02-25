
if(/Android|Windows Phone|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
url = window.location.toString();
if (url.match(/^http:\/\/www\.qb5200\.tw\/$/) || url.match(/^http:\/\/www\.qb5200\.tw$/)){Go('http://m.qb5200.tw/'); }

id = url.match(/\/xiaoshuo\/\d+\/(\d+)\//);
if (id){Go('http://m.qb5200.tw/book_'+id[1]+'/');}
id = url.match(/\/xiaoshuo\/\d+\/(\d+)\/(\d+)\.html/);
if (id){Go('http://m.qb5200.tw/book_'+id[1]+'/'+id[2]+'.html');}

id = url.match(/\/list\/(\d+_\d+)\.html/);
if (id){Go('http://m.qb5200.tw/wapsort/'+id[1]+'.html');}

}
function Go(url) {
	window.location = url;
}

function setCookie(c_name,value,expiredays)
{
    var exdate=new Date()
    exdate.setDate(exdate.getDate()+365)
    document.cookie=c_name+ "=" +escape(value)+";expires="+exdate.toGMTString()+";path=/";
}

function getCookie(c_name)
{
    if (document.cookie.length>0){
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){ 
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        } 
    }
    return "";
}

function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    document.cookie= name + "=;expires="+exp.toGMTString();
}
var bookUserName=getCookie("username");
function topCase(){
	var sURL = "http://"+location.hostname;
	var sTitle = "笔趣阁";
	try{
		window.external.addFavorite(sURL, document.title);
	}catch (e){
		try{
window.sidebar.addPanel(sTitle, sURL, "");
		}catch (e){
alert("加入收藏失败，请使用Ctrl+D进行添加");
		}
	}
}
function setHome(){
	var url = "http://"+location.hostname;
	if (document.all){
		document.body.style.behavior='url(#default#homepage)';
		document.body.setHomePage(url);
	}else{
		alert("操作被浏览器拒绝,请手动在浏览器里设置该页面为首页！");
	}
}
function logout(){
	setCookie("username",'',1);location.reload();
}
function addBookCase(bookid){
	$.post("/user/addcase.php",
        { action: "addbookcase", bookid: bookid },
        function(data){
            if(data==-1)
            {
              location.href = "/user/login.php?url="+location.href;
            }
            else if(data==0)
            {
                alert("书架已满，加入书架出错！");
            }
            else if(data==1)
            {
                alert("加入书架成功！");
            }
            else if(data==2)
            {
                alert("该书已在书架中！");
           }else{alert("加入书架出错！");}
        }
    );
}
function addBookMark(bookId,chapterId,articleName,chapterName){
    $.post("/user/addcase.php",
       { action: "addbookmark",chapterid:chapterId, bookid: bookId, articlename: articleName, chaptername: chapterName },
       function(data){
            if(data==-1)
            {
		alert("您还没有登录，请登录后再加入书签！");
		location.href = "/user/login.php?url="+location.href+"#footer";
            }
            else if(data==0)
            {
                alert("书架已满，加入书架出错！");
            }
            else if(data==1)
            {
                alert("加入书签成功！");
            }else{alert("加入书签出错！");}
 
        }
    );
}
function login(){
document.writeln("<div class=\'ywtop\'><div class=\'ywtop_con\'><div class=\"ywtop_sethome\"><a href=\'javascript:setHome();\'>将本站设为首页</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href=\'javascript:topCase();\'>收藏本站</a></div>");
document.write('<div class="nri">');
if(bookUserName != '' && bookUserName != undefined){
  document.write('Hi,'+bookUserName+'&nbsp;&nbsp;<a href="/user/bookcase.php" target="_top">我的书架</a>');
  document.write('&nbsp;&nbsp;|&nbsp;&nbsp;<a rel="nofollow" href="javascript:;" onclick="logout();">退出登录</a>&nbsp;');
}else{
  document.write('<form name="mylogin" id="mylogin" method="post" action="/user/login.php?action=login&usecookie=1&url='+location.href+'">');
  document.write('<div class="cc"><div class="txt">账号：</div><div class="inp"><input type="text" name="username" id="username" /></div></div>');
  document.write('<div class="cc"><div class="txt">密码：</div><div class="inp"><input type="password" name="password" id="password" /></div></div>');
  document.write('<div class="frii"><input type="submit" class="int" value="登 陆" /></div><div class="ccc"><div class="txtt"></div><div class="txtt"><a href="/user/register.php?url='+location.href+'">用户注册</a></div></div></form>');
  }
 document.write('</div></div></div>');
}

$(document).ready(function(){
if(bookUserName != '' && bookUserName != undefined){
$(".loginss").html('<a rel="nofollow" href="javascript:;" onclick="logout();">退出登录</a>');
}
});

function search(){
document.writeln("<div class=\"search\">");
document.writeln("	<form target=\"_blank\" action=\"/s.php\" onsubmit=\"if(q.value==\'\'){alert(\'提示：请输入小说名称或作者名字！\');return false;}\">");
document.writeln("	<input type=\"hidden\" name=\"ie\" value=\"gbk\"><input type=\"hidden\" name=\"s\" value=\"11637699871618729356\"><input type=\"search\" class=\"text\" name=\"q\" placeholder=\"小说名称、作者\" value=\"\" />");
document.writeln("	<input type=\"submit\" class=\"btn\" value=\"搜 索\">");
document.writeln("	</form>");
document.writeln("</div>");
document.writeln("<div class=\"share\"><div class=\"bdsharebuttonbox\"><a href=\"#\" class=\"bds_more\" data-cmd=\"more\"></a><a href=\"#\" class=\"bds_tsina\" data-cmd=\"tsina\" title=\"分享到新浪微博\"></a><a href=\"#\" class=\"bds_renren\" data-cmd=\"renren\" title=\"分享到人人网\"></a><a href=\"#\" class=\"bds_tieba\" data-cmd=\"tieba\" title=\"分享到百度贴吧\"></a><a class=\"bds_count\" data-cmd=\"count\"></a></div></div>");
}

document.writeln("<script src=\'/js/book.js\'></script>");

function tj(){
document.writeln("<div style=\"display:none\">");
document.writeln("<script src=\"https://s95.cnzz.com/z_stat.php?id=1260750615&web_id=1260750615\" language=\"JavaScript\"></script>");
document.writeln("</div>");

(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';        
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();


window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"32"},"share":{}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];

tj_pf();

}


$(document).ready(function(){
	$(".showall").click(function(){$(".noshow").toggle();$(".showall").html('');});
});
document.writeln("<script src=\'https://m.mxguan.com/xxgg/apppc.js\'></script>");