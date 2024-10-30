function sleep(delay) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

function p(func, obj) {
    return new Promise((resolve, reject) => {
        func({
            ...obj,
            success: resolve,
            fail: reject
        })
    })
}

module.exports = {
    sleep: sleep,
    request: obj => p(wx.request, obj),
    login: obj => p(wx.login, obj),
    startWifi: obj => p(wx.startWifi, obj),
    stopWifi: obj => p(wx.stopWifi, obj),
    getConnectedWifi: obj => p(wx.getConnectedWifi, obj),
    connectWifi: obj => p(wx.connectWifi, obj),
    showLoading: obj => p(wx.showLoading, obj),
    hideLoading: obj => p(wx.hideLoading, obj),
    showToast: obj => p(wx.showToast, obj),
    showModal: obj => p(wx.showModal, obj)
}
