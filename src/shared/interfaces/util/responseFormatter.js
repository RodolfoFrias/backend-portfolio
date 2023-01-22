module.exports = (res, message, status) => res.status(200).json({
        message,
        status
    })