const http = require("utils/http.js")
const wxp = require("utils/wxp.js")

App({
    globalData: {
    },

    async onLaunch() {
        try {
            const that = this

            // 1. 获取 userId
            var userId = wx.getStorageSync("userId") || ""
            if (userId === "") {
                var res = await wxp.login()
                var res = await http.request("weixin", "getUserId", {
                    "param": res.code
                })
                var userId = res.data.data
                wx.setStorageSync("userId", userId)
            }

        } catch (error) {
            console.error(error)
        } finally {
            // TODO 登录埋点
            console.log(wx.getStorageSync("userId"))
        }
    }

})
