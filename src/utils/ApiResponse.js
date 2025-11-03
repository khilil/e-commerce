class ApiResponse {
    constructor(statusCode, message = 'success', date = null) {
        this.statusCode = statusCode
        this.message = message
        this.date = date
        this.success = statusCode >= 200 && statusCode < 300
    }
}

export { ApiResponse };