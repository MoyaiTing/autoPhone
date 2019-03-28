const Config = require("../constant/Config.js");
//server酱
let ServerMessage = {
    //推送消息到微信
    sendMessage : function(text, desp) {
        let url = Config.serverKey;
        return http.post(url, {
            "text": text,
            "desp": desp
        });
    },
}
module.exports = {
    ServerMessage: ServerMessage
}