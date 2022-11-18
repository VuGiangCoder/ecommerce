const RESPONSE = (mes, errCode,payload = null) => {
    return {
        mes,
        errCode,
        payload,
    }
};

module.exports = RESPONSE;