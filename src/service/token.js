const jwt = require('jsonwebtoken');
const token = {
    createToken(payload) {
        return jwt.sign(payload,process.env.JWT_SECRET);
    },
    verifyToken(token) {
        jwt.verify(token,process.env.JWT_SECRET,(err,decode) => {
            if(err) return err.message;
            return decode;
        })
    }
}

module.exports = token;