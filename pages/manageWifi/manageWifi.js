const http = require("../../utils/http.js")
const wxp = require("../../utils/wxp.js")

Component({

    data: {
        refreshStatus: false,
        userId: "",
        wifi: [],
        query: {
            ssid: ""
        }
    },

    methods: {

        async onLoad() {
            try {
                const that = this

                // 1. 通过 userId 查询 wifi
                const userId = wx.getStorageSync("userId")
                that.setData({
                    userId: userId
                })

                var res = await http.request("wifi", "query", {
                    "param": {
                        "userId": userId
                    }
                })
                if (http.isFailure(res)) {
                    throw new Error(res)
                }
                that.setData({
                    wifi: res.data.data
                })
            } catch (error) {
                console.error(error)
            }
        },

        /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
        async refreshWifi() {
            const that = this
            try {
                await wxp.sleep(500)

                const userId = that.data.userId
                const ssid = that.data.query.ssid
                var res = await http.request("wifi", "search", {
                    "param": {
                        "userId": userId,
                        "ssid": ssid
                    }
                })
                if (http.isFailure(res)) {
                    throw new Error(res)
                }
                that.setData({
                    wifi: res.data.data
                })
            } catch (error) {
                console.error(error)
            } finally {
                that.setData({ refreshStatus: false })
            }
        },

        async onWifiCardTap(e) {
            try {
                const dataset = e.currentTarget.dataset
                wx.navigateTo({
                    url: "../manageWifiItem/manageWifiItem?wifiId=" + dataset.wifiId,
                })
            } catch (error) {
                console.error(error);
            }
        },

        async onMakeWifiTap() {
            try {
                wx.navigateTo({
                    url: "../makeWifi/makeWifi",
                })
            } catch (error) {
                console.error(error);
            }
        },

        async onLongPressItem(e) {
            const that = this
            try {
                const dataset = e.currentTarget.dataset
                var res = await wxp.showModal({
                    content: "是否删除 WiFi：" + dataset.ssid + "？（可添加后台微信恢复）",
                })

                if (res.confirm === true || res.cancel === false) {
                    var res = await http.request("wifi", "remove", {
                        "param": {
                            "wifiId": dataset.wifiId
                        }
                    })
                    if (http.isFailure(res)) {
                        throw new Error(res)
                    }
                    await wxp.showToast({
                        title: "已成功删除 WiFi：" + dataset.ssid,
                    })

                    await that.refreshWifi()
                }
            } catch (error) {
                console.error(error);
            }
        },

        async searchWifi(e) {
            const that = this
            try {
                await Promise.all([
                    wxp.showLoading(),
                    wxp.sleep(500)
                ])

                that.setData({
                    query: { ssid: e.detail.value }
                })

                await that.refreshWifi()
            } catch (error) {
                console.error(error);
            } finally {
                wxp.hideLoading()
            }
        }

    }

})
