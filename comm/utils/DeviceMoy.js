module.exports = {
    //唤醒屏幕一段时间
    wakeUpLittleTime: function(time) {
        log("时间差大于1分钟，唤醒屏幕来重置sleep");
        //如果屏幕没有亮着，则唤醒并解锁一段时间后锁屏
        if (!device.isScreenOn()) {
            this.jiesuo();
            sleep(time);
            this.suoping();
        }
    },
    //解锁
    jiesuo: function() {
        log("解锁");
        sleep(3000);
        //开锁
        device.wakeUpIfNeeded();
        sleep(1000);
        swipe(540, 300, 600, 1200, 500);
        sleep(2000);
        click(540, 1600);
        sleep(500);
        click(550, 1400);
        sleep(500);
        click(250, 990);
        sleep(500);
        click(550, 1400);
        sleep(500);
        /*let power = "0818";
        power.split("").forEach(res => {
            let textObj = text(res).findOne(1000);
            if (textObj) {
                textObj.parent().click();
            }
            sleep(500);
        });*/
    },
    //锁屏
    suoping: function() {
        log("锁屏");
        home();
        sleep(500);
        home();
        (desc('锁屏').findOne(2000)||{}).click();
    },
}