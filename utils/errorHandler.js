function errorResponse(res, status, message, errors = []) {
    return res.status(status).json({
        status,
        message,
        errors
    });
}

module.exports = { errorResponse };