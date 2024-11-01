const http = require("../../utils/http.js")
const wxp = require("../../utils/wxp.js")

Component({

    data: {

        buttonText: "连接 WiFi",
        wifiId: "",
        wifi: {
            ssid: "",
            password: ""
        }

    },

    methods: {

        async onLoad(query) {
            const that = this
            try {
                const scene = decodeURIComponent(query.scene)
                const wifiId = scene.substring(7)
                that.setData({
                    wifiId: wifiId
                })

                var res = await http.request("wifi", "query", {
                    "param": {
                        "wifiId": wifiId
                    }
                })
                if (http.isFailure(res)) {
                    console.error(res);
                    that.setData({
                        wifi: {
                            ssid: "请使用对应WiFi码"
                        }
                    })
                    throw new Error(res)
                }
                that.setData({
                    wifi: {
                        ssid: res.data.data[0].ssid,
                        password: res.data.data[0].password
                    }
                })

                await wxp.startWifi()

                var res = await wxp.getConnectedWifi()
                that.setWifiConnected(res)
            } catch (error) {
                console.error(error)
            } finally {
                wxp.stopWifi()
            }
        },

        async onConnectWifi() {
            try {
                const that = this

                await Promise.all([
                    that.showLoading(),
                    wxp.startWifi()
                ])

                await wxp.connectWifi({
                    SSID: that.data.wifi.ssid,
                    password: that.data.wifi.password
                })

                var res = await wxp.getConnectedWifi()
                that.setWifiConnected(res)
            } catch (error) {
                console.error(error)
            } finally {
                wxp.stopWifi()
                wxp.hideLoading()
            }
        },

        async setWifiConnected(res) {
            const that = this

            if (res.wifi.SSID !== that.data.wifi.ssid) {
                throw new Error(res);
            }
            that.setData({
                buttonText: "已连接"
            })
        },

        showLoading() {
            wxp.showLoading({
                title: "连接中",
                mask: true
            })
        }

    }

})
