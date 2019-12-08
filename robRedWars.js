const Tools = require("./comm/utils/Tools.js");

auto();
setScreenMetrics(1080, 1920);
let getSumMoney=0;
//监听通知栏
events.observeNotification();
events.on("notification", function(n){
    let newsText=n.getText()||'';
    if(newsText.indexOf('红包')!=-1){
      n.click();
    }
});
//微信红包线程
threads.start(function(){
    //循环监听红包
    while(1==1){
      sleep(100);
      let b = id("auj").untilFind();
      b.forEach((res,index)=>{
        //先获取到点击对象先
        let hongbao=null;
        if(res.parent()&&res.parent().parent()&&res.parent().parent().parent()){
          hongbao=res.parent().parent().parent();
        }
        //取得父级
        let parent=res.parent();
        //查找是否已领取
        let flag=parent?parent.find(id("aul")).empty():true;
        //没有找到，就是红包还没有被领取
        if(flag&&hongbao){
          hongbao.click();
          //查找，打开红包组件
          let kaiObj=id("dan").findOne(2000);
          //找到就点击，找不到就直接返回
          if(kaiObj){
            kaiObj.click();
            let moneyObj=id("d62").findOne(3000);
            if(moneyObj){
              let money=moneyObj.text();
              getSumMoney+=money;
              log('抢到微信红包'+money+'元，'+'一共抢到'+getSumMoney+'元');
            }
          }
          sleep(1000);
          back();
          sleep(1000);
        }
      })
    }
});
//企业微信红包线程
threads.start(function(){
    //循环监听红包
    while(1==1){
      sleep(100);
      let b = id("e3d").untilFind();
      b.forEach((res,index)=>{
        //先获取到点击对象先
        let hongbao=res.parent();
        //查找是否已领取
        let flag=res.find(text("红包已领取")).empty();
        //没有找到，就是红包还没有被领取
        if(flag&&hongbao){
          hongbao.click();
          //查找，打开红包组件
          let kaiObj=id("drp").findOne(2000);
          //找到就点击，找不到就直接返回
          if(kaiObj){
            kaiObj.click();
            let moneyObj=id("e14").findOne(3000);
            if(moneyObj){
              let money=moneyObj.text();
              getSumMoney+=money;
              log('抢到企业微信红包'+money+'元，'+'一共抢到'+getSumMoney+'元');
            }
          }
          sleep(1000);
          back();
          sleep(1000);
        }
      })
    }
});