
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
	var sTitle = "��Ȥ��";
	try{
		window.external.addFavorite(sURL, document.title);
	}catch (e){
		try{
window.sidebar.addPanel(sTitle, sURL, "");
		}catch (e){
alert("�����ղ�ʧ�ܣ���ʹ��Ctrl+D�������");
		}
	}
}
function setHome(){
	var url = "http://"+location.hostname;
	if (document.all){
		document.body.style.behavior='url(#default#homepage)';
		document.body.setHomePage(url);
	}else{
		alert("������������ܾ�,���ֶ�������������ø�ҳ��Ϊ��ҳ��");
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
                alert("���������������ܳ���");
            }
            else if(data==1)
            {
                alert("������ܳɹ���");
            }
            else if(data==2)
            {
                alert("������������У�");
           }else{alert("������ܳ���");}
        }
    );
}
function addBookMark(bookId,chapterId,articleName,chapterName){
    $.post("/user/addcase.php",
       { action: "addbookmark",chapterid:chapterId, bookid: bookId, articlename: articleName, chaptername: chapterName },
       function(data){
            if(data==-1)
            {
		alert("����û�е�¼�����¼���ټ�����ǩ��");
		location.href = "/user/login.php?url="+location.href+"#footer";
            }
            else if(data==0)
            {
                alert("���������������ܳ���");
            }
            else if(data==1)
            {
                alert("������ǩ�ɹ���");
            }else{alert("������ǩ����");}
 
        }
    );
}
function login(){
document.writeln("<div class=\'ywtop\'><div class=\'ywtop_con\'><div class=\"ywtop_sethome\"><a href=\'javascript:setHome();\'>����վ��Ϊ��ҳ</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href=\'javascript:topCase();\'>�ղر�վ</a></div>");
document.write('<div class="nri">');
if(bookUserName != '' && bookUserName != undefined){
  document.write('Hi,'+bookUserName+'&nbsp;&nbsp;<a href="/user/bookcase.php" target="_top">�ҵ����</a>');
  document.write('&nbsp;&nbsp;|&nbsp;&nbsp;<a rel="nofollow" href="javascript:;" onclick="logout();">�˳���¼</a>&nbsp;');
}else{
  document.write('<form name="mylogin" id="mylogin" method="post" action="/user/login.php?action=login&usecookie=1&url='+location.href+'">');
  document.write('<div class="cc"><div class="txt">�˺ţ�</div><div class="inp"><input type="text" name="username" id="username" /></div></div>');
  document.write('<div class="cc"><div class="txt">���룺</div><div class="inp"><input type="password" name="password" id="password" /></div></div>');
  document.write('<div class="frii"><input type="submit" class="int" value="�� ½" /></div><div class="ccc"><div class="txtt"></div><div class="txtt"><a href="/user/register.php?url='+location.href+'">�û�ע��</a></div></div></form>');
  }
 document.write('</div></div></div>');
}

$(document).ready(function(){
if(bookUserName != '' && bookUserName != undefined){
$(".loginss").html('<a rel="nofollow" href="javascript:;" onclick="logout();">�˳���¼</a>');
}
});

function search(){
document.writeln("<div class=\"search\">");
document.writeln("	<form target=\"_blank\" action=\"/s.php\" onsubmit=\"if(q.value==\'\'){alert(\'��ʾ��������С˵���ƻ��������֣�\');return false;}\">");
document.writeln("	<input type=\"hidden\" name=\"ie\" value=\"gbk\"><input type=\"hidden\" name=\"s\" value=\"11637699871618729356\"><input type=\"search\" class=\"text\" name=\"q\" placeholder=\"С˵���ơ�����\" value=\"\" />");
document.writeln("	<input type=\"submit\" class=\"btn\" value=\"�� ��\">");
document.writeln("	</form>");
document.writeln("</div>");
document.writeln("<div class=\"share\"><div class=\"bdsharebuttonbox\"><a href=\"#\" class=\"bds_more\" data-cmd=\"more\"></a><a href=\"#\" class=\"bds_tsina\" data-cmd=\"tsina\" title=\"��������΢��\"></a><a href=\"#\" class=\"bds_renren\" data-cmd=\"renren\" title=\"����������\"></a><a href=\"#\" class=\"bds_tieba\" data-cmd=\"tieba\" title=\"�����ٶ�����\"></a><a class=\"bds_count\" data-cmd=\"count\"></a></div></div>");
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