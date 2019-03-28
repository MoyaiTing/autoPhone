auto();
setScreenMetrics(1080, 1920);
//监听通知栏
events.observeNotification();
events.on("notification", function(n){
    var newsText=n.getText()||'';
    if(newsText.indexOf('微信红包')!=-1){
      n.click();
    }
});
threads.start(function(){
    //循环监听红包
    while(1==1){
      sleep(100);
      var b = id("aq4").untilFind();
      b.forEach((res,index)=>{
        //先获取到点击对象先
        var hongbao=null;
        if(res.parent()&&res.parent().parent()&&res.parent().parent().parent()){
          hongbao=res.parent().parent().parent();
        }
        //取得父级
        var parent=res.parent();
        //查找是否已领取
        var flag=parent?parent.find(id("aq6")).empty():true;
        //没有找到，就是红包还没有被领取
        if(flag&&hongbao){
          hongbao.click();
          //查找，打开红包组件
          var kaiObj=id("cyf").findOne(2000);
          //找到就点击，找不到就直接返回
          if(kaiObj){
            kaiObj.click();
            var moneyObj=id("csy").findOne(1000);
            if(moneyObj){
              var money=moneyObj.text();
              var url='https://sc.ftqq.com/SCU37889T787d00b66ae6378bf3dd7bc5ccb097405c18b48a36ea0.send';
              print("抢到了"+money);
              http.post(url, {
                "text": "抢到红包啦",
                "desp": "抢到了"+money
              });
            }
          }
          back();
          sleep(1000);
        }
      })
    }
});