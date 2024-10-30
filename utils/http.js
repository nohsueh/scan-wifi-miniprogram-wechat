const wxp = require("wxp.js")

function isSuccess(res) {
    return res.data.code === 0
}

function isFailure(res) {
    return !isSuccess(res)
}

function request(resource, method, data) {
    return wxp.request({
        url: "https://example.com/api/" + resource + "/" + method,
        method: "POST",
        data: data
    })
}

module.exports = {
    isSuccess: isSuccess,
    isFailure: isFailure,
    request: request
}
