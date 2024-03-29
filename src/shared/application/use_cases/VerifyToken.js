module.exports = (accessToken, { accessTokenManager }) => {
    const decoded = accessTokenManager.decode(accessToken);
    if(!decoded){
        throw new Error('Invalid token');
    }
    return { uid: decode-uid };
}