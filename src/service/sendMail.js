// qeypqlnqumqbrmth
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  // host: "smtp.zoho.in",
  // port: 465,
  // secure: true, // true for 465, false for other ports
  service: "gmail",
  auth: {
    user: "khonghoatay@gmail.com", // generated ethereal user
    pass: "qeypqlnqumqbrmth", // generated ethereal password
  },
});

const sendMail = async (reveicer, subject, text,html) => {
  await transporter.sendMail({
    from: '"ecommerce" <khonghoatay@gmail.com>',
    to: reveicer,
    subject,
    text,
    html
  });
  console.log("đã gửi");
};

module.exports = sendMail;
