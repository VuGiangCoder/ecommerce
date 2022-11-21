const bcrypt = require('bcryptjs');

const convertBcrypt = {
  hash(password) {
    // eslint-disable-next-line radix
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUND));
    return bcrypt.hashSync(password, salt);
  },
  compare(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  },
};

module.exports = convertBcrypt;
