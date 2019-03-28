const Util=require("./comm/utils/Util.js");
var window=floaty.window(
  <frame gravity="center">
      <text id="text" padding="10" bg="#00B400" alpha="0.8" text="停止运行" textSize="16sp" textStyle="bold" textColor="#FFFFFF" />
  </frame>
)
//
window.text.click(()=>{
  toast('脚本停止执行啦');
  exectuion.getEngine().forceStop();
})

auto();
setScreenMetrics(1080, 1920);
sleep(500);
//12 * 60 * 60 * 1000
var timestamp =(new Date().getTime()+3 * 60 * 60 * 1000);
var date = rawInput("请输入结束时间", Util.getCurDate('hh:mm',timestamp));
while(1==1){
  if(date&&Util.getCurDate('hh:mm')==date){
    home();
    desc("锁屏").findOne().click();
    exectuion.getEngine().forceStop();
  }
  print("11");
  
  sleep(1000);
  click(1510,850);
  sleep(1000);
  click(1510,1000);
  sleep(50);
}