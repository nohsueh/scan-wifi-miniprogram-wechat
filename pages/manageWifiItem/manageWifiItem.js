const http = require("../../utils/http")
const wxp = require("../../utils/wxp")

// pages/manageWifiItem.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        qrCodeUrl: "",
        wifiId: "",
        ssid: "",
        password: "",
        updatedAt: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        try {
            const that = this

            const wifiId = options.wifiId
            that.setData({
                wifiId: wifiId
            })

            var res = await http.request("wifi", "getQrCodeUrl", {
                "param": {
                    "wifiId": that.data.wifiId
                }
            })
            if (http.isFailure(res)) {
                throw new Error(res)
            }
            that.setData({
                qrCodeUrl: res.data.data[wifiId]
            })

            var res = await http.request("wifi", "query", {
                "param": {
                    "wifiId": that.data.wifiId
                }
            })
            if (http.isFailure(res)) {
                throw new Error(res)
            }

            const wifi = res.data.data[0]
            that.setData({
                ssid: wifi.ssid,
                password: wifi.password,
                updatedAt: wifi.updatedAt
            })

        } catch (error) {
            console.error(error);
        }
    },

    async formSubmit(e) {
        const that = this
        try {
            const value = e.detail.value

            await wxp.showLoading({
                title: "提交修改中",
                mask: true
            })
            await wxp.sleep(500)

            var res = await http.request("wifi", "modify", {
                "param": {
                    "userId": wx.getStorageSync("userId"),
                    "wifiId": that.data.wifiId,
                    "ssid": value.ssid,
                    "password": value.password,
                }
            })
            if (http.isFailure(res)) {
                console.error(res);
                wxp.showModal({
                    title: "错误码：" + res.data.code.toString(),
                    content: res.data.msg,
                    showCancel: false
                })
                throw new Error(res)
            }

            wxp.showModal({
                content: "已修改，无需重新下载二维码",
                showCancel: false
            })
        } catch (error) {
            console.error(error)
        } finally {
            wxp.hideLoading()
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})