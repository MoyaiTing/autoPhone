var window=floaty.window(
  <vertical>
      <text id="msy_begin" padding="10" margin="5" bg="#00B400" alpha="0.8" text="开始运行" textSize="16sp" textStyle="bold" textColor="#FFFFFF" />
      <text id="msy_suspend" padding="10" margin="5" bg="#00B400" alpha="0.8" text="暂停运行" textSize="16sp" textStyle="bold" textColor="#FFFFFF" />
      <text id="msy_over" padding="10" margin="5" bg="#00B400" alpha="0.8" text="终止运行" textSize="16sp" textStyle="bold" textColor="#FFFFFF" />
  </vertical>
)
//
var flag=false;
window.msy_begin.click(()=>{
  toast('脚本开始执行啦');
  flag=true;
})
window.msy_suspend.click(()=>{
  toast('脚本暂停执行啦');
  flag=false;
})
window.msy_over.click(()=>{
  toast('脚本终止执行啦');
  exectuion.getEngine().forceStop();
})
auto();
setScreenMetrics(1080, 1920);
sleep(500);
while(1==1){
  sleep(50);
  if(flag){
    sleep(50);
    click(250,790);
    sleep(50);
    swipe(180, 1790, 900, 1790, 150);
  }
}