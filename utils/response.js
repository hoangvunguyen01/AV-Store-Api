// status 20x: code = 0 
// status 400: code = 1
// status 401: code = 2
// status 403: code = 3
// status 50x: code = 4 
module.exports = {
    formatResponse: function(code,message,data) {
        if(data)
            return { code, message, data }
        return { code, message }
    }
}