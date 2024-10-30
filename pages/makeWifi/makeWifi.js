const http = require("../../utils/http")
const wxp = require("../../utils/wxp")

// pages/makeWifi/makeWifi.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad() {

    },

    async formSubmit(e) {
        const that = this
        try {
            const value = e.detail.value

            await wxp.showLoading({
                title: "提交新增中",
                mask: true
            })
            await wxp.sleep(500)

            var res = await http.request("wifi", "create", {
                "param": {
                    "userId": wx.getStorageSync("userId"),
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
                content: "已新增，返回到“我的”页面刷新查看新增的 WiFi",
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