//https://hyb1996.github.io/AutoJs-Docs/#/?id=%E7%BB%BC%E8%BF%B0
const Util = require("./comm/utils/Util.js");
const Tools = require("./comm/utils/Tools.js");
const DeviceMoy = require("./comm/utils/DeviceMoy.js");

auto();
setScreenMetrics(1080, 1920);
let shoujishijian = rawInput("请输入收集时间", "07:00") || "07:02";
let options = ["稳定版", "激进版"];
let type = dialogs.select("请选择一个选项", options);
if (type < 0) {
    type = '0';
}
log("执行时间：" + shoujishijian);
log("执行版本：" + options[type]);
let index = 0;
let xunhuanshijian;
let lastXunhuanshijian = Util.getCurDate('hh:mm');
while (1 == 1) {
    index += 1;
    xunhuanshijian = Util.getCurDate('hh:mm');
    if (lastXunhuanshijian != xunhuanshijian) {
        //获取时间差
        let betweenTime = parseInt(xunhuanshijian.split(':')[1]) - parseInt(lastXunhuanshijian.split(':')[1]);
        //如果时间差超过了1分钟，则唤醒屏幕，重置一下sleep
        if (betweenTime > 1||(betweenTime<0&&betweenTime>-59)) {
            log("\n当前循环次数：" + index + "\n上次循环时间：" + lastXunhuanshijian+ "\n当前时间：" + xunhuanshijian);
            DeviceMoy.wakeUpLittleTime(30 * 1000);
        }
    }
    lastXunhuanshijian = xunhuanshijian;
    if (xunhuanshijian.split(':')[0] == shoujishijian.split(':')[0] && xunhuanshijian.split(':')[1] >= shoujishijian.split(':')[1]) {
        log("开始收集能量");
        DeviceMoy.jiesuo();
        let getEnergy = shoujinengliang(type);
        //收集能量为0，再收集一次，防止弹窗
        if (!getEnergy || getEnergy == "0") {
            shoujinengliang(type);
        }
        DeviceMoy.suoping();
        break;
    }
    sleep(200);
}

function shoujinengliang(type) {
    let staStamp = (new Date()).getTime();
    sleep(2000);
    //启动应用
    log('打开支付宝');
    app.launchApp('支付宝');
    sleep(4000);
    log('点击蚂蚁森林');
    let mayi = text("蚂蚁森林").findOne(2000);
    if (mayi) {
        mayi.parent().parent().click();
    };
    sleep(8000);
    log('记录当前能量');
    sleep(1000);
    let staEnergy = (descEndsWith('g').boundsInside(750, 245, 950, 350).findOne(8000) || {}).desc() || "0";
    log("当前能量为"+staEnergy);
    sleep(1000);
    log('收集自己的能量');
    let energyList = descContains('收集能量').find() || [];
    energyList.forEach(res => {
        click(res.bounds().centerX(), res.bounds().centerY());
        sleep(500);
    })
    let staEnergy1 = (descEndsWith('g').boundsInside(750, 245, 950, 350).findOne(8000) || {}).desc() || "0";
    log("收集到自己的能量为"+(parseInt(staEnergy1)-parseInt(staEnergy))+"g");
    sleep(2000);
    log('收集别人的能量');
    //稳定版
    if (type == 0) {
        let otherEnergyList = descEndsWith('kg').className('android.view.View').clickable(true).find() || [];
        otherEnergyList.forEach(res1 => {
            log("当前被偷取人：" + getEnergyPeopleName(res1,type));
            res1.click();
            //点击能量球
            clickEnergyBall();
            sleep(500);
            back();
            sleep(1000);
        })
        //激进版
    } else {
        let look = desc("查看更多好友").findOne(1500);
        if (!look) {
            back();
            look = desc("查看更多好友").findOne(1500) || {};
        }
        look.click();
        sleep(5000);
        let otherEnergyList = descEndsWith('g').className('android.view.View').clickable(true).find() || [];
        let length = otherEnergyList.length;
        let otherEnergyList1;
        let otherEnergy;
        let staYY;
        if (length > 0) {
            staYY = otherEnergyList[0].bounds().centerY();
        }
        for (let i = 0; i < length; i++) {
            otherEnergyList1 = descEndsWith('kg').className('android.view.View').clickable(true).find() || [];
            otherEnergy = otherEnergyList1[i] || {};
            log("当前被偷取人：" + getEnergyPeopleName(otherEnergy,type));
            let bounds = otherEnergy.bounds() || {};
            length = otherEnergyList1.length;
            let XX = bounds.centerX();
            let YY = bounds.centerY();
            click(XX, YY);
            //点击能量球
            clickEnergyBall();
            sleep(200);
            back();
            sleep(300);
            let chazhi = YY - staYY;
            swipe(540, 181 + 540 + chazhi, 540, 540, 400);
            sleep(300);
        }
        back();
        sleep(1000);
    }
    sleep(1000);
    log('记录最后能量');
    let endStamp = (new Date()).getTime();
    let costStamp = staStamp - endStamp;
    let costTime = parseInt(costStamp / 1000 / 60) + "分" + (parseInt(costStamp / 1000) % 60) + "秒";
    let endEnergy = (descEndsWith('g').boundsInside(750, 245, 950, 350).findOne(3000) || {}).desc() || "0";
    let getEnergy = (parseInt(staEnergy) - parseInt(endEnergy));
    log("偷取别人能量："+(parseInt(staEnergy1) - parseInt(endEnergy))+"g");
    Tools.ServerMessage.sendMessage(
        "偷能量",
        "开始能量：" + staEnergy + "*****结束能量：" + endEnergy + "*****获得能量：" + getEnergy + "g*****耗费时长：" + costTime
    );
    log("退出支付宝");
    back();
    sleep(300);
    back();
    sleep(300);
    back();
    sleep(300);
    back();
    sleep(300);
    return getEnergy;
};
//点击能量球
function clickEnergyBall(){
    sleep(3000);
    let energyStart=0;
    try {
        energyStart=descContains('你收取TA').findOne(1000).parent().findOne(descContains('g')).desc();
    }
    catch(err) {
        log('没有找到偷取能量');
    }
    let _energyList = descContains('收集能量').find() || [];
    let energySum=0;
    sleep(200);
    _energyList.forEach(res => {
        energySum+=parseInt(res.desc());
        click(res.bounds().centerX(), res.bounds().centerY());
        sleep(500);
    });
    let energyEnd=0;
    try {
        energyEnd=descContains('你收取TA').findOne(1000).parent().findOne(descContains('g')).desc();
    }
    catch(err) {
        log('没有找到偷取能量');
    }
    log("可偷能量："+energySum+"g，一共偷的能量："+(parseInt(energyEnd)-parseInt(energyStart))+'g');
}

//获取被偷取人的姓名
function getEnergyPeopleName(res,type){
    let energyPeopleName='##';
    try {
        if(type==0){
            //前三个和后面的位置不一样
            energyPeopleName=(res.parent().child(1).child(0)||res.parent().child(2).child(0)).desc();
        }else{
            //前三个和后面的位置不一样
            energyPeopleName=res.parent().child(1).desc()||res.parent().child(2).desc();
        }
    }
    catch(err) {
        log("没有找到姓名");
    }
    return energyPeopleName;
}