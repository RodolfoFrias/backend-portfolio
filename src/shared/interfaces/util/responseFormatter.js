module.exports = (res, message, status) => {
    return res.status(200).json({
        message,
        status
    })
}