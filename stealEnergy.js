//https://hyb1996.github.io/AutoJs-Docs/#/?id=%E7%BB%BC%E8%BF%B0
const Util = require("./comm/utils/Util.js");
const Tools = require("./comm/utils/Tools.js");
const DeviceMoy = require("./comm/utils/DeviceMoy.js");

auto();
setScreenMetrics(1080, 1920);

let getMySumEnergy=0;//获取自己总能量
let getOrderSumEnergy=0;//获取他人总能量
const isTest=1;
log('执行时间：'+Util.getCurDate());
try {
    initAuto();
}
catch(err) {
    log(err);
    log("执行报错，再来一次");
    back();
    sleep(300);
    back();
    sleep(300);
    back();
    sleep(300);
    back();
    sleep(300);
    initAuto();
}


function initAuto(){
    if(isTest){
        likeZhixing('1');
        return;
    } 
    let options = ["稳定版", "激进版"];
    let type = dialogs.select("请选择一个选项", options);
    if (type < 0) {
        type = '0';
    }
    let options1 = ["立刻执行", "定时执行"];
    let type1 = dialogs.select("请选择一个选项", options1);
    if (type1 < 0) {
        type1 = '0';
    }
    if(type1 == '0'){
        likeZhixing(type);
    }else{
        dingshiZhixing();
    }
    log("执行版本：" + options[type]);
}

function dingshiZhixing(){
    let shoujishijian = rawInput("请输入收集时间", "07:00") || "07:02";
    log("执行时间：" + shoujishijian);
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
            likeZhixing(type);
            DeviceMoy.suoping();
            break;
        }
        sleep(200);
    }
}

function likeZhixing(type){
    let getEnergy = shoujinengliang(type);
    //收集能量为0，再收集一次，防止弹窗
    if (getEnergy===0) {
        shoujinengliang(type);
    }
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
    }else{
        back();
        return 0;
    };
    sleep(8000);

    log('收集自己的能量');
    getMySumEnergy=clickEnergyBall();
    log("收集到自己的能量为"+getMySumEnergy+"g");
    sleep(2000);
    log('收集别人的能量');
    //稳定版
    if (type == 0) {
        let otherEnergyList = textEndsWith('kg').className('android.view.View').clickable(true).find() || [];
        otherEnergyList.forEach(res1 => {
            log("当前被偷取人：" + getEnergyPeopleName(res1,type));
            res1.click();
            //点击能量球
            getOrderSumEnergy=clickEnergyBall();
            sleep(500);
            back();
            sleep(1000);
        })
        //激进版
    } else {
        let look = text("查看更多好友").findOne(1500);
        if (!look) {
            back();
            look = text("查看更多好友").findOne(1500) || {};
        }
        look.click();
        sleep(5000);
        let length = 76;
        for (let i = 0; i < length; i++) {
            let XX=140;
            let YY=680;
            let chazhi = 193;
            click(XX, YY);
            sleep(500);
            //再滚动一下，防止刚好自己的时候没有跳转
            swipe(140, 540 + chazhi, 140, 540, 400);
            click(XX, YY);

            //点击能量球
            getOrderSumEnergy+=clickEnergyBall();
            sleep(200);
            back();
            sleep(300);
            swipe(140, 540 + chazhi, 140, 540, 400);
            sleep(300);
        }
        back();
        sleep(1000);
    }
    log("偷取别人能量："+getOrderSumEnergy+"g");
    sleep(1000);
    log('记录最后能量');
    let endStamp = (new Date()).getTime();
    let costStamp = staStamp - endStamp;
    let costTime = parseInt(costStamp / 1000 / 60) + "分" + (parseInt(costStamp / 1000) % 60) + "秒";
    Tools.ServerMessage.sendMessage(
        "偷能量",
        "一共收取自己能量：" + getMySumEnergy + "*****他人能量：" + getOrderSumEnergy + "*****获得总能量：" + (getMySumEnergy+getOrderSumEnergy) + "g*****耗费时长：" + costTime
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
    return (getMySumEnergy+getOrderSumEnergy);
};

//点击能量球
function clickEnergyBall(){
    sleep(3000);
    let _energyList = textContains('收集能量').find() || [];
    sleep(200);
    let getEnergy=0;
    _energyList.forEach(res => {
        getEnergy+=parseInt(res.text());
        click(res.bounds().centerX(), res.bounds().centerY());
        sleep(500);
    });
    log("一共获取能量："+getEnergy+'g');
    return getEnergy;
}

//获取被偷取人的姓名
function getEnergyPeopleName(res,type){
    let energyPeopleName='##';
    try {
        if(type==0){
            //前三个和后面的位置不一样
            energyPeopleName=(res.parent().child(1).child(0)||res.parent().child(2).child(0)).text();
        }else{
            //前三个和后面的位置不一样
            energyPeopleName=res.parent().child(1).text()||res.parent().child(2).text();
        }
    }
    catch(err) {
        log("没有找到姓名");
    }
    return energyPeopleName;
}