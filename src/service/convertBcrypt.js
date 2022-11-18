const bcrypt = require('bcryptjs');
const convertBcrypt = {
    hash(password) {
        const salt = bcrypt.genSaltSync(process.env.SALT_ROUND);
        return bcrypt.hashSync(password,salt);
    },
    compare(password, hashPassword) {
        return bcrypt.compareSync(password,hashPassword);
    }
}

module.exports = convertBcrypt;